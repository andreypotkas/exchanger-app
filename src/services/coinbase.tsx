export const connectCoinbaseWebSocket = () => {
    const socket = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    const pairs = [
        "BTC-USD", "ETH-USD", "XRP-USD", "SOL-USD", "ADA-USD", "BNB-USD", "DOGE-USD", "MATIC-USD", "HBAR-USD", "LTC-USD", "AAVE-USD",
        "ETH-XBT", "XRP-XBT", "SOL-XBT", "ADA-XBT", "BNB-XBT", "DOGE-XBT", "MATIC-XBT", "HBAR-XBT", "LTC-XBT", "AAVE-XBT",
        "XBT-ETH", "XRP-ETH", "SOL-ETH", "ADA-ETH", "BNB-ETH", "DOGE-ETH", "MATIC-ETH", "HBAR-ETH", "LTC-ETH", "AAVE-ETH"
    ];

    const publicWebSocketSubscriptionMsg = JSON.stringify({
        "type": "subscribe",
        "product_ids": pairs,
        "channels": [
            {
                "name": "ticker",
                "product_ids": pairs
            }
        ]
      });
    
    let isgWebSocketOpen = false;
    
    socket.onopen = () => {
        isgWebSocketOpen = true;
        socket.send(publicWebSocketSubscriptionMsg);
    };

    socket.onclose = () => {
        isgWebSocketOpen = false;
    };

    return socket;
}