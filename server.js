import express from 'express';
const app = express();
import boardRouter from './routes/boardRouter.js';

app.use(express.json());
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Welcome to the WBS API!');
});

app.use('/api/boards', boardRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
