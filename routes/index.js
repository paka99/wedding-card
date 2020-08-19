var express = require('express');
var router = express.Router();

const { Client } = require('@elastic/elasticsearch');
// const client = new Client({ node: 'http://35.200.22.62:9200' });
const client = new Client({ node: 'http://10.146.0.3:9200' });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/sample', function(req, res, next) {
    res.render('sample', {} );
});

router.get('/invite', function(req, res, next) {
    res.render('invite', {} );
});

router.get('/visitor', function (req, res, next) {
    client.search({
        index: "visitor-message",
        body: {
            query: {
                match_all: {}
            },

            size: 50,
        }
    }).then( result => {
        let allMessage = [];

        result.body.hits.hits.forEach(function (doc) {
            let msg = {
                writer: doc._source.user,
                contents: doc._source.message,
                time: doc._source['@timestamp'],
            };

            allMessage.push(msg);
            // console.log(doc._source.message);
        });

        res.json({messages : allMessage});
    });

});

router.post('/visitor', function (req, res, next) {
    let user = req.body.writer;
    let password = req.body.password;

    let personGubun = req.body.gubun;
    let message = req.body.message;

    let timestamp = new Date();

    client.index({
        index: "visitor-message",

        body: {
            user: user,
            password: password,
            gubun: personGubun,

            message: message,
            '@timestamp':  timestamp,
        }
    });

    res.json({status: 200})
});

module.exports = router;
