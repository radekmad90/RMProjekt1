var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Aplikacja demonstracyjna - Radosław Madej'});
});

module.exports = router;
