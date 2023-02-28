import { useState } from "react";

export const connectKrakenWebSocket = () => {
    const socket = new WebSocket("wss://ws.kraken.com/");

    const pairs = [
        "BTC/USD", "ETH/USD", "XRP/USD", "SOL/USD", "ADA/USD", "BNB/USD", "DOGE/USD", "MATIC/USD", "HBAR/USD", "LTC/USD", "AAVE/USD",
        "ETH/XBT", "XRP/XBT", "SOL/XBT", "ADA/XBT", "BNB/XBT", "DOGE/XBT", "MATIC/XBT", "HBAR/XBT", "LTC/XBT", "AAVE/USD",
        "XBT/ETH", "XRP/ETH", "SOL/ETH", "ADA/ETH", "BNB/ETH", "DOGE/ETH", "MATIC/ETH", "HBAR/ETH", "LTC/ETH", "AAVE/USD",
    ];

    const publicWebSocketSubscriptionMsg = JSON.stringify({ event: "subscribe", subscription: {name: "ticker"}, pair: pairs });
    
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