var _ = require('underscore')
var restType = require('./rest')

function promiseRest(clientId, key, secret) {
  this.rest = new restType(clientId, key, secret)
}

promiseRest.prototype._promiseWrap = function(func) {
  return new Promise((resolve, reject) => {
    var callback = (err, data) => {
      if (err) reject(err)
      else resolve(data)
    }
    var newArgs = Array.prototype.slice.call(arguments, 1);
    newArgs.push(callback)
    func.apply(this.rest, newArgs)
  })
}

promiseRest.prototype.currency_limits = function () {
  return this._promiseWrap(this.rest.currency_limits)
}

promiseRest.prototype.ticker = function (symbol) {
  return this._promiseWrap(this.rest.ticker, symbol)
}

promiseRest.prototype.all_tickers = function (symbol) {
  return this._promiseWrap(this.rest.all_tickers, symbol)
}

promiseRest.prototype.last_price = function (symbol) {
  return this._promiseWrap(this.rest.last_price, symbol)
}

promiseRest.prototype.last_prices = function (symbol) {
  return this._promiseWrap(this.rest.last_prices, symbol)
}

promiseRest.prototype.historical_1m = function (symbol, date) {
  return this._promiseWrap(this.rest.historical_1m, symbol, date)
}

promiseRest.prototype.orderbook = function (symbol, limit) {
  return this._promiseWrap(this.rest.orderbook, symbol, limit)
}

promiseRest.prototype.trade_history = function (symbol, tid) {
  return this._promiseWrap(this.rest.trade_history, symbol, tid)
}

// Authenticated API requests

promiseRest.prototype.account_balance = function () {
  return this._promiseWrap(this.rest.account_balance)
}

promiseRest.prototype.open_orders = function (symbol) {
  return this._promiseWrap(this.rest.open_orders, symbol)
}

promiseRest.prototype.active_orders_status = function (list) {
  return this._promiseWrap(this.rest.active_orders_status, list)
}

promiseRest.prototype.archived_orders = function (symbol, limit, dateTo, dateFrom, lastTxDateTo, lastTxDateFrom, status) {
  return this._promiseWrap(this.rest.archived_orders, symbol, limit, dateTo, dateFrom, lastTxDateTo, lastTxDateFrom, status)
}

promiseRest.prototype.cancel_order = function (orderId) {
  return this._promiseWrap(this.rest.cancel_order, orderId)
}

promiseRest.prototype.cancel_pair_orders = function (symbol) {
  return this._promiseWrap(this.rest.cancel_pair_orders, symbol)
}

promiseRest.prototype.place_order = function (symbol, type, amount, price, orderType) {
  return this._promiseWrap(this.rest.place_order, symbol, type, amount, price, orderType)
}

promiseRest.prototype.get_order_details = function (orderId) {
  return this._promiseWrap(this.rest.get_order_details, orderId)
}

promiseRest.prototype.get_order_transactions = function (orderId) {
  return this._promiseWrap(this.rest.get_order_transactions, orderId)
}

promiseRest.prototype.get_crypto_address = function (currency) {
  return this._promiseWrap(this.rest.get_crypto_address, currency)
}

promiseRest.prototype.get_my_fee = function () {
  return this._promiseWrap(this.rest.get_my_fee)
}

promiseRest.prototype.replace_order = function (symbol, orderId, type, amount, price) {
  return this._promiseWrap(this.rest.replace_order, symbol, orderId, type, amount, price)
}

promiseRest.prototype.open_position = function (symbol, msymbol, amount, leverage, ptype, anySlippage, eoprice, stopLossPrice) {
  return this._promiseWrap(this.rest.open_position, symbol, msymbol, amount, leverage, ptype, anySlippage, eoprice, stopLossPrice)
}

promiseRest.prototype.open_positions = function (symbol) {
  return this._promiseWrap(this.rest.open_positions, symbol)
}

promiseRest.prototype.close_position = function (symbol, orderId) {
  return this._promiseWrap(this.rest.close_position, symbol, orderId)
}

promiseRest.prototype.archived_positions = function (symbol) {
  return this._promiseWrap(this.rest.archived_positions, symbol)
}

promiseRest.prototype.get_marginal_fee = function (symbol) {
  return this._promiseWrap(this.rest.get_marginal_fee, symbol)
}

module.exports = promiseRest