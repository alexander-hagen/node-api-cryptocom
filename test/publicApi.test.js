const
  cryptocom = require("../index.js");

const
  publicAPI=new cryptocom.publicApi(),
  timeout=publicAPI.timeout;

const
  symbol="ETH_BTC",
//  future="BTCUSDT_PERP",
//  quote="USDT",
  limit=5,
  period="M5",
  depth=5;
  base="BTC";

// Normal requests

describe('Reference and Market Data AP', () => {

  test('Test getRiskParameters() function', async () => {
    const result=await publicAPI.getRiskParameters();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test getSymbols() function', async () => {
    const result=await publicAPI.getSymbols();
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test getOrderBook() function', async () => {
    const request={
      "instrument_name": symbol,
      "depth": depth
    };	
    const result=await publicAPI.getOrderBook(request);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test getCandles() function', async () => {
    const request={
      "instrument_name": symbol
    };
    const result=await publicAPI.getCandles(request);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test getTrades() function', async () => {
    const request={
      "instrument_name": symbol,
      "count": limit
    };
    const result=await publicAPI.getTrades(request);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test getTicker() function', async () => {
    const request={
      "instrument_name": symbol
    };
    const result=await publicAPI.getTicker(request);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test getValuations() function', async () => {
    const request={
      "instrument_name": "BTCUSD-INDEX",
      "valuation_type": "index_price"
    };
    const result=await publicAPI.getValuations(request);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test getSettlementPrice() function', async () => {
    const request={
      "instrument_type": "FUTURE"
    };
    const result=await publicAPI.getSettlementPrice(request);
    expect(result).toHaveProperty("code",0);
  }, timeout);

  test('Test getInsurance() function', async () => {
    const request={
      "instrument_name": base
    };
    const result=await publicAPI.getInsurance(request);
    expect(result).toHaveProperty("code",0);
  }, timeout);

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

function checkError(obj,code,reason) {
  if(obj.code==code && obj.reason==reason) { return true; }
  return false;
};