var express = require('express');
var router = express.Router();

var redis = require('../redis_db');
var sortedsetname = 'przedmioty';

router.get('/', function (req, res) {
    var przedmioty;
    //Pobieramy wszystkie elementy w zbiorze, stad -1
    redis.zrange(sortedsetname, 0, -1, 'WITHSCORES', function (err, result) {
        var arr = [];

        for (var i = 0; i < result.length; i = i + 2) {
            arr.push({'przedmiot': result[i], 'score': result[i + 1]});
        }
        przedmioty = {
            title: "Wszystkie przedmioty w zbiorze. Wykorzystujemy typ danych SORTEDSET",
            przedmioty: arr
        };
        res.render('przedmioty', przedmioty);
    });
});

router.get('/dodaj_przedmiot', function (req, res) {

    res.render('dodaj_przedmiot', {title: "Wpisz poniżej nazwe przedmiotu oraz ważność:"});

});
router.post('/dodaj_przedmiot', function (req, res) {
        redis.zadd(sortedsetname, req.body.score, req.body.przedmiot, function (err, result) {
            var result;
            if (err != null) {
                result = 'Wystapil blad!!';
            } else if (result == 0) {
                result = 'Nadpisano ważność klucza ' + req.body.przedmiot;
            } else {
                result = 'Udalo sie dodac klucz: ' + req.body.przedmiot;
            }
            res.render('dodaj_przedmiot_result', {title: result});
        })
    }
);

router.get('/delete/:przedmiot', function (req, res) {
    redis.zrem(sortedsetname, req.params.przedmiot, function (err, result) {
        var result;
        if (err != null) {
            result = 'Wystapil blad!';
        } else if (result == 0) {
            result = 'Nie usunieto wpisu!!';
        } else {
            result = 'Udalo sie usunac wpis ' + req.params.przedmiot;
        }
        res.render('usun_przedmiot_result', {title: result});
    })
});

module.exports = router;
