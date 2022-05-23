import express from 'express';
import {
    generateProjectObject,
    generateQuerySyntax,
    generateSearchResultObject
} from '../helpers.js';
import Collection from '../models/collection.model.js';
import Comment from '../models/comment.model.js';
import Item from '../models/item.model.js';

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

router.route('/search/:query').get(async (req, res) => {
    const query = req.params.query.replaceAll('+', ' ')
    const searchResults = await Item.aggregate([generateQuerySyntax('search', query), generateProjectObject("name", "collectionId")])
    const commentSearchResult = await Comment.aggregate([generateQuerySyntax('searchcomments', query), generateProjectObject("itemId")])
    const collectionSearchResult = await Collection.aggregate([generateQuerySyntax('searchcollections', query), generateProjectObject()])
    let checkedItems = {};
    searchResults.forEach(r => checkedItems[r._id] = r.score);

    for (let result of commentSearchResult) {
        if (!checkedItems[result.itemId]) {
            const itemFromComment = await Item.findOne({
                _id: result.itemId
            })
            if (!itemFromComment) continue
            searchResults.push(generateSearchResultObject(itemFromComment, result.score))
            checkedItems[result.itemId] = result.score
        } else if (checkedItems[result.itemId] < result.score && searchResults.findIndex(obj => `${obj._id}` === `${result.itemId}`) !== 1) {
            searchResults[index].score = result.score
        }
    }
    for (let result of collectionSearchResult) {
        const itemsFromCollectionSearch = await Item.find({
            collectionId: result._id
        })
        for (let item of itemsFromCollectionSearch) {
            if (!checkedItems[item._id]) {
                searchResults.push(generateSearchResultObject(item, result.score))
            } else if (checkedItems[item._id] < result.score && searchResults.findIndex(obj => `${obj._id}` === `${item._id}`) !== 1) {
                searchResults[index].score = result.score
            }
        }
    }
    return res.status(200).json(searchResults.sort((a, b) => b.score - a.score).slice(0, 10))
})

export default router