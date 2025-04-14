import express from 'express';
import filesRoutes from './files.js';
import blocksRoutes from './blocks.js';

const router = express.Router();

// API routes
router.use('/files', filesRoutes);
router.use('/blocks', blocksRoutes);

export default router;