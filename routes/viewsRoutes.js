import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    const testUser = {
        name: "fabio",
        last_name: "bianchi"
    };
    res.render('index', testUser);
});

export default router;