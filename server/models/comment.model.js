import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    author: String,
    itemId: String,
    timestamp: Date,
    content: String
});
const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;