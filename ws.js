'use strict'

const {EventEmitter} = require('events')
const debug = require('debug')('cexio:ws')
const crypto = require('crypto')
const WebSocket = require('ws')
const util = require('util')

/**
 * Handles communication with CEX.io WebSocket API.
 * @param {sting} APIKey
 * @param {string} APISecret
 * @event
 * @class
 */
const CexioWS = function (apiKey, apiSecret) {
  EventEmitter.call(this)

  this.apiKey = apiKey
  this.apiSecret = apiSecret
}

util.inherits(CexioWS, EventEmitter)

/**
 * @type {String}
 * @see https://cex.io/websocket-api#url
 */
CexioWS.prototype.WebSocketURI = 'wss://ws.cex.io/ws/'

CexioWS.prototype.open = function open () {
  this.ws = new WebSocket(this.WebSocketURI, { perMessageDeflate: false })
  this.ws.on('message', this.onMessage.bind(this))
  this.ws.on('open', this.onOpen.bind(this))
  this.ws.on('error', this.onError.bind(this))
  this.ws.on('close', this.onClose.bind(this))
}

CexioWS.prototype.onMessage = function (msg) {
  try {
    msg = JSON.parse(msg)
  } catch (e) {
    console.error('[cex.io ws error] received invalid json')
    console.error('[cex.io ws error]', msg)
    console.trace()
    return
  }
  debug('Received message: %j', msg)
  debug('Emited message event')
  this.emit('message', msg)
  if (msg.e === 'connected') {
    debug('Emitting \'connected\' %j', msg)
    this.emit('connected', msg)
  } else if (msg.e === 'auth' && msg.ok === 'error') {
    this.emit('error', msg)
    debug('Emitting \'error\' %j', msg)
  } else if (msg.e === 'auth') {
    debug('Emitting auth \'%s\' %j', msg.e, msg)
    this.emit(msg.e, msg)
  } else {
    debug('Emitting \'%s\' %j', msg.e, msg)
    this.emit(msg.e, msg)
  }
}

CexioWS.prototype.close = function () {
  this.ws.close()
}

CexioWS.prototype.onOpen = function () {
  debug('Connection opening, emitting open')
  this.emit('open')
}

CexioWS.prototype.onError = function (error) {
  this.emit('error', error)
}

CexioWS.prototype.onClose = function () {
  this.emit('close')
}

CexioWS.prototype.send = function (msg) {
  debug('Sending %j', msg)
  this.ws.send(JSON.stringify(msg))
}

/**
 * OHLCV charts subscriptions
 * @param  {string} [pair]      BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @param  {string} [snapshot]  requested chart updates (1m 3m 5m 15m 30m 1h 2h 4h 6h 12h 1d 3d 1w)
 *                              The default is 1m.
 * @see https://cex.io/websocket-api#minute-data
 */
CexioWS.prototype.subscribeOHLCV = function (pair = 'BTC-USD', snapshot = '1m') {
  this.send({
    e: 'init-ohlcv',
    i: snapshot,
    rooms: [
      'pair-' + pair
    ]
  })
}

/**
 * The currency pair and price of last submitted trade.
 * The message is sent any time when trade transaction on any pair is executed.
 * @see https://cex.io/websocket-api#ticker-subscription
 */
CexioWS.prototype.subscribeTick = function () {
  this.send({
    e: 'subscribe',
    rooms: [
      'tickers'
    ]
  })
}

CexioWS.prototype.subscribeTicker = function () {
  this.send({
    e: 'subscribe',
    rooms: [
      'ticker'
    ]
  })
}

/**
 * 'Ticker' request
 * This is the simplest request to ensure that client is connected and authenticated.
 * Returns the response with the lowest ask price and highest bid price for the pair.
 * @param  {string}  [pair]      BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @see https://cex.io/websocket-api#ticker-deprecated
 */
CexioWS.prototype.authTicker = function (pair = 'BTC-USD') {
  this.send({
    e: 'ticker',
    data: [
      pair.split('-')[0],
      pair.split('-')[1]
    ],
    oid: Date.now() + '_ticker'
  })
}

/**
 * Get balance request
 * @see https://cex.io/websocket-api#get-balance
 */
CexioWS.prototype.getBalance = function () {
  this.send({
    e: 'get-balance',
    data: {},
    oid: Date.now() + '_balance'
  })
}

/**
 * Order Book subscription
 * @param  {string}   [pair]      BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @param  {boolean}  [action]    subscribe mode. Default false
 * @param  {interger} [depth]     Depth of data in response. Default -1
   *                                -1: empty data in response
 *                                  0: unlimited data in response
 *                                  N: depth of data mentioned in request
 * @see https://cex.io/websocket-api#orderbook-subscribe
 */
CexioWS.prototype.subscribeOrderBook = function (pair = 'BTC-USD', action = false, depth = -1) {
  this.send({
    e: 'order-book-subscribe',
    data: {
      pair: [
        pair.split('-')[0],
        pair.split('-')[1]
      ],
      subscribe: action,
      depth: depth
    },
    oid: Date.now() + '_orderbook-subscribe'
  })
}

/**
 * Unsubscribe from order book
 * @param  {string}  [pair]      BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @see https://cex.io/websocket-api#orderbook-unsubscribe
 */
CexioWS.prototype.unsubscribeOrderBook = function (pair = 'BTC-USD') {
  this.send({
    e: 'order-book-unsubscribe',
    data: {
      pair: [
        pair.split('-')[0],
        pair.split('-')[1]
      ]
    },
    oid: Date.now() + '_orderbook-unsubscribe'
  })
}

/**
 * List of open orders
 * @param  {string}  [pair]      BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @see https://cex.io/websocket-api#open-orders
 */
CexioWS.prototype.openOrders = function (pair = 'BTC-USD') {
  this.send({
    e: 'open-orders',
    data: {
      pair: [
        pair.split('-')[0],
        pair.split('-')[1]
      ]
    },
    oid: Date.now() + '_open-orders'
  })
}

/**
 * Order placement request
 * @param  {string}  [action]    Order direction. buy or sell.
 * @param  {string}  [pair]      BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @param  {decimal} [amount]    Order amount
 * @param  {decimal} [price]     Order price
 * @see https://cex.io/websocket-api#order-placement
 */
CexioWS.prototype.placeOrder = function (action, pair = 'BTC-USD', amount, price) {
  var order
  if (action === 'buy') {
    order = {
      e: 'place-order',
      data: {
        pair: [
          pair.split('-')[0],
          pair.split('-')[1]
        ],
        amount: amount,
        price: price,
        type: 'buy'
      },
      oid: Date.now() + '_buy'
    }
  } else {
    order = {
      e: 'place-order',
      data: {
        pair: [
          pair.split('-')[0],
          pair.split('-')[1]
        ],
        amount: amount,
        price: price,
        type: 'sell'
      },
      oid: Date.now() + '_sell'
    }
  }
  this.send(order)
}

/**
 * Order cancel-replace request
 * @param  {interger}  [orderId]   Order id to replace
 * @param  {string}    [action]    Order direction. buy or sell.
 * @param  {string}    [pair]      BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @param  {decimal}   [amount]    Order amount
 * @param  {decimal}   [price]     Order price
 * @see https://cex.io/websocket-api#cancel-replace
 */
CexioWS.prototype.replaceOrder = function (orderId, action, pair = 'BTC-USD', amount, price) {
  var order
  if (action === 'buy') {
    order = {
      e: 'cancel-replace-order',
      data: {
        order_id: orderId,
        pair: [
          pair.split('-')[0],
          pair.split('-')[1]
        ],
        amount: amount,
        price: price,
        type: 'buy'
      },
      oid: Date.now() + '_replace_buy'
    }
  } else {
    order = {
      e: 'cancel-replace-order',
      data: {
        order_id: orderId,
        pair: [
          pair.split('-')[0],
          pair.split('-')[1]
        ],
        amount: amount,
        price: price,
        type: 'sell'
      },
      oid: Date.now() + '_replace_sell'
    }
  }
  this.send(order)
}

/**
 * Get order request
 * @param  {interger}  [orderId]    Order identifier
 * @see https://cex.io/websocket-api#get-order
 */
CexioWS.prototype.getOrder = function (orderId) {
  this.send({
    e: 'get-order',
    data: {
      order_id: orderId
    },
    oid: Date.now() + '_order'
  })
}

/**
 * Order cancel request
 * @param  {interger}  [orderId]    Order identifier
 * @see https://cex.io/websocket-api#order-cancel
 */
CexioWS.prototype.cancelOrder = function (orderId) {
  this.send({
    e: 'cancel-order',
    data: {
      order_id: orderId
    },
    oid: Date.now() + '_cancel'
  })
}

/**
 * List of archived orders
 * @param  {string}    [pair]      BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @param  {interger}  [limit]     Number of orders in response (100 orders in response is a maximum)
 * @param  {unixtime}  [dateFrom]  Starting date for search
 * @param  {unixtime}  [dateTo]    Ending date for search
 * @see https://cex.io/websocket-api#archived
 */
CexioWS.prototype.archivedOrders = function (pair = 'BTC-USD', limit = 5) {
  this.send({
    e: 'archived-orders',
    data: {
      pair: [
        pair.split('-')[0],
        pair.split('-')[1]
      ],
      limit: limit
    },
    oid: Date.now() + '_archived-orders'
  })
}

/**
 * Open position
 * @param  {string}         [action]         position type:  'long' - buying 'product', profitable if product price grows
 *                                                           'short' - selling 'product', profitable if product price falls
 * @param  {string}         [pair]           BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @param  {string/float}   [amount]         total amount of 'product' to buy using borrowed funds and user's funds
 * @param  {string}         [symbol]         currency to buy (product)
 * @param  {string}         [leverage]       leverage ratio of total funds (user's and borrowed) to user's funds. Default 2
 * @param  {string/boolean} [anySlippage]    allows to open position at changed price
 * @param  {float}          [eoprice]        estimated price at which your position will be opened
 * @param  {float}          [stopLossPrice]  price near which your position will be closed automatically in case of unfavorable market conditions
 * @see https://cex.io/websocket-api#open-position
 */
CexioWS.prototype.openPosition = function (action, pair = 'BTC-USD', symbol, amount, leverage = 2, eoprice, stopLossPrice, anySlippage = 'true') {
  var position
  if (action === 'long') {
    position = {
      e: 'open-position',
      oid: Date.now() + '_long',
      data: {
        'amount': amount.toString(),
        'symbol': symbol,
        pair: [
          pair.split('-')[0],
          pair.split('-')[1]
        ],
        'leverage': leverage.toString(),
        'ptype': 'long',
        'anySlippage': anySlippage,
        'eoprice': eoprice.toString(),
        'stopLossPrice': stopLossPrice.toString()
      }
    }
  } else {
    position = {
      e: 'open-position',
      oid: Date.now() + '_short',
      data: {
        'amount': amount.toString(),
        'symbol': symbol,
        pair: [
          pair.split('-')[0],
          pair.split('-')[1]
        ],
        'leverage': leverage.toString(),
        'ptype': 'short',
        'anySlippage': anySlippage,
        'eoprice': eoprice.toString(),
        'stopLossPrice': stopLossPrice.toString()
      }
    }
  }
  this.send(position)
}

/**
 * Get position
 * @param  {interger}  [positionId]    position's id
 * @see https://cex.io/websocket-api#get-position
 */
CexioWS.prototype.getPosition = function (positionId) {
  this.send({
    e: 'get-position',
    oid: Date.now() + '_position',
    data: {
      id: positionId
    }
  })
}

/**
 * Open positions
 * @param  {string}  [pair]  BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @see https://cex.io/websocket-api#open-positions
 */
CexioWS.prototype.openPositions = function (pair = 'BTC-USD') {
  this.send({
    e: 'open-positions',
    oid: Date.now() + '_open_positions',
    data: {
      pair: [
        pair.split('-')[0],
        pair.split('-')[1]
      ]
    }
  })
}

/**
 * Close position
 * @param  {string}    [pair]          BTC-USD, LTC-USD or LTC-BTC. Default BTC-USD
 * @param  {interger}  [positionId]    position's id
 * @see https://cex.io/websocket-api#close-position
 */
CexioWS.prototype.closePosition = function (positionId, pair = 'BTC-USD') {
  this.send({
    e: 'close-position',
    oid: Date.now() + '_close_position',
    data: {
      pair: [
        pair.split('-')[0],
        pair.split('-')[1]
      ],
      id: positionId
    }
  })
}

/**
 * Authenticate the user.
 * @param  {string}     [this.apiKey]   API key
 * @param  {string}     [signature]     Client signature
 *                                        (digest of HMAC-rsa256 with client's API Secret Key, applied to the string,
     *                                     which is concatenation timestamp and API Key)
 * @param  {timestamp}  [timestamp]     Client signature
 * @see https://cex.io/websocket-api#authentication
 */
CexioWS.prototype.auth = function () {
  var timestamp = Math.floor(Date.now() / 1000)
  let signature = crypto.createHmac('sha256', this.apiSecret).update(timestamp + this.apiKey).digest('hex')
  var args = {
    e: 'auth',
    auth: {
      key: this.apiKey,
      signature: signature,
      timestamp: timestamp
    }
  }
  this.send(args)
}

module.exports = CexioWS
