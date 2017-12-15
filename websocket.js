const crypto = require('crypto')
const WebSocket = require('ws');

function ws(key, secret) {
  this.url = 'wss://ws.cex.io/ws/'
  this.key = key
  this.secret = secret
  this.instance = undefined
}

ws.prototype.connect = function() {
    this.instance = new WebSocket(this.url, { perMessageDeflate: false })
}

ws.prototype.setMessageHandler = function(messageHandler) {
    this.instance.on('message', messageHandler)
}

function createSignature(timestamp, apiKey, apiSecret) {
  var hmac = crypto.createHmac('sha256', apiSecret )
  hmac.update( timestamp + apiKey )
  return hmac.digest('hex')
}

function createAuthRequest(apiKey, apiSecret ) {
  var timestamp = Math.floor(Date.now() / 1000)
  var args = { e: 'auth', auth: { key: apiKey, 
    signature: createSignature(timestamp, apiKey, apiSecret), timestamp: timestamp } }
  var authMessage = JSON.stringify( args )
  return authMessage
}

module.exports = ws
// const ws = 

// ws.on('open', function open() {
//     //ws.send('something');
// });
  
// ws.on('message', function incoming(data) {
//     console.log(data);
// });