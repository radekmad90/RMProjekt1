var express = require('express');
var router = express.Router();
var redis = require('../redis_db');

var hashkey = 'studenci';

router.get('/', function (req, res) {
    var studenciKeys;
    //szukamy wszystkich kluczy studentow (nr_indeksów).
    redis.keys(hashkey + '*', function (err, result) {
        var arr = [];

        for (var i = 0; i < result.length; i++) {
            //Klucz ma postac studenci:nrIndeksu dlatego musimy splitować
            arr.push({'nrIndeksu': result[i].split(':')[1]});
        }
        studenci = {
            title: "Wszystkie numery indeksów studentów. Wykorzystujemy typ danych HASH",
            count: result.length,
            studenci: arr
        };
        res.render('studenci', studenci);
    });
});

router.get('/dodaj_studenta', function (req, res) {

    res.render('dodaj_studenta', {title: "Wpisz poniżej dane studenta:"});

});
router.post('/dodaj_studenta', function (req, res) {
        //Kluczem jest studenci:nrIndeksu
        var key = hashkey + ':' + req.body.nrIndeksu;
        redis.exists(key, function (err, result) {
            if (err != null) {
                res.render('dodaj_studenta_result', {title: 'Nie udało się dodać studenta!!'});
            }
            if (result == 0) {
                //Nie ma takiego studenta, próbujemy dodać
                redis.hmset(key, 'imie', req.body.imie, 'nazwisko', req.body.nazwisko, function (err, result) {
                    var result;
                    if (err != null) {
                        result = 'Wystapil blad podczas dodawania studenta!!';
                    } else {
                        result = 'Udalo sie dodac studenta o numerze indeksu: ' + req.body.nrIndeksu;
                    }
                    res.render('dodaj_studenta_result', {title: result});
                });
            } else {
                res.render('dodaj_studenta_result', {title: 'Student o takim numerze indeksu istnieje!!'});
            }
        });

    }
);

router.get('/modyfikuj_studenta/:nrIndeksu', function (req, res) {
    redis.hgetall(hashkey + ':' + req.params.nrIndeksu, function (err, result) {
        res.render('modyfikuj_studenta', {
            nrIndeksu: req.params.nrIndeksu,
            imie: result.imie,
            nazwisko: result.nazwisko,
            title: "Wpisz poniżej dane studenta:"
        });
    });

});
router.post('/modyfikuj_studenta', function (req, res) {
        //Kluczem jest studenci:nrIndeksu
        var key = hashkey + ':' + req.body.nrIndeksu;
        //Nie ma takiego studenta, próbujemy dodać
        redis.hmset(key, 'imie', req.body.imie, 'nazwisko', req.body.nazwisko, function (err, result) {
            var result;
            if (err != null) {
                result = 'Wystapil blad!!';
            } else {
                result = 'Udalo sie zmodyfikowac studenta o numerze indeksu: ' + req.body.nrIndeksu;
            }
            res.render('modyfikuj_studenta_result', {title: result});
        });
    }
);

router.get('/delete/:nrIndeksu', function (req, res) {
    var key = hashkey + ':' + req.params.nrIndeksu;
    redis.del(key, function (err, result) {
        var result;
        if (err != null) {
            result = 'Wystapil blad!';
        } else if (result == 0) {
            result = 'Nie usunieto wpisu!!';
        } else {
            result = 'Udalo sie usunac studenta o numerze indeksu ' + req.params.nrIndeksu;
        }
        res.render('usun_studenta_result', {title: result});
    })
});

router.get('/szczegoly_studenta/:nrIndeksu', function (req, res) {
    redis.hgetall(hashkey + ':' + req.params.nrIndeksu, function (err, result) {
        if (result.imie == undefined) {
            res.render('brak_studenta', {title:'Nie ma studenta o podanym numerze indeksu!!'});
        } else {
            res.render('szczegoly_studenta', {
                nrIndeksu: req.params.nrIndeksu,
                imie: result.imie,
                nazwisko: result.nazwisko,
                title: "Szczegóły studenta"
            });
        }

    });
})

module.exports = router;
