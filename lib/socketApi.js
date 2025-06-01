const
  ws = require('ws'),
  crypto = require('crypto');

const
  publicUrl  = 'wss://stream.crypto.com/exchange/v1/market',
  privateUrl = 'wss://stream.crypto.com/exchange/v1/user';

class SocketClient {

  constructor(url, onConnected) {
    this._id = 1; // Request ID, incrementing
    this._onConnected = onConnected;
    this._createSocket(url);
    this._promises = new Map();
    this._handles = new Map();
  }

  _createSocket(url) {
    this._ws = new ws(url);

    this._ws.onopen = async () => {
console.log('ws connected');
      setInterval( () => { this._ws.ping( () => {}) } , 20000); // keep socket alive
      setInterval( () => {
        switch(this._ws.readyState) {
          case 1: this._ws.ping( () => {}); break;
          case 2: case 3: this._ws.terminate(); break;
          default: console.log('ws ping pending. readyState='+this._ws.readyState); break;
        };
      } , 30000); // keep socket alive
      if(this._onConnected!==undefined) { this._onConnected(); };
    };

    this._ws.onclose = () => {
console.log('ws closed');
      this._ws.emit('closed');
      this._promises.forEach((cb, id) => {
        this._promises.delete(id);
//        cb.reject(new Error('Disconnected'));
      });
//      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onerror = err => {
//      logger.warn('ws error', err);
//      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onmessage = msg => {
//      console.log('<', msg.data);
//      try {
        const message = JSON.parse(msg.data);
console.log(message);
        switch(message.method) {
          case "public/auth":
            if(message.code==0) { this._ws.emit('authenticated'); };
            break;

          case "public/heartbeat":
            const pong={
              id: message.id,
              method: "public/respond-heartbeat"
            };
            this._ws.send(JSON.stringify(pong));
            break;

          default:
            const id=(message.hasOwnProperty("result") && message.result.hasOwnProperty("id")?message.result.id:message.id);
            if (id>=0) {
              if (this._promises.has(id)) {
                const cb = this._promises.get(id);
                this._promises.delete(id);
                if (message.code==0) {
                  const result=(message.hasOwnProperty("result")?message.result:{});
                  cb.resolve(result);
                } else if (message.code!==0) { 
                  cb.reject(message);
                } else { console.log('Unprocessed response', message); }
              } else { console.log('Promise already deleted', id) };
            };
            if(message.hasOwnProperty("result") && message.result.hasOwnProperty("data")) {
              const
                symbol=message.result.instrument_name,
                data=message.result.data,
                parts=message.result.channel.split(".");
              var method;
              switch(parts[0]) {
                case "user": method=parts[0]+"."+parts[1]; break;
                default: method=parts[0]; break;
              };

              var param={... message.result};
              delete param.data;
              delete param.channel;
              delete param.subscription;
              delete param.instrument_name;

//console.log("READY",message,method,symbol,param);

              if (this._handles.has(method)) { this._handles.get(method).forEach(cb => { cb(method,data,symbol,param); }); } 
              else { console.log('Unprocessed method:'+method, message); };

            }
//          } catch (e) {
//            console.log('Fail parse message', e);
//          }

            break;
        };

    };

//    this._ws.on('ping', (msg) => {
//      const message = JSON.parse(msg.data);
//      console.log("PING",message);
//    });
  }

  request(method, channel, options) {
    if (this._ws.readyState === ws.OPEN) {
      return new Promise((resolve, reject) => {
        const requestId = ++this._id;
        this._promises.set(requestId, {resolve, reject});
        var data = {
          "id":requestId,
          "method": method,
          "params": { options }
        };      
        if(channel!==undefined) { data.params["channels"]=[channel]; };
        const msg = JSON.stringify(data);
        console.log('>', msg);
        this._ws.send(msg);
        setTimeout(() => {
          if (this._promises.has(requestId)) {
            this._promises.delete(requestId);
            console.log(">timeout",msg);
            reject(new Error('Timeout'));
          }
        }, 10000);
      });

    } else {
      return Promise.reject(new Error('WebSocket connection not established'))
    }

  }

  setHandler(key, callback) {
    if (!this._handles.has(key)) { this._handles.set(key, []); };
    this._handles.get(key).push(callback);
  }

  clearHandler(key) {
    if (this._handles.has(key)) { this._handles.delete(key); };
  }

  clearHandlers() {
    this._handles.forEach((value,key,map) => { this.clearHandler(key); });
  }
}

//function heartbeat(handler) {
//
//  console.log("ping");
//  clearTimeout(handler.pingTimeout)
//
//  // Use `WebSocket#terminate()`, which immediately destroys the connection,
//  // instead of `WebSocket#close()`, which waits for the close timer.
//  // Delay should be equal to the interval at which your server
//  // sends out pings plus a conservative assumption of the latency.
//
////  var config=this.user;
//
//  handler.pingTimeout = setTimeout(() => {
//    logger.debug("Terminate socket "+handler.readyState);
//    handler._ws.terminate();
//  }, 30000 + 5000);
//
//}

var CryptoSocket = function(url, keys) {
  this.baseURL = url;
  this.timeout = 5000;
  this.initialized = false;
  this.authenticated = false;
  this.socket = new SocketClient(url, () => {
    this.initialized=true;
    if(keys!=undefined) { this.login(this, keys); } else { this.socket._ws.emit('initialized'); };
  });
};

CryptoSocket.prototype.login = async function(ws, api) {

  const
    stamp=Date.now(),
    method="public/auth";

  const options={
    id: ++ws.socket._id,
    method: method,
    api_key: api.apikey,
    params: {},
    nonce: stamp,
  };

  var source=method + options.id + api.apikey + stamp;
  let signature = encodeURIComponent( crypto.createHmac('sha256', api.secret).update(source).digest('hex') );
  options.sig=signature;

  ws.socket._ws.send(JSON.stringify(options));

};

module.exports = {
  publicApi: function() { return new CryptoSocket(publicUrl, undefined); },
  privateApi: function(keys) { return new CryptoSocket(privateUrl, keys); }
};

CryptoSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

CryptoSocket.prototype.clearHandler = async function(method) {
  await this.socket.clearHandler(method);
};

CryptoSocket.prototype.clearHandlers = async function() {
  await this.socket.clearHandlers();
};

//
// PUBLIC WebSocket subscriptions
//

CryptoSocket.prototype.subscribeOrderbook = async function(symbol,depth,options={}) { // async
  const channel="book."+symbol+(depth==undefined?"":"."+depth);
  const output=await this.socket.request('subscribe',channel,options);
  return output;
};

CryptoSocket.prototype.unsubscribeOrderbook = async function(symbol,depth) { // async
  const channel="book."+symbol+(depth==undefined?"":"."+depth);
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeTicker = async function(symbol) { // async
  const channel="ticker"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeTicker = async function(symbol) { // async
  const channel="ticker"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeTrades = async function(symbol) { // async
  const channel="trade"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeTrades = async function(symbol) { // async
  const channel="trade"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeCandles = async function(period,symbol) { // async
  const channel="candlestick."+period+"."+symbol;
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeCandles = async function(period,symbol) { // async
  const channel="candlestick."+period+"."+symbol;
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeIndex = async function(symbol) { // async
  const channel="index."+symbol;
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeIndex = async function(symbol) { // async
  const channel="index."+symbol;
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeMarkPrices = async function(symbol) { // async
  const channel="mark."+symbol;
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeMarkPrices = async function(symbol) { // async
  const channel="mark."+symbol;
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeSettlementPrices = async function(symbol) { // async
  const channel="settlement"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeSettlementPrices = async function(symbol) { // async
  const channel="settlement"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeFunding = async function(symbol) { // async
  const channel="funding."+symbol;
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeFunding = async function(symbol) { // async
  const channel="funding."+symbol;
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeEstimatedFunding = async function(symbol) { // async
  const channel="estimatedfunding."+symbol;
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeEstimatedFunding = async function(symbol) { // async
  const channel="estimatedfunding."+symbol;
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

//
// PRIVATE WebSocket subscriptions
//

CryptoSocket.prototype.subscribeOrders = async function(symbol) { // async
  const channel="user.order"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeOrders = async function(symbol) { // async
  const channel="user.order"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeMyTrades = async function(symbol) { // async
  const channel="user.trade"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeMyTrades = async function(symbol) { // async
  const channel="user.trade"+(symbol==undefined?"":"."+symbol);
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeSpotBalances = async function() { // async
  const channel="user.balance";
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeSpotBalances = async function() { // async
  const channel="user.balance";
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribePositions = async function() { // async
  const channel="user.positions";
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribePositions = async function() { // async
  const channel="user.positions";
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribeRiskStatus = async function() { // async
  const channel="user.account_risk";
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribeRiskStatus = async function() { // async
  const channel="user.account_risk";
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.subscribePositionBalances = async function() { // async
  const channel="user.position_balance";
  const output=await this.socket.request('subscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.unsubscribePositionBalances = async function() { // async
  const channel="user.position_balance";
  const output=await this.socket.request('unsubscribe',channel,undefined);
  return output;
};

CryptoSocket.prototype.setCancelOnDisconnect = async function() {
  const method="private/set-cancel-on-disconnect";
  const output=await this.socket.request(method,undefined,{scope: "CONNECTION"});
  return output;
};

CryptoSocket.prototype.getCancelOnDisconnect = async function() {
  const method="private/get-cancel-on-disconnect";
  const output=await this.socket.request(method,undefined,undefined);
  return output;
};
