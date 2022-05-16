import express from 'express';
import User from '../models/user.model.js';
import Collection from '../models/collection.model.js'

const router = express.Router();

router.route('/').get((req, res) => {
    User.find().then(users => res.json(users)).catch(err => res.status(400).json(`Error: ${err}`));
})

router.route('/').post(async (req, res) => {
    const {username, email, lastLogin, registrationTime,isActive,isAdmin, password} = req.body;
    const newUser = new User({
        username,
        email,
        lastLogin,
        registrationTime,
        isActive,
        isAdmin,
        password
    });
    await newUser.save();
    res.json("User registered!");
});

router.route('/:username').get((req, res) => {
    User.findOne({
        username: req.params.username
    }).then(u => res.json(u)).catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:username').delete((req, res) => {
    User.deleteOne({
        username: req.params.username
    }).then(() => res.json('Deleted!')).catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:username').patch((req, res) => {
    User.updateOne({
            username: req.params.username
        }, {
            $set: req.body
        })
        .then(() => res.status(200).json(`User ${req.params.username} updated!`))
        .catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:username/collections').get((req, res) => {
    Collection.find({
        author: req.params.username
    }).then(u => res.json(u)).catch(err => res.status(400).json(`Error: ${err}`))
})

export default router