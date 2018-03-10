const CEXIO = require('../index.js')

const apiKey = 'YOUR-API-KEY'
const apiSecret = 'YOUR-API-SECRET'

const cexWS = new CEXIO(apiKey, apiSecret).ws

/**
 * Open connection
 */
cexWS.open()

cexWS.on('open', async function () {
  console.log('WebSocket connected')

/**
 * Authenticate
 */
  cexWS.auth()

/**
 * Public data
 */
  //cexWS.subscribeTick()
  //cexWS.subscribeTicker()
  //cexWS.subscribeOHLCV()
})

cexWS.on('auth', async function () {
  console.log('Websocket authenticated')
/**
 * Private data
 */



    let balances = await cexWS.getBalance();
    console.log("balances",balances)


    let openorders = await cexWS.openOrders();
    console.log("openorders",openorders)


    let openorder = await cexWS.placeOrder("sell", 'BTC-USD', 10, 2900);
    console.log("openorder",openorder)


    let replaceOrder = await cexWS.replaceOrder(879879, "sell", 'BTC-USD', 10, 2900);
    console.log("replaceOrder",replaceOrder)


    let getOrder = await cexWS.getOrder(222900);
    console.log("getOrder",getOrder)


    let cancelOrder = await cexWS.cancelOrder(222900);
    console.log("cancelOrder",cancelOrder)


    let archivedOrders = await cexWS.archivedOrders();
    console.log("archivedOrders",archivedOrders)






  /*
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

  */

})

/**
 * Log messages
 */
cexWS.on('message', function (msg) {

  console.log('\n\n----message-begin----')
  console.log(msg.e)
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
