const crypto = require('crypto')
const request = require('request')
const querystring = require('querystring')
var _ = require('underscore')

function rest (clientId, key, secret) {
  this.url = 'https://cex.io/api'
  this.clientId = clientId
  this.key = key
  this.secret = secret
}

rest.prototype.auth_request = function (path, params = {}, cb) {
  var headers, key, nonce, message, signature, url, body, value
  if (!this.key || !this.secret) {
    return cb(new Error('missing api key or secret'))
  }
  url = `${this.url}/${path}`
  nonce = new Date().getTime() * 1000
  message = nonce.toString() + this.clientId + this.key
  signature = crypto.createHmac('sha256', Buffer.from(this.secret)).update(message).digest('hex')
  body = _.extend({
    key: this.key,
    signature: signature.toUpperCase(),
    nonce: nonce++
  }, params)
  for (key in params) {
    value = params[key]
    body[key] = value
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  body = querystring.stringify(body)
  return request({
    url,
    method: 'POST',
    params,
    headers,
    body,
    timeout: 15000
  }, (err, response, body) => {
    let result = JSON.parse(body)
    if (err || (response.statusCode !== 200 && response.statusCode !== 400)) {
      return cb(new Error(err != null ? err : response.statusCode))
    }
    if (response.body === 'true') {
      return cb(null, 'Order canceled')
    }
    if (response.body === 'null') {
      return cb(null, 'error: Order not found')
    }
    if ('e' in result) {
      if ('ok' in result) {
        if (result['ok'] === 'ok') {
          if (result['data'].length === 0) {
            return cb(null, 'error: No Pair Orders or Possitions Found')
          }
          return cb(null, result.data)
        }
        if (result['ok'] === 'error') {
          return cb(null, 'error: ' + result['error'])
        }
      }
    } else if ('error' in result) {
      if (result['error']) {
        return cb(null, 'error: ' + result['error'])
      }
    }
    return cb(null, result)
  })
}

rest.prototype.public_request = function (path, cb) {
  const url = `${this.url}/${path}`
  return request({
    url,
    method: 'GET',
    timeout: 60000
  }, (err, response, body) => {
    let result = JSON.parse(body)
    if (err || (response.statusCode !== 200 && response.statusCode !== 400)) {
      return cb(new Error(err != null ? err : response.statusCode))
    }
    if (response.body === 'null') {
      return cb(null, 'error: Invalid Date Format or Current Date')
    }
    if (response.body === '[]') {
      return cb(null, 'error: Invalid Symbols Pairs')
    }
    if ('e' in result) {
      if ('ok' in result) {
        if (result['ok'] === 'ok') {
          if (result['data'].length === 0) {
            return cb(null, 'error: Invalid Symbols Pairs')
          }
          return cb(null, result.data)
        }
      }
    } else if ('error' in result) {
      if (result['error']) {
        return cb(null, 'error: ' + result['error'])
      }
    }
    return cb(null, result)
  })
}

// Public API requests

rest.prototype.currency_limits = function (cb) {
  return this.public_request('currency_limits', cb)
}

rest.prototype.ticker = function (symbol = 'BTC/USD', cb) {
  return this.public_request(`ticker/${symbol}`, cb)
}

rest.prototype.all_tickers = function (symbol = 'USD/EUR/RUB/BTC', cb) {
  return this.public_request(`tickers/${symbol}`, cb)
}

rest.prototype.last_price = function (symbol, cb) {
  return this.public_request(`last_price/${symbol}`, cb)
}

rest.prototype.last_prices = function (symbol = 'BTC/USD/LTC/EUR', cb) {
  return this.public_request(`last_prices/${symbol}`, cb)
}

rest.prototype.historical_1m = function (symbol = 'BTC/USD', date, cb) {
  return this.public_request(`ohlcv/hd/${date}/${symbol}`, cb)
}

rest.prototype.orderbook = function (symbol = 'BTC/USD', limit = 1, cb) {
  let uri
  if (limit === 0 || limit === '0') {
    uri = `order_book/${symbol}`
  } else {
    uri = `order_book/${symbol}/?depth=${limit}`
  }
  return this.public_request(uri, cb)
}

rest.prototype.trade_history = function (symbol = 'BTC/USD', tid = 1, cb) {
  let uri
  if (tid === 0 || tid === '0') {
    uri = `trade_history/${symbol}`
  } else {
    uri = `trade_history/${symbol}/?since=${tid}`
  }
  return this.public_request(uri, cb)
}

// Authenticated API requests

rest.prototype.account_balance = function (cb) {
  return this.auth_request('balance/', {}, cb)
}

rest.prototype.open_orders = function (symbol = 'BTC/USD', cb) {
  let uri
  if (!symbol || symbol.length <= 3) {
    uri = `open_orders/`
  } else {
    uri = `open_orders/${symbol}`
  }
  return this.auth_request(uri, {}, cb)
}

rest.prototype.active_orders_status = function (list = [], cb) {
  return this.auth_request('active_orders_status', {orders_list: list}, cb)
}

rest.prototype.archived_orders = function (symbol = 'BTC/USD', limit, dateTo, dateFrom, lastTxDateTo, lastTxDateFrom, status, cb) {
  return this.auth_request(`archived_orders/${symbol}`, {limit, dateTo, dateFrom, lastTxDateTo, lastTxDateFrom, status}, cb)
}

rest.prototype.cancel_order = function (orderId, cb) {
  return this.auth_request('cancel_order/', {id: orderId}, cb)
}

rest.prototype.cancel_pair_orders = function (symbol = 'BTC/USD', cb) {
  return this.auth_request(`cancel_orders/${symbol}`, {}, cb)
}

rest.prototype.place_order = function (symbol, type, amount, price, orderType, cb) {
  return this.auth_request(`place_order/${symbol}`, {type, amount, price, order_type: orderType}, cb)
}

rest.prototype.get_order_details = function (orderId, cb) {
  return this.auth_request('get_order/', {id: orderId}, cb)
}

rest.prototype.get_order_transactions = function (orderId, cb) {
  return this.auth_request('get_order_tx/', {id: orderId}, cb)
}

rest.prototype.get_crypto_address = function (currency, cb) {
  return this.auth_request('get_address', {currency}, cb)
}

rest.prototype.get_my_fee = function (cb) {
  return this.auth_request('get_myfee', {}, cb)
}

rest.prototype.replace_order = function (symbol = 'BTC/USD', orderId, type, amount, price, cb) {
  return this.auth_request(`cancel_replace_order/${symbol}`, {order_id: orderId, type, amount, price}, cb)
}

rest.prototype.open_position = function (symbol = 'BTC', msymbol = 'USD', amount, leverage = 3, ptype = 'long', anySlippage = true, eoprice, stopLossPrice, cb) {
  return this.auth_request(`open_position/${symbol}/${msymbol}`, {symbol, msymbol, amount, leverage, ptype, anySlippage, eoprice, stopLossPrice}, cb)
}

rest.prototype.open_positions = function (symbol = 'BTC/USD', cb) {
  return this.auth_request(`open_positions/${symbol}`, {}, cb)
}

rest.prototype.close_position = function (symbol, orderId, cb) {
  return this.auth_request(`close_position/${symbol}`, {symbol, id: orderId}, cb)
}

module.exports = rest
