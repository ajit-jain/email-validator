const express  = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dns = require('dns');
const bluebird  = require('bluebird');
const _ = require('lodash');
const async = require('async');
const net = require('net');
const email = "ajit.x@venturepact.com";
const dnscache = require('dnscache')({
        "enable" : true,
        "ttl" : 300,
        "cachesize" : 1000
    });
    const dnsPromises = bluebird.promisify(dnscache.resolveMx);
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));

// app.get('/',(req,res,next)=>{
    bluebird.coroutine(function*(){
    let MxRecords = yield dnsPromises('venturepact.com');
    MxRecords = _.sortBy(MxRecords,function(item){
      return item.priority;
    });
    console.log(MxRecords);
    async.detect(MxRecords,(record,callback)=>{
      //console.log("DD",checkEmailByMessage(record));
          let result =checkEmailByMessage(record);
          result.then(status=>callback(null,true));
    },(err,r)=>{
        console.log(r);
    })
    
  }).apply(this).catch((err)=>{
    console.log(err);
  });

function checkEmailByMessage(record){
    return new Promise((resolve,reject)=>{
          console.log(record['exchange']);
          setupConnection(record);
    });

}
function setupConnection(record){
  let client = net.createConnection(25,record['exchange'],()=>{
            console.log("Connected");
          });  
          client.on('error',(error)=>{
            console.log("error");
            client.emit('end');
          });
          client.on('data',(data)=>{
            console.log("Received data",data);
            resolve(true);
          });
}
app.listen(8080,'localhost',()=>console.log("Server Connected....."));