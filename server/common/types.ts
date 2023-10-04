export interface Order {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT' | 'LIMIT_MAKER';
    timestamp: number,
    timeInForce: 'GTC' | 'IOC' | 'FOK',
    quantity: number,
    price: number
  }

  export interface OrderBook {
    lastUpdateId: number;
    bids: string[][];
    asks: string[][];
  }