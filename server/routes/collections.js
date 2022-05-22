import express from 'express';
import Collection from '../models/collection.model.js';
import Item from '../models/item.model.js'
import multer from 'multer'

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `build/uploads/`)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.originalname.split('.').at(-1)}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) cb(null, true)
    else cb(null, false)
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        filesize: 1024 * 1024 * 5
    },
    preservePath: true
})

router.route('/').get((req, res) => {
    Collection.find().then(users => res.json(users)).catch(err => res.status(400).json(`Error: ${err}`));
})

router.post('/imageupload', upload.single('file'), (req, res, next) => {
    return res.json({
        image: req.file.filename
    })
})

router.route('/:id').get((req, res) => {
    Collection.findOne({
        _id: req.params.id
    }).then(c => res.json(c)).catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/').post(async (req, res) => {
    const {
        name,
        description,
        topic,
        imageLink = "",
        author,
        items = 0,
        created = Date.now()
    } = req.body;
    const newCollection = new Collection({
        name,
        description,
        topic,
        imageLink,
        author,
        items,
        created
    });
    await newCollection.save();
    res.json(`New collection ${name} by ${author} added!`);
});

router.route('/:id').delete((req, res) => {
    Collection.deleteOne({
        _id: req.params.id
    }).then(() => res.json('Deleted collection!')).catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:id').patch((req, res) => {
    Collection.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        })
        .then(() => res.status(200).json(`Colection updated!`))
        .catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:id/inc').patch((req, res) => {
    Collection.updateOne({
            _id: req.params.id
        }, {
            $inc: {
                items: req.body.change
            }
        })
        .then(() => res.status(200).json(`Colection updated!`))
        .catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/:id/items').get((req, res) => {
    Item.find({
        collectionId: req.params.id
    }).then(u => res.json(u)).catch(err => res.status(400).json(`Error: ${err}`))
})

export default router