import supertest from 'supertest';
import { app }  from '../server';
import { OrderBook } from '../common/types';

describe('orderBook', () => {
    it('should return 200', async() => {
        await supertest(app).get(`/binance/book`).expect(200);
    });

    it('should get 2 bids and 2 asks', async() => {
        // expect(true).toBe(true);
        const symbol = 'SOLUSDT';
        const limit = 2;
        const { body, statusCode} = await supertest(app)
        .get(`/binance/book?symbol=${symbol}&limit=${limit}`)
        .expect(200)
        // console.log(body);
        expect(body.bids.length).toBe(2)
        expect(body.asks.length == 2)
    });
});