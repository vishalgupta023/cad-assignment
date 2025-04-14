import express from 'express';
import * as blocksController from "../controllers/BlockController.js"

const router = express.Router();

// Block routes
router.get('/', blocksController.getBlocks);
router.get('/file/:fileId', blocksController.getBlocksByFileId);
router.get('/:id', blocksController.getBlockById);

export default router;