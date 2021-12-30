const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: "Contact List",
        list: JSON.parse(fs.readFileSync('contacts.json'))
    });
});

module.exports = router;