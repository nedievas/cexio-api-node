const CEXIO = require('../index.js')
const cex = new CEXIO()
const cexWebSocket = cex.ws

//console.log(cex.ws)


cexWebSocket.connect()
cexWebSocket.setMessageHandler(onMessageRecieved)
// connection.on('message', function incoming(data) {
//     console.log(data);
// })
//cexWebSocket.setMessageHandler(onMessageRecieved)

function onMessageRecieved(data){ 
    console.log(data)
}

// var socket = cexWebSocket.ws(null, null, function(data) {
//     console.log(data);
// })

//socket.connection()