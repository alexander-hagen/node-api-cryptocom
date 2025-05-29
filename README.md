# node-api-cryptocom

![Statements](badges/badge-statements.svg) ![Branch](badges/badge-branches.svg) ![Functions](badges/badge-functions.svg) ![Lines](badges/badge-lines.svg)

Non-official implementation of Crypto.com's Exchange API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

```javascript
  const cryptocom=require('node-api-cryptocom');

  const publicAPI=new cryptocom.publicApi();

```

### Market Data

| API                | DESCRIPTION                                                                                         |
| :----              | :----                                                                                               |
| getRiskParameters  | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-risk-parameters          |
| getSymbols         | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-instruments              |
| getOrderBook       | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-book                     |
| getCandles         | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-candlestick              |
| getTrades          | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-trades                   |
| getTicker          | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-tickers                  |
| getValuations      | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-valuations               |
| getSettlementPrice | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-expired-settlement-price |
| getInsurance       | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-insurance                |

## __PRIVATE API__

```javascript
  const cryptocom=require('node-api-cryptocom');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new cryptocom.privateApi(auth);

```

### Account Balance and Position API

| API                      | DESCRIPTION                                                                                        |
| :----                    | :----                                                                                              |
| getSpotBalance           | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-user-balance               |
| getSpotBalanceHistory    | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-user-balance-history       |
| getAccounts              | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-accounts               |
| createSubaccountTransfer | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-subaccount-transfer |
| getSubaccountBalance     | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-subaccount-balances    |
| getPositions             | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-positions              |

### Trading API

| API              | DESCRIPTION                                                                                     |
| :----            | :----                                                                                           |
| createSpotOrder  | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order            |
| cancelSpotOrder  | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order            |
| cancelSpotOrders | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-all-orders       |
| closePosition    | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-close-position          |
| getSpotOrders    | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-open-orders         |
| getSpotOrder     | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-order-detail        |
| setLeverage      | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-change-account-leverage |
| setSettings      | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-change-account-settings |
| getSettings      | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-account-settings    |
| getAccountFees   | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-fee-rate            |
| getSymbolFees    | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-instrument-fee-rate |

### Advanced Order Management API

| API                       | DESCRIPTION                                                                                    |
| :----                     | :----                                                                                          |
| createOrderList           | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order-list-list https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order-list-oco |
| cancelOrderList           | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order-list-list https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order-list-oco |
| getOrderList              | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-order-list-oco     |

### Order, Trade, Transaction History API

| API             | DESCRIPTION                                                                               |
| :----           | :----                                                                                     |
| getOrderHistory | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-order-history |
| getTrades       | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-trades        |
| getTransactions | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-transactions  |

### Wallet API

| API                  | DESCRIPTION                                                                                    |
| :----                | :----                                                                                          |
| createWithdrawal     | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-withdrawal      |
| getCurrencyNetworks  | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-currency-networks  |
| getDepositAddress    | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-deposit-address    |
| getDepositHistory    | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-deposit-history    |
| getWithdrawalHistory | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-withdrawal-history |

### Staking API

| API                  | DESCRIPTION                                                                                             |
| :----                | :----                                                                                                   |
| stake                | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-stake                   |
| unstake              | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-unstake                 |
| getStakingPosition   | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-get-staking-position    |
| getStakingSymbols    | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-get-staking-instruments |
| getOpenStake         | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-get-open-stake          |
| getStakeHistory      | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-get-stake-history       |
| getRewardHistory     | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-get-reward-history      |
| convert              | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-convert                 |
| getOpenConvert       | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-get-open-convert        |
| getConvertHistory    | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-staking-get-convert-history     |
| getConversionRate    | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-staking-get-conversion-rate      |

## __WEBSOCKET API__

```javascript
  const cryptocom=require('node-api-cryptocom');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const marketAPI=new cryptocom.sockets.marketApi();
  marketAPI.socket._ws.on('initialized', async () => {
    // do your own initialization
  });

  const privateAPI=new cryptocom.sockets.privateApi(auth);
  privateAPI.setHandler('user.order', (method,data,symbol,option) => { updateOrders(method,data,user,api,handler); });

  privateAPI.socket._ws.on('authenticated', async () => {
    const res=await privateAPI.subscribeOrders();
  });

  privateAPI.socket._ws.on('closed', async () => {
    // do something, like clean-up and reconnect
  });

  function updateOrders(method,orders,user,api,handler) {
    // do something
  };

```

### Websocket Market API

| API                                                   | HANDLER          | DESCRIPTION |
| :----                                                 | :----            | :---- |
| subscribeOrderbook unsubscribeOrderbook               | book             | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#book-instrument_name https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#book-instrument_name-depth |
| subscribeTicker unsubscribeTicker                     | ticker           | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#ticker-instrument_name                 |
| subscribeTrades unsubscribeTrades                     | trade            | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#trade-instrument_name                  |
| subscribeCandles unsubscribeCandles                   | candlestick      | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#candlestick-time_frame-instrument_name |
| subscribeIndex unsubscribeIndex                       | index            | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#index-instrument_name                  |
| subscribeMarkPrices unsubscribeMarkPrices             | mark             | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#mark-instrument_name                   |
| subscribeSettlementPrices unsubscribeSettlementPrices | settlement       | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#settlement-instrument_name             |
| subscribeFunding unsubscribeFunding                   | funding          | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#funding-instrument_name                |
| subscribeEstimatedFunding unsubscribeEstimatedFunding | estimatedfunding | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#estimatedfunding-instrument_name       |

### Socket Authentication

| API                   | DESCRIPTION                                                                                      |
| :----                 | :----                                                                                            |
| login                 | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-auth                      |
| setHandler            |                                                                                                  |
| setCancelOnDisconnect | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-set-cancel-on-disconnect |
| getCancelOnDisconnect | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-cancel-on-disconnect |

### Websocket User API

| API                                                   | HANDLER               | DESCRIPTION |
| :----                                                 | :----                 | :---- |
| subscribeOrders unsubscribeOrders                     | user.order            | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-order-instrument_name |
| subscribeMyTrades unsubscribeMyTrades                 | user.trade            | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-trade-instrument_name |
| subscribeSpotBalances unsubscribeSpotBalances         | user.balance          | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-balance               |
| subscribePositions unsubscribePositions               | user.positions        | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-positions             |
| subscribeRiskStatus unsubscribeRiskStatus             | user.account_risk     | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-account_risk          |
| subscribePositionBalances unsubscribePositionBalances | user.position_balance | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-position_balance      |

### Socket Account Balance and Position API

| API                   | DESCRIPTION                                                                                     |
| :----                 | :----                                                                                           |
| getSpotBalance        | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-user-balance            |
| getPositions          | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-positions           |

### Trading API

| API                   | DESCRIPTION                                                                                     |
| :----                 | :----                                                                                           |
| createSpotOrder       | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order            |
| cancelSpotOrder       | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order            |
| cancelSpotOrders      | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-all-orders       |
| closePositions        | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-close-position          |
| getSpotOrders         | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-open-orders         |

### Advanced Order Management API

| API                   | DESCRIPTION                                                                                     |
| :----                 | :----                                                                                           |
| createOrderList       | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order-list-list https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order-list-oco |
| cancelOrderList       | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order-list-list https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order-list-oco |

### Wallet API

| API                   | DESCRIPTION                                                                                     |
| :----                 | :----                                                                                           |
| createWithdrawal      | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-withdrawal       |
| getWithdrawalHistory  | https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-withdrawal-history  |
