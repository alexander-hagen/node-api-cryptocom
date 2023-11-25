const
  axios = require('axios'),
  crypto = require('crypto');

var CryptoPrivate = function(api) {
  this.endPoint = "https://api.crypto.com/exchange/v1";
  this.apikey = api.apikey;
  this.secret = api.secret;
  this.timeout = 5000;
  this.keepalive = false;
  this.requestId = 0;
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

  var query=Object.keys(options.data.params)
    .sort( (a,b)=> (a > b) ? 1 : -1 )
    .reduce(function (a, k) {
      a.push(k + options.data.params[k]);
      return a;
    }, []).join('');

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
  var method="private/user-balance";
  return await this.otherQuery("POST","/"+method,{});
};

CryptoPrivate.prototype.getSpotBalanceHistory = async function(options={}) {
  var method="private/user-balance-history";
  return await this.otherQuery("POST","/"+method,options);
};

CryptoPrivate.prototype.getAccounts = async function(options) {
  var method="private/get-accounts";
  return await this.otherQuery("POST","/"+method,options);
};

CryptoPrivate.prototype.createSubaccountTransfer = async function(options) {
  var method="private/create-subaccount-transfer";
  return await this.otherQuery("POST","/"+method,options);
};

CryptoPrivate.prototype.getSubaccountBalance = async function() {
  var method="private/get-subaccount-balances";
  return await this.otherQuery("POST","/"+method,{});
};

CryptoPrivate.prototype.getPositions = async function(options={}) {
  var method="private/get-positions";
  return await this.otherQuery("POST","/"+method,options);
};

//
// Trading API
//

CryptoPrivate.prototype.createSpotOrder = async function(options) {
  const path="/private/create-order";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.cancelSpotOrder = async function(options) {
  const path="/private/cancel-order";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.cancelSpotOrders = async function(options={}) {
  const path="/private/cancel-all-orders";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.closePositions = async function(options) {
  const path="/private/close-position";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.getSpotOrders = async function(options={}) {
  const path="/private/get-open-orders";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.getSpotOrder = async function(options) {
  const path="/private/get-order-detail";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.setLeverage = async function(options) {
  const path="/private/change-account-leverage";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

//
// Advanced Order Management API
//

CryptoPrivate.prototype.createOrderList = async function(options) {
  const path="/private/create-order-list";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.cancelOrderList = async function(options) {
  const path="/private/cancel-order-list";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.getOrderList = async function(options) {
  const path="/private/get-order-list";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

//
// Order, Trade,Transaction History API
//

CryptoPrivate.prototype.getOrderHistory = async function(options={}) {
  const method="private/get-order-history";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST","/"+method,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.getTrades = async function(options={}) {
  const method="private/get-trades";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST","/"+method,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.getTransactions = async function(options={}) {
  const method="private/get-transactions";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST","/"+method,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

//
// Wallet API
//

CryptoPrivate.prototype.createWithdrawal = async function(options) {
  const method="private/get-transactions";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST","/"+method,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.getCurrencyNetworks = async function() {
  const method="private/get-transactions";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST","/"+method,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.getDepositAddress = async function(options) {
  const method="private/get-deposit-address";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST","/"+method,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.getDepositHistory = async function(options={}) {
  const method="private/get-deposit-history";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST","/"+method,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};

CryptoPrivate.prototype.getWithdrawalHistory = async function(options={}) {
  const method="private/get-withdrawal-history";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST","/"+method,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { if(result.code==0) { resolve(result); } else { reject(result); }; };
  });
};
