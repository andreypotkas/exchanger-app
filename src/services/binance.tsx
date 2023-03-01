export const connectBinanceWebSocket = () => {
    const socket = new WebSocket("wss://fstream.binance.com/ws/");

    const publicWebSocketSubscriptionMsg = JSON.stringify({
        "method": "SUBSCRIBE",
        "params": [
          "btcusdt@ticker",
          "ethusdt@ticker",
          "adausdt@ticker",
          "bnbusdt@ticker",
          "solusdt@ticker",
          "xrpusdt@ticker",
          "ltcusdt@ticker",
          "hbarusdt@ticker",
          "dogeusdt@ticker",
          "maticusdt@ticker",
          "aaveusdt@ticker",
        ],
        "id": 1
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