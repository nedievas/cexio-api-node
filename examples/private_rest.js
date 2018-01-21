const CEXIO = require('../index.js')
const apiKey = 'YOUR-API-KEY'
const apiSecret = 'YOUR-API-SECRET'
const clientId = 'YOUR-USERNAME'
const cex = new CEXIO(clientId, apiKey, apiSecret)
const cexRest = cex.rest

cexRest.account_balance(function (err, data) {
  if (err) return console.error(err)
  console.log('Account balance\n', data)
})
/*
cexRest.open_orders('ETH/USD', function (err, data) {
  if (err) return console.error(err)
  console.log('Open orders\n', data)
})

cexRest.active_orders_status([4604702754, 4604702754], function (err, data) {
  if (err) return console.error(err)
  console.log('Active orders status\n', data)
})

cexRest.archived_orders('ETH/USD', 2, null, null, null, null, null, function (err, data) {
  if (err) return console.error(err)
  console.log('Archived orders\n', data)
})

cexRest.cancel_order(4605523870, function (err, data) {
  if (err) return console.error(err)
  console.log('Cancel order\n', data)
})

cexRest.cancel_pair_orders('ETH/USD', function (err, data) {
  if (err) return console.error(err)
  console.log('Cancel pair orders\n', data)
})

cexRest.place_order('ETH/USD', 'sell', 0.1, 1550, null, function (err, data) {
  if (err) return console.error(err)
  console.log('Place order\n', data)
})

cexRest.get_order_details(4605776702, function (err, data) {
  if (err) return console.error(err)
  console.log('Get order\n', data)
})

cexRest.get_order_transactions(4605776702, function (err, data) {
  if (err) return console.error(err)
  console.log('Get order tx\n', data)
})

cexRest.get_crypto_address('BTC', function (err, data) {
  if (err) return console.error(err)
  console.log('Get crypto address\n', data)
})

cexRest.get_my_fee(function (err, data) {
  if (err) return console.error(err)
  console.log('Get my fee\n', data)
})

cexRest.replace_order('ETH/USD', 4606529797, 'sell', 0.1, 340, function (err, data) {
  if (err) return console.error(err)
  console.log('Replace order\n', data)
})

cexRest.open_position('ETH', 'USD', 4, 3, 'long', true, 300, 280, function (err, data) {
  if (err) return console.error(err)
  console.log('Open position\n', data)
})

cexRest.open_positions('ETH/USD', function (err, data) {
  if (err) return console.error(err)
  console.log('Open positions\n', data)
})

cexRest.close_position('ETH/USD', 1, function (err, data) {
  if (err) return console.error(err)
  console.log('Close position\n', data)
})
*/
