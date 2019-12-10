const express  = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dns = require('dns');
const bluebird  = require('bluebird');
const _ = require('lodash');
const async = require('async');
const net = require('net');
const email_verifier = require('./lib/email-verifier');

const dnscache = require('dnscache')({
        "enable" : true,
        "ttl" : 24*60*60,
        "cachesize" : 10000
});
const dnsPromises = bluebird.promisify(dnscache.resolveMx);
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));

app.listen(8080,'localhost',()=>console.log("Server Connected....."));