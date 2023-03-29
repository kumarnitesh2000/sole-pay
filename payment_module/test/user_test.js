const server = require('../apis');
const should = require('should');
const request = require('supertest');
const HttpStatus = require('http-status-codes');
const {registerMerchantBody} = require('./resources/body');
const merchant = require("../models/merchant");

describe('test for user registration', function () {
    it('register a merchant',function (done){
        request(server)
        .post('/online/user/register')
        .send(registerMerchantBody)
        .expect(HttpStatus.OK)
        .end(function(err, res) {
            should.not.exist(err);
            res.body.should.have.keys("hash");
            done();
        });
    })
    after((done) => {
        const {phoneNumber} = registerMerchantBody;
        merchant.deleteOne({phoneNumber}).then(_ => done()).catch(err => done(err))
    })
})
