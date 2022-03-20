const express = require("express");
const router = new express.Router();
const { ReturnUserData } = require('./database')
const { authenticateUser } = require('./user')

router.post('/', authenticateUser, async (req, res) => {
    const userId = req.user.id;
    const userData = await ReturnUserData(userId).catch(err => {
        return res.status(500).send("Database_error");
    });
    if (userData === undefined) {
        res.status(404).send('user stats not found');
    }
    res.json(userData).send();
})

module.exports = router;