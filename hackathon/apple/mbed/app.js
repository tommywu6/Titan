var koa = require('koa');
var Router = require('koa-router');
var logger = require('koa-logger');
var serve = require('koa-static');
var app = koa();
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);
var events = require('events');
var render = require('./lib/render.js');

var router = new Router();
var eventEmitter = new events.EventEmitter();

var sensorID;
var R_1,R_2,R_3,R_4;

app.use(logger());
app.use(serve(__dirname+'/lib'));

router.get('/',index);
router.get('/mbed/:sensorID/:w1/:w2/:w3/:w4/',mbed);


io.sockets.on('connection',function(client){
  eventEmitter.on('update',function(){
    client.emit('event',{
                         sensorID:sensorID,
                         R_1:R_1,
                         R_2:R_2,
                         R_3:R_3,
                         R_4:R_4,
                       });
  });
});

function * index(){
  this.body = yield render('index');
}

function * mbed(){
  let request = this.params;
  sensorID = request.sensorID;
  var w1=this.params.w1;
  var w2=this.params.w2;
  var w3=this.params.w3;
  var w4=this.params.w4;
  if(w1>1450){
    w1=1450;
  }else if (w1<0) {
    w1=0;
  }
  if(w2>1450){
    w2=1450;
  }else if (w2<0) {
    w2=0;
  }
  if(w3>1450){
    w3=1450;
  }else if (w3<0) {
    w3=0;
  }
  if(w4>1450){
    w4=1450;
  }else if (w4<0) {
    w4=0;
  }
  R_1 = w1/1450*100;
  R_2 = w2/1450*100;
  R_3 = w3/1450*100;
  R_4 = w4/1450*100;
  eventEmitter.emit('update');
  this.body = {
    R_1:R_1,
    R_2:R_2,
    R_3:R_3,
    R_4:R_4
  }
}
app.use(router.middleware());
server.listen(3000,function(){
  console.log('listening on port 3000');
});
