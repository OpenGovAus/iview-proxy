const express = require('express');
const crypto = require('crypto')
const requests = require('request')  // I usually use Python and this just makes my life easier

var router = express.Router();

router.get('/', function(req, res) {
    res.render('index')
})

var progtype = 'show'

router.get('/show', function(req, res) {
    if (typeof req.query.id !== 'undefined') {
        var path = `/auth/hls/sign?ts=${Math.round(Date.now() / 1000)}&hn=${req.query.id}&d=android-tablet`
        var sig = crypto.createHmac('sha256', 'android.content.res.Resources').update(path).digest('hex')
        try {
            if(isInteger(req.query.id)) {
                requests('https://api.iview.abc.net.au/v2/show/' + req.query.id, { json: true }, function (error, response, body) {
                    if(body['type'] == 'series') {
                        res.render('show', {progtype: 'series', query : req.query, notExists: false, dir: path, signature: sig})       
                    } else {
                        res.render('show', {progtype: 'show', query : req.query, notExists: false, dir: path, signature: sig})       
                    }
                })
            } else {
                res.render('show', {progtype: progtype, query : req.query, notExists: false, dir: path, signature: sig})
            }
        }
        catch(err) {
            console.log(err)
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