// src/network/gameSocket.js
export class GameSocket {
  constructor(token) {
    this.token = token;
    this.roomId = "valley-1";
    this.ws = null;
    this.onStateCallbacks = [];
    this.onOpen = null;
  }

  connect() {
    const wsUrl = `ws://localhost:8000/ws/game?token=${this.token}&room_id=${this.roomId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("🔌 Connected");
      if (this.onOpen) this.onOpen();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "state") {
          this.onStateCallbacks.forEach(cb => cb(data));
        }
      } catch (e) {
        console.error("Parse error:", e);
      }
    };

    this.ws.onclose = () => {
      console.log("🔌 Disconnected");
      setTimeout(() => this.connect(), 1000);
    };
  }

  onState(callback) {
    this.onStateCallbacks.push(callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.onclose = null; // Prevent auto-reconnect
      this.ws.close();
      this.ws = null;
    }
  }

  sendMove(x, y, dir) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      type: "move",
      x, y, dir,
      ts: Date.now()
    }));
  }
}
