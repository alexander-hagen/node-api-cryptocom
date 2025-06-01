const
  axios = require('axios');

var CryptoPublic = function() {
  this.endPoint = "https://api.crypto.com/exchange/v1";
  this.timeout = 5000;
  this.keepalive = false;
};

CryptoPublic.prototype.query = async function(path) {
  const options={
    url: this.endPoint + path,
    method: "GET",
    timeout: this.timeout,
    forever: this.keepalive
  };

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

// Market Data

CryptoPublic.prototype.getRiskParameters = async function() {
  const path="/public/get-risk-parameters";
  return await this.query(path);
};

CryptoPublic.prototype.getSymbols = async function() {
  const path="/public/get-instruments";
  return await this.query(path);
};

CryptoPublic.prototype.getOrderBook = async function(options) {
  var path="/public/get-book",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.query(path);
};

CryptoPublic.prototype.getCandles = async function(options) {
  var path="/public/get-candlestick",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.query(path);
};

CryptoPublic.prototype.getTrades = async function(options) {
  var path="/public/get-trades",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.query(path);
};

CryptoPublic.prototype.getTicker = async function(options) {
  var path="/public/get-tickers",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.query(path);
};

CryptoPublic.prototype.getValuations = async function(options) {
  var path="/public/get-valuations",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.query(path);
};

CryptoPublic.prototype.getSettlementPrice = async function(options) {
  var path="/public/get-expired-settlement-price",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.query(path);
};

CryptoPublic.prototype.getInsurance = async function(options) {
  var path="/public/get-insurance",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.query(path);
};

var publicApi = module.exports = function() {
  return new CryptoPublic();
};
