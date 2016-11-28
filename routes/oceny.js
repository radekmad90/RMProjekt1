var express = require('express');
var router = express.Router();

var redis = require('../redis_db');
var setname = 'oceny';

router.get('/', function (req, res) {
    var oceny;
    redis.smembers(setname, function (err, result) {
        var arr = [];

        for (var i = 0; i < result.length ; i++) {
            arr.push({'ocena': result[i]});
        }
        oceny = {
            title: "Wszystkie oceny w zbiorze. Wykorzystujemy typ danych SET",
            oceny: arr
        };
        res.render('oceny', oceny);
    });
});

router.get('/dodaj_ocene', function (req, res) {

    res.render('dodaj_ocene', {title: "Wpisz poniżej wartość oceny:"});

});
router.post('/dodaj_ocene', function (req, res) {
        redis.sadd(setname, req.body.ocena, function (err, result) {
            var result;
            if (err != null) {
                result = 'Wystapil blad!!';
            } else if (result == 0) {
                result = 'Zduplikowany klucz';
            } else {
                result = 'Udalo sie dodac klucz: ' + req.body.ocena;
            }
            res.render('dodaj_ocene_result', {title: result});
        })
    }
);

router.get('/delete/:ocena', function (req, res) {
    redis.srem(setname, req.params.ocena, function (err, result) {
        var result;
        if (err != null) {
            result = 'Wystapil blad!';
        } else if (result == 0) {
            result = 'Nie usunieto wpisu!!';
        } else {
            result = 'Udalo sie usunac wpis ' + req.params.ocena;
        }
        res.render('usun_ocene_result', {title: result});
    })
});

module.exports = router;
