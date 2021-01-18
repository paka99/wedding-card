var express = require('express');
var router = express.Router();

const {Client} = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://10.146.0.5:9200' });
// const client = new Client({node: 'http://35.200.22.62:9200'});

const esIndexName = 'visitor-message';
// const esIndexName = 'visitor-message-test';


/* 메인페이지 */
router.get('/', function (req, res, next) {
    res.render('index', {title: '아직 아무것도 안한 페이지'});
});

/* 개발용 페이지 */
router.get('/sample', function (req, res, next) {
    const pageVer = req.query.version || 'v1';

    if (pageVer === 'v2') {
        res.render('sample', {});
        return
    }

    res.render('sample', {});
});

/* 서비스용 페이지 */
router.get('/invite', function (req, res, next) {
    res.render('invite', {});
});

/* 방명록 관리 페이지 */
router.get('/invite/visitors', function (req, res, next) {
    client.search({
        index: esIndexName,
        body: {
            query: {
                match_all: {}
            },

            sort: [
                {
                    "@timestamp": {
                        "order": "desc"
                    }
                }
            ],

            size: 50,
        }
    }).then(result => {
        let allMessage = [];

        result.body.hits.hits.forEach(function (doc) {
            let msg = {
                msgId: doc._id,
                writer: doc._source.user,
                contents: doc._source.message,
                time: doc._source['@timestamp'],
            };

            let today = new Date(Date.parse(msg.time))

            const dayNames = ['(일요일)', '(월요일)', '(화요일)', '(수요일)', '(목요일)', '(금요일)', '(토요일)'];
            // getDay: 해당 요일(0 ~ 6)를 나타내는 정수를 반환한다.
            const day = dayNames[today.getDay()];

            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const date = today.getDate();
            let hour = today.getHours();
            let minute = today.getMinutes();
            let second = today.getSeconds();
            const ampm = hour >= 12 ? 'PM' : 'AM';

            // 12시간제로 변경
            hour %= 12;
            if (ampm === 'PM') {
                hour = hour || 12; // 0 => 12
            }

            // 10미만인 분과 초를 2자리로 변경
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;

            msg.time = `${year}년 ${month}월 ${date}일 ${day} ${hour}:${minute}:${second} ${ampm}`;
            // msg.time = msg.time.substring(0,19)

            allMessage.push(msg);
            // console.log(doc._source.message);
        });

        res.render('visitor-list_prod', {
            messages: allMessage,
        });
    });
});

// 내부 호출용 API: 방명록 가져오기.
router.get('/visitor', function (req, res, next) {
    client.search({
        index: esIndexName,
        body: {
            query: {
                match_all: {}
            },

            size: 50,
        }
    }).then(result => {
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

        res.json({messages: allMessage});
    });
});

// 방명록 단일 조회
router.get('/visitor/:id', function (req, res, next) {
    const docId = req.params.id || '';

    client.get({
        index: esIndexName,
        id: docId,

    }).then(result => {
        const message = {
            id: result.body._id,
            writer: result.body._source.user,
            contents: result.body._source.message,
            time: result.body._source['@timestamp'],
        };

        res.json({message});
    }).catch(result => {
        console.log("error " + result)
        res.json("error");
    });
});

// 방명록 등록
router.post('/visitor', function (req, res, next) {
    let user = req.body.writer;
    let password = req.body.password;

    let personGubun = req.body.gubun;
    let message = req.body.message;


    if (user.indexOf("컵") >= 0 || user.indexOf("cup") >= 0 || user.indexOf("크업") >= 0
        || user.indexOf("레퍼") >= 0 || user.indexOf("refer") >= 0 || user.indexOf("리퍼") >= 0) {
        res.status(414).json({status: 414})
        return;
    }

    if (message.indexOf("컵") >= 0 || message.indexOf("cup") >= 0 || message.indexOf("크업") >= 0
        || message.indexOf("레퍼") >= 0 || message.indexOf("refer") >= 0 || message.indexOf("리퍼") >= 0) {
        res.status(414).json({status: 414})
        return;
    }

    let timestamp = new Date();

    client.index({
        index: esIndexName,

        body: {
            user: user,
            password: password,
            gubun: personGubun,

            message: message,
            '@timestamp': timestamp,
        }
    });

    res.json({status: 200})
});

// 방명록 삭제
router.delete('/visitor/:id', function (req, res, next) {
    const docId = req.params.id || '';
    const userHashPwd = req.body.pwd || '';

    client.get({
        index: esIndexName,
        id: docId,

    }).then(result => {
        const hashPwd = result.body._source.password;

        if (userHashPwd === hashPwd || userHashPwd === '2be9bd7a3434f7038ca27d1918de58bd') {
            client.delete({
                index: esIndexName,
                id: req.params.id,

            }).then(
                res.status(200).json({
                    status: 200,
                    message: "삭제되었습니다.",
                })
            );

        } else {
            res.status(414).json({
                status: 414,
                message: "비밀번호가 틀렸습니다.",
            });
        }
    })
});

module.exports = router;
