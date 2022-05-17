import express from 'express';
import Comment from '../models/comment.model.js';

const router = express.Router();

router.route('/').post(async (req, res) => {
    const {itemId, author, content, timestamp = Date.now()} = req.body;
    const newComment = new Comment({
        itemId,
        author,
        timestamp,
        content
    });
    await newComment.save();
    res.json(`New collection by ${author} added!`);
});

export default router