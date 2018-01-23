# CEX.IO Trading API for Node.js.
=========

A Node.js reference implementation of the CEX.IO API. See the full docs at <https://cex.io/cex-api>

* REST API with Callbacks or Promises
* WebSockets API

## Installation
```bash
  npm install cexio-api-node
```

## Usage

### REST API - Callbacks
```
const CEXIO = require('cexio-api-node')

// Public functions

const cexPub = new CEXIO().rest

cexPub.currency_limits(function (err, data) {
  if (err) return console.error(err)
  console.log('Currency limits\n', data.pairs)
})

cexPub.ticker('BTC/USD', function (err, data) {
  if (err) return console.error(err)
  console.log('Ticker\n', data)
})

// Authenticated functions

const apiKey = 'YOUR-API-KEY'
const apiSecret = 'YOUR-API-SECRET'
const clientId = 'YOUR-USERNAME'

const cexAuth = new CEXIO(clientId, apiKey, apiSecret).rest

cexAuth.account_balance(function (err, data) {
  if (err) return console.error(err)
  console.log('Account balance\n', data)
})
```

### REST API - Promises
```
const CEXIO = require('cexio-api-node')
const cexPub = new CEXIO().promiseRest

cexPub.ticker('BTC/USD').then(data => {
  console.log('Ticker\n', data)
}).catch(err => {
  console.error(err)
})
```

The same pattern applies for authenticated functions.
See Callback example for initialization.

### WebSockets API
```
const CEXIO = require('cexio-api-node')

const apiKey = 'YOUR-API-KEY'
const apiSecret = 'YOUR-API-SECRET'

const cexWS = new CEXIO(apiKey, apiSecret).ws

/**
 * Open connection
 */
cexWS.open()

cexWS.on('open', function () {
  console.log('WebSocket connected')

/**
 * Authenticate
 */
  cexWS.auth()

/**
 * Public data
 */
  cexWS.subscribeTick()
  cexWS.subscribeTicker()
  cexWS.subscribeOHLCV()
})

cexWS.on('auth', function () {
  console.log('Websocket authenticated')
/**
 * Private data
 */
  cexWS.authTicker('BTC-USD')
  cexWS.getBalance()
  cexWS.subscribeOrderBook('BTC-USD', true, 5)
  cexWS.unsubscribeOrderBook()
  cexWS.openOrders()
  cexWS.getOrder(1234)
  cexWS.archivedOrders()
  cexWS.placeOrder('buy', 'BTC-USD', 0.01, 1000)
  cexWS.cancelOrder(1234)
  cexWS.replaceOrder(1234, 'buy', 'BTC-USD', 0.01, 900)
  cexWS.openPosition('long', 'BTC-USD', 'BTC', 1, 2, 10000, 9500, false)
  cexWS.openPositions()
  cexWS.getPosition(4321)
  cexWS.closePosition(4321)
})

/**
 * Log messages
 */
cexWS.on('message', function (msg) {
  console.log('----message-begin----')
  console.log(msg)
  console.log('-----message-end-----')

/**
 * Keep authenticated.
 * Respond with pong or authTicker
 */
  if (msg.e === 'ping') {
    cexWS.authTicker('DASH-USD')
/**
 * Close connection (if needed)
 */
    cexWS.close()
  }
})
cexWS.on('error', function (error) {
  console.error('error: \n', error)
})

cexWS.on('close', function () {
  console.log('WebSocket disconnected')
})
```

## Examples

You will find public and private functions examples in `examples` dir.

## Contributing

`We are following the [standard JavaScript Style Guide](https://github.com/feross/standard).
Add unit tests for any new or changed functionality. Lint and test your code.`
