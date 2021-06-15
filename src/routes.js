// This module controls all the URLs available for the web app

var express = require('express');
var crypto = require('crypto')

var router = express.Router();

router.get('/', function(req, res) {
    res.render('index')
})

router.get('/show', function(req, res) {
    if (typeof req.query.id !== 'undefined') {
        var path = `/auth/hls/sign?ts=${Math.round(Date.now() / 1000)}&hn=${req.query.id}&d=android-tablet`
        var sig = crypto.createHmac('sha256', 'android.content.res.Resources').update(path).digest('hex')
        try {
            var type = 'show'
            if(isInteger(req.query.id)) {
                type = 'series'
            }
            res.render('show', {progtype: type, query : req.query, notExists: false, dir: path, signature: sig})
        }
        catch(err) {
            res.render('show', {query: Object(id = 'Not Found'), notExists: true})
        }
    }
    else {
        res.render('show', {query: Object(id = 'Not Found'), notExists: true})
    }
})

module.exports = router;

function isInteger(value) {
    return /^\d+$/.test(value);
}