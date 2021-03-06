import express from 'express';
import Item from '../models/item.model.js';
import Comment from '../models/comment.model.js';

const router = express.Router();

router.route('/').get((req, res) => {
    Item.find().then(users => res.json(users)).catch(err => res.status(400).json(`Error: ${err}`));
})

router.route('/').post(async (req, res) => {
    const {name, tags=[], rest={}, added = Date.now(), collectionId, likesFrom=[]} = req.body;
    const newItem = new Item({
        name,
        tags,
        rest,
        added,
        collectionId,
        likesFrom
    });
    await newItem.save();
    res.json("Item registered!");
});

router.route('/:itemId').get((req, res) => {
    Item.findOne({
        _id: req.params.itemId
    }).then(u => res.json(u)).catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:itemId').delete(async (req, res) => {
    await Item.deleteOne({
        _id: req.params.itemId
    })
    await Comment.deleteMany({
        itemId: req.params.itemId
    })
    return res.json('Deleted!')
})

router.route('/:itemId').patch((req, res) => {
    Item.updateOne({
            _id: req.params.itemId
        }, {
            $set: req.body
        })
        .then(() => res.status(200).json(`Item updated!`))
        .catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:itemId/comments').get((req, res) => {
    Comment.find({
        itemId: req.params.itemId
    }).then(u => res.json(u)).catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:id/like').patch((req, res) => {
    Item.updateOne({
            _id: req.params.id
        }, {
            $push: {
                likesFrom: req.body.payload
            }
        })
        .then(() => res.status(200).json(`Colection updated!`))
        .catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:id/unlike').patch((req, res) => {
    Item.updateOne({
            _id: req.params.id
        }, {
            $pull: {
                likesFrom: req.body.payload
            }
        })
        .then(() => res.status(200).json(`Colection updated!`))
        .catch(err => res.status(400).json(`Error: ${err}`))
})

export default router