import express from 'express';
import Comment from '../models/comment.model.js';

const router = express.Router();

router.route('/').get(async (req, res) => {
    const comments = await Comment.find()
    return res.status(200).json(comments)
})

router.route('/').post(async (req, res) => {
    const {itemId, author, content, timestamp = Date.now()} = req.body;
    const newComment = new Comment({
        itemId,
        author,
        timestamp,
        content
    });
    await newComment.save();
    res.status(200).json(`New collection by ${author} added!`);
});

export default router