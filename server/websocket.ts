// import ws from 'ws';
const Websocket = require('ws');
import events from 'events';

// let websocket = {
//     EE: new events(),
//     ws: '',
//     switchSymbol: (symbol: string) => {
//         if (websocket.ws) websocket.ws.terminate();
//         websocket.ws = new Websocket(
//             `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
//         );
//         websocket.ws.on('message', websocket.processStream);
//     },
//     processStream: (payload: string) => {
//         const parsedPayload = JSON.parse(payload);
//         websocket.EE.emit('OBUPDATES', parsedPayload);
//     },
// };

// module.exports = websocket;