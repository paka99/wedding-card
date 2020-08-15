var express = require('express');
var router = express.Router();

const { Client } = require('@elastic/elasticsearch');
// const client = new Client({ node: 'http://34.85.40.22:9200' });
const client = new Client({ node: 'http://10.146.0.2:9200' });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/sample', function(req, res, next) {
    res.render('sample', {} );
});

router.get('/visitor', function (req, res, next) {
    client.search({
        index: "visitor-message",
        body: {
            query: {
                match_all: {}
            }
        }
    }).then( result => {
        let allMessage = [];

        result.body.hits.hits.forEach(function (doc) {
            allMessage.push(doc._source.message);
            // console.log(doc._source.message);
        });

        res.json({messages : allMessage});
    });

});

router.post('/visitor', function (req, res, next) {
    let user = req.body.writer;
    let message = req.body.message;

    let timestamp = new Date();

    client.index({
        index: "visitor-message",

        body: {
            user: user,
            message: message,
            '@timestamp':  timestamp,
        }
    });

    res.json({status: 200})
});

module.exports = router;
