const
  axios = require('axios'),
  { RateLimiter,TokenBucket } = require('limiter');

const
  bucket={
    getRiskParameters: new TokenBucket({ bucketSize: 100, tokensPerInterval: 100, interval: "second" }),
    getSymbols: new TokenBucket({ bucketSize: 100, tokensPerInterval: 100, interval: "second" }),
    getOrderBook: new TokenBucket({ bucketSize: 100, tokensPerInterval: 100, interval: "second" }),
    getCandles: new TokenBucket({ bucketSize: 100, tokensPerInterval: 100, interval: "second" }),
    getTrades: new TokenBucket({ bucketSize: 100, tokensPerInterval: 100, interval: "second" }),
    getTicker: new TokenBucket({ bucketSize: 100, tokensPerInterval: 100, interval: "second" }),
    getValuations: new TokenBucket({ bucketSize: 100, tokensPerInterval: 100, interval: "second" }),
    getSettlementPrice: new TokenBucket({ bucketSize: 100, tokensPerInterval: 100, interval: "second" }),
    getInsurance: new TokenBucket({ bucketSize: 100, tokensPerInterval: 100, interval: "second" }),
    staking: new TokenBucket({ bucketSize: 50, tokensPerInterval: 50, interval: "second" })
  };

var CryptoPublic = function() {
  this.endPoint = "https://api.crypto.com/exchange/v1";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new CryptoPublic();
};

CryptoPublic.prototype.query = async function(options) {

  try {
    const res = await axios(options);
    return res.data;
  } catch (err) {
    if(err.hasOwnProperty("method")) {
      return {
        status: err.result.status,
        error: err.code,
        reason: err.message,
        data: options
      };
    } else {
      return {
        status: err.status,
        data: options
      };
    };
  };
};

CryptoPublic.prototype.getQuery = async function(path,query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    params: query,
    data: {}
  };
  return await this.query(options);
};

CryptoPublic.prototype.otherQuery = async function(method, path, query) {
  var options = {
    method: method,
    url: this.endPoint + path,
    data: query,
    json: true
  };
  return await this.query(options);
};

// Market Data

CryptoPublic.prototype.getRiskParameters = async function() {
  const path="/public/get-risk-parameters";
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["getRiskParameters"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

CryptoPublic.prototype.getSymbols = async function() {
  const path="/public/get-instruments";
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["getSymbols"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

CryptoPublic.prototype.getOrderBook = async function(options) {
  var path="/public/get-book",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["getOrderBook"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

CryptoPublic.prototype.getCandles = async function(options) {
  var path="/public/get-candlestick",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["getCandles"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

CryptoPublic.prototype.getTrades = async function(options) {
  var path="/public/get-trades",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["getTrades"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

CryptoPublic.prototype.getTicker = async function(options={}) {
  var path="/public/get-tickers",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["getTicker"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

CryptoPublic.prototype.getValuations = async function(options) {
  var path="/public/get-valuations",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["getValuations"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

CryptoPublic.prototype.getSettlementPrice = async function(options) {
  var path="/public/get-expired-settlement-price",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["getSettlementPrice"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

CryptoPublic.prototype.getInsurance = async function(options) {
  var path="/public/get-insurance",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["getInsurance"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

CryptoPublic.prototype.getConversionRate = async function(options) {
  const method="/public/staking/get-conversion-rate";
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};
