# CEX.IO Trading API for Node.js.
=========

A Node.js reference implementation of the CEX.IO API. See the full docs at <https://cex.io/cex-api>

* REST API
* WebSockets API (TO-DO)

## Installation
```bash
  npm install cexio-api-node
```

## Usage

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

## Examples

You will find public and private functions examples in `examples` dir.

## Contributing

`We are following the [standard JavaScript Style Guide](https://github.com/feross/standard).
Add unit tests for any new or changed functionality. Lint and test your code.`
