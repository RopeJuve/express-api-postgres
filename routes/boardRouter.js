import express from 'express';
const boardRouter = express.Router();
import { getBoards , createBoard } from '../controllers/boardsControllers.js';

boardRouter.get('/', getBoards);
boardRouter.post('/', createBoard);

export default boardRouter;