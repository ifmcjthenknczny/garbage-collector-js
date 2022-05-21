import express from 'express';
import Item from '../models/item.model.js';
import Collection from '../models/collection.model.js';

const router = express.Router();

router.route('/latest-items').get(async (req, res) => {
    const collections = await Item.find()
    const sortedCollections = Object.values(collections).sort((a, b) => b.added.getTime() - a.added.getTime());
    return res.status(200).json(sortedCollections.slice(0, 5));
})

router.route('/biggest-collections').get(async (req, res) => {
    const collections = await Collection.find()
    const sortedCollections = Object.values(collections).filter(c => c.items > 0).sort((a, b) => b.items - a.items);
    return res.status(200).json(sortedCollections.slice(0, 5));
})

router.route('/tags').get(async (req, res) => {
    const tagArrays = await Item.distinct('tags')
    return res.status(200).json(tagArrays);
})

export default router