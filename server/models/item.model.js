import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
    name: String,
    tags: Array,
    collectionId: String,
    added: Date,
    rest: Map,
    likesFrom: Array
});
const Item = mongoose.model('Item', ItemSchema);

export default Item;