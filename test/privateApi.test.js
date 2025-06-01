const
  dotenv = require("dotenv").config(),
  cryptocom = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET,
  privateAPI=new cryptocom.privateApi({ "apikey": apikey, "secret": secret });
  timeout=privateAPI.timeout;

const
  symbol="BTC_USD";
//  quote="USDC",
//  base="XXBT";
//  limit=5,
//  depth=5;

let account;

describe('Account Balance and Position AP', () => {

  test('Test getSpotBalance() function', async () => {
    const result=await privateAPI.getSpotBalance();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getSpotBalanceHistory() function', async () => {
    const result=await privateAPI.getSpotBalanceHistory();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getAccounts() function', async () => {
    const result=await privateAPI.getAccounts();
    account=result.master_account;
    expect(result).toHaveProperty("master_account");
  }, timeout);

//  test('Test createSubaccountTransfer() function', async () => {
//    const result=await privateAPI.createSubaccountTransfer();
//    expect(result).toHaveProperty("code",0);
//  }, timeout);

  test('Test getSubaccountBalance() function', async () => {
    const result=await privateAPI.getSubaccountBalance();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getPositions() function', async () => {
    const result=await privateAPI.getPositions();
    expect(result).toHaveProperty("data");
  }, timeout);

});

describe('Trading AP', () => {

  let order;

  test('Test createSpotOrder() function', async () => {
    const options={
      "instrument_name": symbol,
      "side": "BUY",
      "type": "LIMIT",
      "price": "90000",
      "quantity": "0.00005"
    };
    const result=await privateAPI.createSpotOrder(options);
    order=result;
    expect(result).toHaveProperty("order_id");
  }, timeout);

  test('Test getSpotOrders() function', async () => {
    const result=await privateAPI.getSpotOrders();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getSpotOrder() function', async () => {
    const options={ "order_id": order.order_id };
    const result=await privateAPI.getSpotOrder(options);
    expect(result).toHaveProperty("order_id", order.order_id);
  }, timeout);

  test('Test cancelSpotOrder() function', async () => {
    const options={
      "order_id": order.order_id
    };
    const result=await privateAPI.cancelSpotOrder(options);
    expect(result).toHaveProperty("order_id");
  }, timeout);

  test('Test cancelSpotOrders() function', async () => {
    const result=await privateAPI.cancelSpotOrders();
    expect(result).toStrictEqual({});
  }, timeout);

//  test('Test closePosition() function', async () => {
//    const result=await privateAPI.closePosition();
//    expect(result).toHaveProperty("data");
//  }, timeout);

  test('Test setLeverage() function', async () => {
    const options={
      "account_id": account.uuid,
      "leverage": 1
    };
    const result=await privateAPI.setLeverage(options);
    expect(result).toStrictEqual({});
  }, timeout);

  test('Test setSettings() function', async () => {
    const options={ "leverage": 1 };
    const result=await privateAPI.setSettings(options);
    expect(result).toStrictEqual({});
  }, timeout);

  test('Test getSettings() function', async () => {
    const result=await privateAPI.getSettings();
    expect(result[0]).toHaveProperty("leverage");
  }, timeout);

  test('Test getAccountFees() function', async () => {
    const result=await privateAPI.getAccountFees();
    expect(result).toHaveProperty("spot_tier");
  }, timeout);

  test('Test getSymbolFees() function', async () => {
    const options={ "instrument_name": symbol};
    const result=await privateAPI.getSymbolFees(options);
    expect(result).toHaveProperty("instrument_name",symbol);
  }, timeout);

});

describe('Advanced Order Management API', () => {

  let list;

//  test('Test createOrderList(LIST) function', async () => { // Returns result instead of result.result_list
//    const options={
//      "contingency_type": "LIST",
//      "order_list": [{
//        "instrument_name": symbol,
//        "side": "BUY",
//        "type": "LIMIT",
//        "price": "90000",
//        "quantity": "0.00005"
//      }] };
//    const result=await privateAPI.createOrderList(options);
//    list=result;
//    expect(result[0]).toHaveProperty("index");
//  }, timeout);

//  test('Test cancelOrderList(LIST) function', async () => { // Performs cancel orders but always times out. Returns result instead of result.result_list
//    const options={
//      "contingency_type": "LIST",
//      "order_list": [{
//        "instrument_name": symbol,
//        "order_id": list[0].order_id
//      }] };
//    const result=await privateAPI.cancelOrderList(options);
//    expect(result[0]).toHaveProperty("index");
//  }, timeout);

//  test('Test createOrderList(OCO) function', async () => { // Returns result instead of result.result_list
//   const options={
//      "contingency_type": "OCO",
//      "order_list": [{
//        "instrument_name": symbol,
//        "side": "BUY",
//        "type": "LIMIT",
//        "price": "90000",
//        "quantity": "0.00005"
//      },{
//        "instrument_name": symbol,
//        "side": "BUY",
//        "type": "LIMIT",
//        "price": "91000",
//        "quantity": "0.00005"
//      }] };
//    const result=await privateAPI.createOrderList(options);
//    list=result;
//    expect(result).toHaveProperty("list_id");
//  }, timeout);

//  test('Test getOrderList(OCO) function', async () => {
//    const options={
//      "contingency_type": "OCO",
//      "instrument_name": symbol,
//      "list_id": list.list_id };
//    const result=await privateAPI.getOrderList(options);
//    expect(result[0]).toStrictEqual({});
//  }, timeout);

//  test('Test cancelOrderList(OCO) function', async () => {
//    const options={
//      "contingency_type": "OCO",
//      "instrument_name": symbol,
//      "list_id": list.list_id };
//    const result=await privateAPI.cancelOrderList(options);
//    expect(result[0]).toStrictEqual({});
//  }, timeout);

});

describe('Order, Trade, Transaction History API', () => {

  test('Test getOrderHistory() function', async () => {
    const result=await privateAPI.getOrderHistory();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getTrades() function', async () => {
    const result=await privateAPI.getTrades();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getTransactions() function', async () => {
    const result=await privateAPI.getTransactions();
    expect(result).toHaveProperty("data");
  }, timeout);

});

describe('Wallet API', () => {

// Test for createWithdrawal() not defined

  test('Test getCurrencyNetworks() function', async () => {
    const result=await privateAPI.getCurrencyNetworks();
    expect(result).toHaveProperty("currency_map");
  }, timeout);

// Test for getDepositAddress() not defined

  test('Test getDepositHistory() function', async () => {
    const result=await privateAPI.getDepositHistory();
    expect(result).toHaveProperty("deposit_list");
  }, timeout);

  test('Test getWithdrawalHistory() function', async () => {
    const result=await privateAPI.getWithdrawalHistory();
    expect(result).toHaveProperty("withdrawal_list");
  }, timeout);

});

describe('Staking API', () => { // No test defined

// Test for stake() not defined
// Test for unstake() not defined

  test('Test getStakingPosition() function', async () => {
    const result=await privateAPI.getStakingPosition();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getStakingSymbols() function', async () => {
    const result=await privateAPI.getStakingSymbols();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getOpenStake() function', async () => {
    const result=await privateAPI.getOpenStake();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getStakeHistory() function', async () => {
    const result=await privateAPI.getStakeHistory();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getRewardHistory() function', async () => {
    const result=await privateAPI.getRewardHistory();
    expect(result).toHaveProperty("data");
  }, timeout);

// Test for convert() not defined

  test('Test getOpenConvert() function', async () => {
    const result=await privateAPI.getOpenConvert();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getConvertHistory() function', async () => {
    const result=await privateAPI.getConvertHistory();
    expect(result).toHaveProperty("data");
  }, timeout);

  test('Test getConversionRate() function', async () => {
    const options={ "instrument_name": "CDCETH" };
    const result=await privateAPI.getConversionRate(options);
    expect(result).toHaveProperty("conversion_rate");
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