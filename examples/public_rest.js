const CEXIO = require('../index.js')
const cex = new CEXIO()
const cexRest = cex.rest

const moment = require('moment')
const yesterday = moment().subtract(1, 'days').format('YYYYMMDD').toString()

cexRest.currency_limits(function (err, data) {
  if (err) return console.error(err)
  console.log('Currency limits\n', data.pairs)
})

cexRest.ticker('BTC/USD', function (err, data) {
  if (err) return console.error(err)
  console.log('Ticker\n', data)
})

cexRest.all_tickers('BTC/USD/LTC/EUR', function (err, data) {
  if (err) return console.error(err)
  console.log('Tickers\n', data)
})

cexRest.historical_1m('BTC/USD', yesterday, function (err, data) {
  if (err) return console.error(err)
  console.log('Historical candles\n', data)
})

cexRest.last_price('BTC/USD', function (err, data) {
  if (err) return console.error(err)
  console.log('Last price\n', data)
})

cexRest.last_prices('BTC/USD/LTC/EUR', function (err, data) {
  if (err) return console.error(err)
  console.log('Last prices\n', data)
})

cexRest.orderbook('BTC/USD', '1', function (err, data) {
  if (err) return console.error(err)
  console.log('Orderbook\n', data)
})

cexRest.trade_history('BTC/USD', '1', function (err, data) {
  if (err) return console.error(err)
  console.log('Trade history\n', data)
})
