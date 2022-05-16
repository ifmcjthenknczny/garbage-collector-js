import mongoose from 'mongoose';

const ColletionSchema = new mongoose.Schema({
    name: String,
    description: String,
    topic: String,
    imageLink: String,
    author: String,
    items: Number,
    created: Date
});
const Collection = mongoose.model('Collection', ColletionSchema);

export default Collection;