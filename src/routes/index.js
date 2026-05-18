import { Router } from "express";
import authorsRouter from './authors.js';
import postsRouter from './posts.js';

const router = Router();

router.use('/authors', authorsRouter);  // ✅ router, no app
router.use('/posts', postsRouter);       // ✅ router, no app

export default router;