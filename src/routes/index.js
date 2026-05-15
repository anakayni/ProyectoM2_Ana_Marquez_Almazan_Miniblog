import { Router } from "express";
const router = Router()

router.use('/api/authors', authorsRouter);
router.use('/api/posts', postsRouter); 

export default router;