const express = require('express');
const router = express.Router();

const auth = require('../config/auth');
const isAdmin = auth.isAdmin;

router.get("/", isAdmin, (req, res) => {
    res.render("admin/dashboard")
});

// Exports
module.exports = router;