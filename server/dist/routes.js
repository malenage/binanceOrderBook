"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const domain = 'https://api1.binance.com';
// const domain = 'https://testnet.binance.vision';
// const wsEndpoint = 'wss://ws-api.binance.com:443/ws-api/v3';
// const testWsEndpoint = 'wss://testnet.binance.vision/ws-api/v3';
// wss://stream.binance.com:9443/ws/bnbusdt@depth@100ms
router.get('/', (req, res) => {
    res.json({ "mes": "Hello world!" });
});
router.get('/binance/book', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const symbol = (req.query.symbol) ? req.query.symbol : 'BTCUSDT';
    const limit = (req.query.limit) ? req.query.limit : 20;
    const config = {
        method: 'GET',
        url: domain + '/api/v3/depth?limit=' + limit + '&symbol=' + symbol,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    let body = yield (0, axios_1.default)(config);
    body.data.bids = body.data.bids.map((bid) => {
        let total = (parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(5).toString();
        return [...bid, total];
    });
    body.data.asks = body.data.asks.map((ask) => {
        let total = (parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(5).toString();
        return [...ask, total];
    });
    res.json(body.data);
}));
router.get('/binance/avgPrice', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const symbol = (req.query.symbol) ? req.query.symbol : 'BTCUSDT';
    const config = {
        method: 'GET',
        url: domain + '/api/v3/avgPrice?symbol=' + symbol,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const body = yield (0, axios_1.default)(config);
    const result = (body.data) ? body.data : 0;
    res.json(result);
}));
router.post('/binance/order', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const API_KEY = process.env.API_KEY;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
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
    let params = req.body;
    params.timestamp = new Date().getTime();
    const makeQueryString = (q, noEncode = false) => {
        return Object.keys(q)
            .sort()
            .reduce((a, k) => {
            if (Array.isArray(q[k])) {
                q[k].forEach((v) => {
                    a.push(k + '=' + (noEncode ? v : encodeURIComponent(v)));
                });
            }
            else if (q[k] !== undefined) {
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
    let signature = crypto_1.default.createHmac('sha256', PRIVATE_KEY).update(payloadString).digest('hex');
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
    const body = yield (0, axios_1.default)(config);
    res.json(body.data);
}));
router.get('/coinbase/book', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const symbol = (req.query.symbol) ? req.query.symbol : 'BTC-USDT';
    const level = (req.query.limit) ? req.query.limit : 2;
    const config = {
        method: 'GET',
        url: 'https://api.exchange.coinbase.com/products/' + symbol + '/book?level=' + level,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    let body = yield (0, axios_1.default)(config);
    body.data.bids = body.data.bids.map((bid) => {
        let total = (parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(5).toString();
        return [...bid, total];
    });
    body.data.asks = body.data.asks.map((ask) => {
        let total = (parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(5).toString();
        return [...ask, total];
    });
    res.json(body.data);
}));
module.exports = router;
