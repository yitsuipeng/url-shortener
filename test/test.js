const { dbStatus } = require('../db');
const { app } = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { doesNotMatch } = require('assert');

chai.use(chaiHttp);
const assert = chai.assert;
const requester = chai.request(app).keepOpen();

before(async () => {
    if (dbStatus !== 'test') {
        throw 'Not in test db';
    } else {
        console.log('it is test mode');
    }

});

describe('post api', async() => {

    it('post api with valid url', async () => {
        const testUrl = {
            longUrl: "https://date-saver.online/"
        };

        const res = await requester
            .post('/api/url/shorten')
            .send(testUrl);

        assert.equal(res.body.shortenUrl, "http://54.150.14.134/TuZkYezD");
        assert.equal(res.status, 200);

    });

    it('post api with invalid url', async () => {
        const testUrl = {
            longUrl: "https://*.com"
        };

        const res = await requester
            .post('/api/url/shorten')
            .send(testUrl)

        assert.equal(JSON.stringify(res.body), "Invalid long url");
        assert.equal(res.status, 401);
        done();

    });

});

describe('get api', function() {

    it('get api with stored url', () => {

        requester
            .get('/TuZkYezD')
            .then(function (res) {
                chai.expect(res).to.redirectTo('https://date-saver.online/')
            })
            .catch(function (err) {
            throw err;
            });

    });

    it('get api with stored url', async() => {

        const res = await requester
            .get('/aaaaaa');

        assert.equal(JSON.stringify(res.body), '"No Url Found"');
        assert.equal(res.status, 404);

    });

});


