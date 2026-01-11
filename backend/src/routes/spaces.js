import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Endpoint not implemented yet' });
});

export default router;
