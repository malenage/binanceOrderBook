import express, { Express, Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

interface Order {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT' | 'LIMIT_MAKER';
  timestamp: number,
  timeInForce: 'GTC' | 'IOC' | 'FOK',
  quantity: number,
  price: number
}

const domain = 'https://api1.binance.com';
// const domain = 'https://testnet.binance.vision';
// const wsEndpoint = 'wss://ws-api.binance.com:443/ws-api/v3';
// const testWsEndpoint = 'wss://testnet.binance.vision/ws-api/v3';
// wss://stream.binance.com:9443/ws/bnbusdt@depth@100ms

router.get('/', (req, res) => {
    res.json({"mes": "Hello world!"});
});

router.get('/binance/book', async(req, res) => {
    const symbol = (req.query.symbol) ? req.query.symbol : 'BTCUSDT';
    const limit = (req.query.limit) ? req.query.limit : 20;
    const config = {
        method: 'GET',
        url: domain + '/api/v3/depth?limit='+ limit +'&symbol=' + symbol,
        headers: {
          'Content-Type': 'application/json',
        },
      };
    let body = await axios(config);
    body.data.bids = body.data.bids.map((bid: string[]) => {
      let total = (parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(5).toString();
      return [...bid, total];
    });
    body.data.asks = body.data.asks.map((ask: string[]) => {
      let total = (parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(5).toString();
      return [...ask, total];
    });
    res.json(body.data);
    
});

router.get('/binance/avgPrice', async(req: Request, res: Response) => {
  const symbol = (req.query.symbol) ? req.query.symbol : 'BTCUSDT';
  const config = {
    method: 'GET',
    url: domain + '/api/v3/avgPrice?symbol=' + symbol,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  const body = await axios(config);
  const result = (body.data) ? body.data : 0;
  res.json(result);
});

router.post('/binance/order', async(req: Request, res: Response) => {
  const API_KEY = process.env.API_KEY!;
  const PRIVATE_KEY = process.env.PRIVATE_KEY!;

  // console.log('body ' + JSON.stringify(req.body));
  
  // let params: Order = {
  //   symbol: 'BTCUSDT',
  //   side: 'BUY',
  //   type: 'LIMIT',
  //   timeInForce: 'GTC',
  //   quantity: 0.001,
  //   price: 27000.61,
  //   timestamp: new Date().getTime(),
  // };

  let params: Order = req.body;
  params.timestamp =  new Date().getTime();

  const makeQueryString = (q: any, noEncode: boolean = false) => {
    return Object.keys(q)
      .sort()
      .reduce((a: any, k) => {
        if (Array.isArray(q[k])) {
          q[k].forEach((v: any) => {
            a.push(k + '=' + (noEncode ? v : encodeURIComponent(v)));
          });
        } else if (q[k] !== undefined) {
          a.push(k + '=' + (noEncode ? q[k] : encodeURIComponent(q[k])));
        }
        return a;
      }, [])
      .join('&');
  };

  // Step 1: Construct the payload
  let payloadString = makeQueryString(params, false);
  // Step 2: Compute the signature: Sign payload using RSASSA-PKCS1-v1_5 algorithm with SHA-256 hash function.
  // Encode output as base64 string.
  let signature = crypto.createHmac('sha256', PRIVATE_KEY).update(payloadString).digest('hex');
  payloadString = payloadString + '&signature=' + signature;
  // console.log(payloadString);

  const config = {
    method: 'POST',
    url: domain + '/api/v3/order?' + payloadString,
    headers: {
      'Content-Type': 'application/json',
      'X-MBX-APIKEY': API_KEY
    }
  };
  const body = await axios(config);
  res.json(body.data);
});

router.get('/coinbase/book', async(req, res) => {
  const symbol = (req.query.symbol) ? req.query.symbol : 'BTC-USDT';
  const level = (req.query.limit) ? req.query.limit : 2;
  const config = {
      method: 'GET',
      url: 'https://api.exchange.coinbase.com/products/'+symbol+'/book?level=' + level,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  let body = await axios(config);
  body.data.bids = body.data.bids.map((bid: string[]) => {
    let total = (parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(5).toString();
    return [...bid, total];
  });
  body.data.asks = body.data.asks.map((ask: string[]) => {
    let total = (parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(5).toString();
    return [...ask, total];
  });
  res.json(body.data);
  
});

module.exports = router;
