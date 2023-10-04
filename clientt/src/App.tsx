import React, { FormEvent, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Form from './components/Form';
import OrderForm from './components/OrderForm';
// import { Order } from './common/types';;;;

interface OrderBook {
  lastUpdateId: number;
  bids: string[][];
  asks: string[][];
}

function App() {

  const [orderBook,  setOrderBook] = useState<OrderBook | undefined>()
  const [liveBids,  setLiveBids] = useState([['','']])
  const [liveAsks,  setLiveAsks] = useState<string[][]>([['','']])
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [limit, setLimit] = useState('20');
  const [avgPrice, setAvgPrice] = useState('0');
  const [orderId, setOrderId] = useState();

  const WS_URL = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`;

  useWebSocket(WS_URL, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event)
  });

  useEffect(() => {
    getAvgPrice();
    searchBook();
  }, [])

  const handleSymbolSearch = async(event: FormEvent, symbol: string) => {
    event.preventDefault();
    getAvgPrice(symbol);
    searchBook(symbol, limit);
  };

  const handleLimitSearch = async(event: FormEvent, limit: string) => {
    event.preventDefault();
    getAvgPrice(symbol);
    searchBook(symbol, limit);
  };

  const handleNewOrder = async(event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formJson = Object.fromEntries(formData.entries());
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formJson)
  };
    fetch('/binance/order', requestOptions).then(
      response => response.json()
    ).then(
      data => {
        setOrderId(data.orderId);
        getAvgPrice(symbol);
        searchBook(symbol, limit);
      }
    )
  };

  const searchBook = (symbol: string = 'BTCUSDT', limit: string = '20') => {
    fetch('/binance/book?symbol=' + symbol + '&limit=' + limit).then(
      response => response.json()
    ).then(
      data => {
        setOrderBook(data)
      }
    )
  };

  const getAvgPrice = (symbol: string = 'BTCUSDT') => {
    fetch('/binance/avgPrice?symbol=' + symbol).then(
      response => response.json()
    ).then(
      data => {
        setAvgPrice(data.price)
      }
    )
  };

  const processMessages = (event: {data: string}) => {
    let data = JSON.parse(event.data);
    let currentBids = data.b.map((bid: string[]) => {return [bid[0], bid[1], (parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(3)]});
    let currentAsks = data.a.map((ask: string[]) => {return [ask[0], ask[1], (parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(3)]});
    setLiveBids(currentBids);
    setLiveAsks(currentAsks);
  };

  return (
    <div>
      <div>
        <Form label="Choose exchange"
          type="text"
          id="symbol"
          buttonText="Submit"
          placeholder=""
          value={symbol}
          valueArray = 'BTCUSDT,ETHUSDT,SOLUSDT'
          onChange={(e) => setSymbol(e.target.value)}
          onSubmit={(e) => handleSymbolSearch(e, symbol) } />
      </div>
      <div>
        <Form label="Limit"
          type="text"
          id="limit"
          buttonText="Submit"
          placeholder=""
          value={limit}
          valueArray = '2,10,20,100'
          onChange={(e) => setLimit(e.target.value)}
          onSubmit={(e) => handleLimitSearch(e, limit) } />
      </div>
      <div>
        { (typeof orderBook === 'undefined') ?
          ( <p>Loading...</p>) : (
            <div>
              <h1>Avg Price : {avgPrice}</h1>
              <table>
                <tr>
                  <th>Buying</th>
                  <th>Selling</th>
                </tr>
                <tr>
                  <td>
                    <table>
                    <tr>
                      <th>Price</th>
                      <th>Amount</th>
                      <th>Total</th>
                  </tr>
                  {orderBook.bids.map((bid, index) => (
                          <tr
                            key={index}
                          >
                              <td>{bid[0]}</td>
                              <td>{bid[1]}</td>
                              <td>{bid[2]}</td>
                          </tr>
                      ))}
                    </table>
                  </td>
                  <td>
                    <table>
                    <tr>
                      <th>Price</th>
                      <th>Amount</th>
                      <th>Total</th>
                  </tr>
                  {orderBook.asks.map((ask, index) => (
                          <tr
                            key={index}
                          >
                              <td>{ask[0]}</td>
                              <td>{ask[1]}</td>
                              <td>{ask[2]}</td>
                          </tr>
                      ))}
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          )
        }
      </div>
      <div>
        <OrderForm label="Place Order"
          type="text"
          id="symbol"
          buttonText="Submit"
          value={symbol}
          // onChange={(e) => setOrder(e.target.value)}
          onSubmit={(e) => handleNewOrder(e) } />
          {(orderId) ?  <p>Order placed successfully: {orderId}</p> : <p></p>}
      </div>
      <div>
      <table>
            <tr>
              <th>Buying</th>
              <th>Selling</th>
            </tr>
            <tr>
              <td>
                <table>
                <tr>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Total</th>
              </tr>
              {liveBids.map((bid: string[]) => (
                      <tr>
                          <td>{bid[0]}</td>
                          <td>{bid[1]}</td>
                          <td>{bid[2]}</td>
                      </tr>
                  ))}
                </table>
              </td>
              <td>
                <table>
                <tr>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Total</th>
              </tr>
              {liveAsks.map((ask, index) => (
                      <tr
                        key={index}
                      >
                          <td>{ask[0]}</td>
                          <td>{ask[1]}</td>
                          <td>{ask[2]}</td>
                      </tr>
                  ))}
                </table>
              </td>
            </tr>
          </table>
      </div>
    </div>
  )
}

export default App;
