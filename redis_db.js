
var Redis = require('ioredis');

var redis = new Redis({
    port: 18280,          // Redis port
    host: 'redis-18280.c10.us-east-1-4.ec2.cloud.redislabs.com',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: 'lab',
    db: 0
});

redis.on('connect', function () {
    console.log('Poprawnie polaczono do bazy danych');
});

module.exports = redis;