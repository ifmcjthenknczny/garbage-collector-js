import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/users.js';
import itemRouter from './routes/items.js';
import collectionRouter from './routes/collections.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
app.use(express.static("build"));
app.use(express.json());
app.use(cors());

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connected!")
})

app.use('/api/users', userRouter);
app.use('/api/items', itemRouter);
app.use('/api/collections', collectionRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});