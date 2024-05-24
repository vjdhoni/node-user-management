const mongoose = require('mongoose');
const Role = require('./Models/Role');
const Permission = require('./Models/Permission');
const Endpoint = require('./Models/Endpoint');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');
const { EndUser, Hospital, Admin } = require('./Models/Types')
require('dotenv').config()

const seed = async () => {
  await Permission.deleteMany({});
  await Role.deleteMany({});
  await Endpoint.deleteMany({});
  await User.deleteMany({});

  const permissions = await Permission.create([
    { name: 'user_get' },
    { name: 'user_post' },
    { name: 'user_patch' },
    { name: 'user_delete' }
  ]);

  const adminRole = await Role.create({
    name: 'admin',
    permissions: permissions.map(p => p._id)
  });

  const userRole = await Role.create({
    name: 'user',
    permissions: permissions.filter(p => p.name === 'user_patch').map(p => p._id)
  });

  await Endpoint.create([
    { path: '/api/v1/user', method: 'GET', permissions: [permissions[0]._id]},
    // { path: '/manage', method: 'GET', permissions: [permissions[1]._id, permissions[2]._id] },
    // { path: '/read', method: 'GET', permissions: [permissions[0]._id] }
  ]);

  const hashedPassword = await bcrypt.hash('admin123', 10);

  try {
    await EndUser.create({
      username: 'endUser',
      age: 26,
      gender: 'male',
      specialization: 'healthcare',
      password: hashedPassword,
      roles: [userRole._id],
      location: "Coimbatore"
    });
  } catch (error) {
    console.log(error.message);
  }

  console.log('Database seeded!');
};

module.exports = seed;
