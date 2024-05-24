const jwt = require("jsonwebtoken");
const User = require('../Models/User');
require('dotenv').config();

const authentication = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization']
        if (bearerHeader != null && bearerHeader.startsWith("Bearer ")) {
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1]
            req.headers['authorization'] = bearerToken
            jwt.verify(bearerToken, process.env.JWT_SECRET, async (err, rel) => {
                if (err) res.status(401).json({ message: err });
                else {
                    req.user = await User.findById(rel.id).populate('roles');

                    if (req.user.tokens.includes(bearerToken)) {
                        next();
                    } else {
                        res.status(401).json({ message: "Invalid token" });
                    }
                }
            });
        } else {
            res.status(401).json({ message: "Access Denied!, no token entered" });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

module.exports = authentication;