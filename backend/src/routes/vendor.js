import express from 'express';

const router = express.Router();

// Mock data
const MOCK_STATS = {
    totalSales: 15430,
    totalOrders: 42,
    totalProducts: 15,
    balance: 2350,
};

const MOCK_ORDERS = [
    { id: 1001, customer: "Jean Dupont", total: 120, status: "completed", date: "2024-03-10" },
    { id: 1002, customer: "Marie Curie", total: 450, status: "pending", date: "2024-03-11" },
    { id: 1003, customer: "Pierre Martin", total: 85, status: "completed", date: "2024-03-11" },
    { id: 1004, customer: "Sophie Germain", total: 210, status: "cancelled", date: "2024-03-12" },
    { id: 1005, customer: "Blaise Pascal", total: 340, status: "pending", date: "2024-03-13" },
];

// GET /api/vendor/stats
router.get('/stats', (req, res) => {
    // In a real app, filter by req.user.id
    res.json(MOCK_STATS);
});

// GET /api/vendor/orders
router.get('/orders', (req, res) => {
    // In a real app, filter by req.user.id
    res.json(MOCK_ORDERS);
});

export default router;
