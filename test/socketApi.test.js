const
  dotenv = require("dotenv").config(),
  cryptocom = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET;

const
  symbol="BTC_USD",
  depth=10,
  timeout=6000,
  longwait=65000;

// Get sockets

var publicws,privatews;

describe('Websocket Market Data', () => {

  beforeAll(async () => { // initialize socket
    publicws=new cryptocom.sockets.publicApi();
    await waitForConnection(publicws);
    await publicws.setHandler("book",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("ticker",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("trade",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("candlestick",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("index",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("mark",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("settlement",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("funding",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("estimatedfunding",(method,data,period) => { eventHandler(method); });
    console.log("publicws connected");
  });

  test('Test subscribeOrderbook() function', async () => {
   const result=await publicws.subscribeOrderbook(symbol,depth);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'book.*' event", async () => {
    const key="book";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeOrderbook() function', async () => {
    const result=await publicws.unsubscribeOrderbook(symbol,depth);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeTicker() function', async () => {
    const result=await publicws.subscribeTicker(symbol);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'ticker.*' event", async () => {
    const key="ticker";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeTicker() function', async () => {
    const result=await publicws.unsubscribeTicker(symbol,depth);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeTrades() function', async () => {
    const result=await publicws.subscribeTrades(symbol);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'trade.*' event", async () => {
    const key="trade";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeTrades() function', async () => {
    const result=await publicws.unsubscribeTrades(symbol);
    expect(result).toHaveProperty("code",0);
  }, timeout); 

  test('Test subscribeCandles() function', async () => {
    const result=await publicws.subscribeCandles("1m",symbol);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'candlestick.*' event", async () => {
    const key="candlestick";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeCandles() function', async () => {
    const result=await publicws.unsubscribeCandles("1m",symbol);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeIndex() function', async () => {
    const result=await publicws.subscribeIndex("BTCUSD-INDEX");
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'index.*' event", async () => {
    const key="index";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeIndex() function', async () => {
    const result=await publicws.unsubscribeIndex("BTCUSD-INDEX");
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeMarkPrices() function', async () => {
    const result=await publicws.subscribeMarkPrices("BTCUSD-PERP");
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'mark.*' event", async () => {
    const key="mark";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeMarkPrices() function', async () => {
    const result=await publicws.unsubscribeMarkPrices("BTCUSD-PERP");
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeSettlementPrices() function', async () => {
    const result=await publicws.subscribeSettlementPrices();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'settlement.*' event", async () => {
    const key="settlement";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeSettlementPrices() function', async () => {
    const result=await publicws.unsubscribeSettlementPrices();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeFunding() function', async () => {
    const result=await publicws.subscribeFunding("BTCUSD-PERP");
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'funding.*' event", async () => {
    const key="funding";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeFunding() function', async () => {
    const result=await publicws.unsubscribeFunding("BTCUSD-PERP");
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeEstimatedFunding() function', async () => {
    const result=await publicws.subscribeEstimatedFunding("BTCUSD-PERP");
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'estimatedfunding.*' event", async () => {
    const key="estimatedfunding";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeEstimatedFunding() function', async () => {
    const result=await publicws.unsubscribeEstimatedFunding("BTCUSD-PERP");
    expect(result).toHaveProperty("code",0);
  }, timeout);

  afterAll(async () => { // clean-up socket
    await publicws.clearHandlers();
    publicws.socket._ws.terminate();
  });

});

describe('Websocket User Data', () => {

  beforeAll(async () => { // initialize socket
    privatews=new cryptocom.sockets.privateApi({"apikey": apikey, "secret": secret });
    await waitForConnection(privatews);
    await privatews.setHandler("user.order",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("user.trade",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("user.balance",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("user.positions",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("user.account_risk",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("user.position_balance",(method,data,period) => { eventHandler(method); });
    console.log("privatews connected");
  });

  test('Test subscribeOrders() function', async () => {
   const result=await privatews.subscribeOrders();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'user.order.*' event", async () => {
    const key="user.order";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeOrders() function', async () => {
    const result=await privatews.unsubscribeOrders();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeMyTrades() function', async () => {
   const result=await privatews.subscribeMyTrades();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'user.trade.*' event", async () => {
    const key="user.trade";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeMyTrades() function', async () => {
    const result=await privatews.unsubscribeMyTrades();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeSpotBalances() function', async () => {
    const result=await privatews.subscribeSpotBalances();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'user.balance.*' event", async () => {
    const key="user.balance";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeSpotBalances() function', async () => {
    const result=await privatews.unsubscribeSpotBalances();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribePositions() function', async () => {
    const result=await privatews.subscribePositions();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'user.positions.*' event", async () => {
    const key="user.positions";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribePositions() function', async () => {
    const result=await privatews.unsubscribePositions();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribeRiskStatus() function', async () => {
    const result=await privatews.subscribeRiskStatus();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'user.account_risk.*' event", async () => {
    const key="user.account_risk";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribeRiskStatus() function', async () => {
    const result=await privatews.unsubscribeRiskStatus();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test subscribePositionBalances() function', async () => {
    const result=await privatews.subscribePositionBalances();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test("Wait for 'user.position_balance.*' event", async () => {
    const key="user.position_balance";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  test('Test unsubscribePositionBalances() function', async () => {
    const result=await privatews.unsubscribePositionBalances();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  afterAll(async () => { // clean-up socket
    await privatews.clearHandlers();
    privatews.socket._ws.terminate();
  });

});

// Helper functions

function stringIsJSON(str) {
  try { 
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

function stringIsArray(str) {
  try { 
    return Array.isArray(str);
  } catch {
    return false;
  }
};

function objectIsJSON(obj) {
  try { 
    JSON.parse(JSON.stringify(obj));
    return true;
  } catch {
    return false;
  }
};

function waitForConnection(websocket) {
  var socketResolve,socketReject;
  var done=false;
  var timer=setTimeout( () => { if(!done) { socketReject(done); }; }, timeout);

  websocket.socket._ws.on('authenticated', async () => { // Wait for websocket to authenticate.
    console.log('authenticated');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  websocket.socket._ws.on('initialized', async () => { // Wait for websocket to initialize.
    console.log('initialized');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  var promise=new Promise(function(resolve, reject) { socketResolve=resolve; socketReject=reject; });

  return promise;
};

var _promises = new Map();
var timers={};
var events={};

function eventHandler(fullkey) {
  const keys=fullkey.split(".");
  if(keys[0]=="user") { key=keys[0]+"."+keys[1]; } else { key=keys[0]; };
  events[key]=true;
  if (_promises.has(key)) {
    clearTimeout(timers[key]);
    const cb = _promises.get(key);
    _promises.delete(key);
    cb.resolve(key);
  };
};

function waitForPromise(key) {
  return new Promise((resolve, reject) => {
    if(events[key]) { resolve(key); }
    else {
      _promises.set(key, {resolve, reject});
      timers[key]=setTimeout(() => {
        if(_promises.has(key)) {
          _promises.delete(key);
          reject(key);
        } else { resolve(key); }
      }, timeout-1000);
    }
  });
};
