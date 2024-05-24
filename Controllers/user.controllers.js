const User = require('../Models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const getUsers = async (req, res) => {
    try {
        const resultPerPage = 10;
        await User.find({})
            .then(async (ref) => {
                const numberOfResult = ref.length;
                if (ref != null && numberOfResult > 0) {
                    const numberOfPage = Math.ceil(numberOfResult / resultPerPage);
                    let page = req.query.page ? Number(req.query.page) : 1;
                    if (page > numberOfPage) res.redirect('/?page=' + encodeURIComponent(numberOfPage));
                    else if (page < 1) res.redirect('/?page=' + encodeURIComponent('1'));
                    const startingLimit = (page - 1) * resultPerPage;
                    await User.find(req.query).select(['-otp', '-password']).skip(startingLimit).limit(resultPerPage)
                        .then(ref => res.status(200).json({
                            cout: ref.length,
                            totalCount: numberOfResult,
                            totalPages: numberOfPage,
                            page,
                            firstItemIndex: startingLimit,
                            lastItemIndex: startingLimit + (ref.length - 1),
                            data: ref
                        }))
                        .catch(err => res.status(500).json({ message: err }))
                } else
                    res.status(200).json({
                        cout: 0,
                        totalCount: 0,
                        totalPages: 0,
                        page: 0,
                        firstItemIndex: 0,
                        lastItemIndex: 0,
                        data: []
                    })
            })
            .catch(err => res.status(500).json({ message: err }))
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const postUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
          username: 'user',
          password: hashedPassword,
          roles: ['664d9f2ec111b6abfb968bd1']
        });

    } catch (error) {
        res.status(404).json({ message: error })
    }
}

const getUser = async (req, res) => {
    try {
        await User.findById(req.params.id).select(['phone', 'name', 'image'])
            .then(ref => res.status(200).json(ref))
            .catch(err => res.status(404).json({ message: err }))
    } catch (error) {
        res.status(404).json({ message: error })
    }
}

const updateUser = async (req, res) => {
    try {
        let data = req.body
        if (data.phone != null) {
            delete data.phone
        }
        await User.findByIdAndUpdate(jwt.decode(req.header("user")).id, { $set: data }, { new: true, upsert: true, setDefaultsOnInsert: true })
            .then(ref => res.status(200).json(ref))
            .catch(err => res.status(404).json({ message: err }))
    } catch (error) {
        res.status(404).json({ message: error })
    }
}

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id)
            .then(ref => res.status(200).json(ref))
            .catch(err => res.status(404).json({ message: err }))
    } catch (error) {
        res.status(404).json({ message: error })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).populate('roles');

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await User.findByIdAndUpdate(user._id,
            { $push: { tokens: token } },
            // { $set: { tokens: [token] } },
            { new: true });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getUsers,
    postUser,
    getUser,
    updateUser,
    deleteUser,
    loginUser
}