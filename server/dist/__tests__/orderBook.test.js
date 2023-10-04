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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
describe('orderBook', () => {
    it('should return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.app).get(`/binance/book`).expect(200);
    }));
    it('should get 2 bids and 2 asks', () => __awaiter(void 0, void 0, void 0, function* () {
        // expect(true).toBe(true);
        const symbol = 'SOLUSDT';
        const limit = 2;
        const { body, statusCode } = yield (0, supertest_1.default)(server_1.app)
            .get(`/binance/book?symbol=${symbol}&limit=${limit}`)
            .expect(200);
        // console.log(body);
        expect(body.bids.length).toBe(2);
        expect(body.asks.length == 2);
    }));
});
