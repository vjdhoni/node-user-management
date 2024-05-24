const Endpoint = require('../Models/Endpoint');
const Role = require('../Models/Role');

const authorizeEndpoint = async (req, res, next) => {
  const userRoles = req.user.roles.map(role => role._id);
  let path = req.baseUrl + req.route.path;
  if (path.slice(path.length - 1, path.length) === '/') {
    path = path.slice(0, path.length - 1)
  }
  const endpoint = await Endpoint.findOne({ path, method: req.method }).populate('permissions');
  if (!endpoint) {
    return res.status(404).json({ message: 'Endpoint not found' });
  }

  const userPermissions = new Set();
  for (const roleId of userRoles) {
    const role = await Role.findById(roleId).populate('permissions');
    role.permissions.forEach(permission => userPermissions.add(permission.name));
  }

  const endpointPermissions = endpoint.permissions.map(permission => permission.name);
  const hasPermission = endpointPermissions.every(permission => userPermissions.has(permission));

  if (!hasPermission) {
    return res.status(403).json({ message: `Contact admin you don't have access` });
  }

  next();
};

module.exports = authorizeEndpoint;
