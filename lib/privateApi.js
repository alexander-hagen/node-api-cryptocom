const
  axios = require('axios'),
  crypto = require('crypto'),
  { RateLimiter,TokenBucket } = require('limiter');

var CryptoPrivate = function(api) {
  this.endPoint = "https://api.crypto.com/exchange/v1";
  this.apikey = api.apikey;
  this.secret = api.secret;
  this.timeout = 5000;
  this.keepalive = false;
  this.requestId = 0;

  this._bucket={
    getSpotBalance: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getSpotBalanceHistory: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getAccounts: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    createSubaccountTransfer: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getSubaccountBalance: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getPositions: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    createSpotOrder: new TokenBucket({ bucketSize: 15, tokensPerInterval: 15, interval: 100 }),
    cancelSpotOrder: new TokenBucket({ bucketSize: 15, tokensPerInterval: 15, interval: 100 }),
    cancelSpotOrders: new TokenBucket({ bucketSize: 15, tokensPerInterval: 15, interval: 100 }),
    closePosition: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getSpotOrders: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getSpotOrder: new TokenBucket({ bucketSize: 30, tokensPerInterval: 30, interval: 100 }),
    setLeverage: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    setSettings: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getSettings: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getAccountFees: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getSymbolFees: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    createOrderList: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    cancelOrderList: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getOrderList: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getOrderHistory: new TokenBucket({ bucketSize: 1, tokensPerInterval: 1, interval: "second" }),
    getTrades: new TokenBucket({ bucketSize: 1, tokensPerInterval: 1, interval: "second" }),
    getTransactions: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    createWithdrawal: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getCurrencyNetworks: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getDepositAddress: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    getDepositHistory: new TokenBucket({ bucketSize: 3, tokensPerInterval: 3, interval: 100 }),
    staking: new TokenBucket({ bucketSize: 50, tokensPerInterval: 50, interval: "second" })
  };

};

var privateApi = module.exports = function(api) {
  return new CryptoPrivate(api);
};

CryptoPrivate.prototype.query = async function(options) {

  const
    stamp=Date.now(),
    method=options.url.replace(this.endPoint+"/","");

  const common={
    id: ++this.requestId,
    method: method,
    api_key: this.apikey,
    params: options.data.params,
    nonce: stamp,
//    maxContentLength: Infinity,
//    maxBodyLength: Infinity
  };
  Object.assign(options.data,common);

//  var query=Object.keys(options.data.params)
//    .sort( (a,b)=> (a > b) ? 1 : -1 )
//    .reduce(function (a, k) {
//      a.push(k + options.data.params[k]);
//      return a;
//    }, []).join('');

  function isObject(obj) { return obj !== undefined && obj !== null && obj.constructor == Object; }
  function isArray(obj) { return obj !== undefined && obj !== null && obj.constructor == Array; }
  function arrayToString(obj) { return obj.reduce((a,b) => { return a + (isObject(b) ? objectToString(b) : (isArray(b) ? arrayToString(b) : b)); }, ""); }
  function objectToString(obj) { return (obj == null ? "" : Object.keys(obj).sort().reduce((a, b) => { return a + b + (isArray(obj[b]) ? arrayToString(obj[b]) : (isObject(obj[b]) ? objectToString(obj[b]) : obj[b])); }, "")); }

  var query=objectToString(options.data.params);

  const source=method + options.data.id + this.apikey + query + stamp;
  let signature = encodeURIComponent( crypto.createHmac('sha256', this.secret).update(source).digest('hex') );
  options.data.sig=signature;

//  delete options.json;
//
//  options.headers = {
//    "Accept": "application/json",
//    "Content-Type": "application/json"
//  };

  try {
    const res=await axios(options);
    return res.data;
  } catch(err) {
    var response={ data: options };
    if(!err.hasOwnProperty("response")) { Object.assign(response,{ status: "503", error: err.code }); }
    else {
      Object.assign(response,{ status: err.response.status});
      if(err.response.hasOwnProperty("data")) { Object.assign(response,{ error: err.response.data.code, reason: err.response.data.message }); };
    };
    return response;
  };

};

CryptoPrivate.prototype.getQuery = async function(path, query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
//    param: query,
    data: { params: query },
    json: true
  };
  return await this.query(options);
};

CryptoPrivate.prototype.otherQuery = async function(method, path, query) {
  var options = {
    method: method,
    url: this.endPoint + path,
//    param: {},
    data: { params: query },
    json: true
  };
  return await this.query(options);
};

//
// Account Balance
//

CryptoPrivate.prototype.getSpotBalance = async function() {
  var path="/private/user-balance";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getSpotBalance"].removeTokens(1);
    const output=await this.otherQuery("POST",path,{});
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getSpotBalanceHistory = async function(options={}) {
  var path="/private/user-balance-history";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getSpotBalanceHistory"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getAccounts = async function(options={}) {
  var path="/private/get-accounts";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getAccounts"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.createSubaccountTransfer = async function(options) {
  var path="/private/create-subaccount-transfer";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["createSubaccountTransfer"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getSubaccountBalance = async function() {
  var path="/private/get-subaccount-balances";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getSubaccountBalance"].removeTokens(1);
    const output=await this.otherQuery("POST",path,{});
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getPositions = async function(options={}) {
  var path="/private/get-positions";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getPositions"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

//
// Trading API
//

CryptoPrivate.prototype.createSpotOrder = async function(options) {
  const path="/private/create-order";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["createSpotOrder"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.cancelSpotOrder = async function(options) {
  const path="/private/cancel-order";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["cancelSpotOrder"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.cancelSpotOrders = async function(options={}) {
  const path="/private/cancel-all-orders";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["cancelSpotOrders"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve({}); };
  });
};

CryptoPrivate.prototype.closePosition = async function(options) {
  const path="/private/close-position";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["closePosition"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getSpotOrders = async function(options={}) {
  const path="/private/get-open-orders";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getSpotOrders"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getSpotOrder = async function(options) {
  const path="/private/get-order-detail";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getSpotOrder"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.setLeverage = async function(options) {
  const path="/private/change-account-leverage";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["setLeverage"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve({}); };
  });
};

CryptoPrivate.prototype.setSettings = async function(options={}) {
  const path="/private/change-account-settings";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["setSettings"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve({}); };
  });
};

CryptoPrivate.prototype.getSettings = async function() {
  const path="/private/get-account-settings";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getSettings"].removeTokens(1);
    const output=await this.otherQuery("POST",path,{});
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getAccountFees = async function() {
  const path="/private/get-fee-rate";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getAccountFees"].removeTokens(1);
    const output=await this.otherQuery("POST",path,{});
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getSymbolFees = async function(options) {
  const path="/private/get-instrument-fee-rate";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getSymbolFees"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

//
// Advanced Order Management API
//

CryptoPrivate.prototype.createOrderList = async function(options) {
  const path="/private/create-order-list";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["createOrderList"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.cancelOrderList = async function(options) { // Always times out.
  const path="/private/cancel-order-list";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["cancelOrderList"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getOrderList = async function(options) {
  const path="/private/get-order-list";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getOrderList"].removeTokens(1);
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

//
// Order, Trade,Transaction History API
//

CryptoPrivate.prototype.getOrderHistory = async function(options={}) {
  const method="/private/get-order-history";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getOrderHistory"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getTrades = async function(options={}) {
  const method="/private/get-trades";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getTrades"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getTransactions = async function(options={}) {
  const method="/private/get-transactions";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getTransactions"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

//
// Wallet API
//

CryptoPrivate.prototype.createWithdrawal = async function(options) {
  const method="/private/create-withdrawal";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["createWithdrawal"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getCurrencyNetworks = async function() {
  const method="/private/get-currency-networks";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getCurrencyNetworks"].removeTokens(1);
    const output=await this.otherQuery("POST",method,{});
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getDepositAddress = async function(options) {
  const method="/private/get-deposit-address";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getDepositAddress"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getDepositHistory = async function(options={}) {
  const method="/private/get-deposit-history";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getDepositHistory"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getWithdrawalHistory = async function(options={}) {
  const method="/private/get-withdrawal-history";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["getWithdrawalHistory"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

//
// Staking API
//

CryptoPrivate.prototype.stake = async function(options) {
  const method="/private/staking/stake";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.unstake = async function(options) {
  const method="/private/staking/unstake";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getStakingPosition = async function(options={}) {
  const method="/private/staking/get-staking-position";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getStakingSymbols = async function() {
  const method="/private/staking/get-staking-instruments";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,{});
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getOpenStake = async function(options={}) {
  const method="/private/staking/get-open-stake";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getStakeHistory = async function(options={}) {
  const method="/private/staking/get-stake-history";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getRewardHistory = async function(options={}) {
  const method="/private/staking/get-reward-history";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.convert = async function(options) {
  const method="/private/staking/convert";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getOpenConvert = async function(options={}) {
  const method="/private/staking/get-open-convert";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};

CryptoPrivate.prototype.getConvertHistory = async function(options={}) {
  const method="/private/staking/get-convert-history";
  return await new Promise(async (resolve, reject) => {
    const remaining=await this._bucket["staking"].removeTokens(1);
    const output=await this.otherQuery("POST",method,options);
    if(output.hasOwnProperty("error") || (output.hasOwnProperty("code") && output.code!==0)) { reject(output); }
    else { resolve(output.result); };
  });
};
