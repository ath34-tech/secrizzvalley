import { Server } from "socket.io";

export function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    import("./connection.js").then((mod) => mod.handleConnection(io, socket));
  });

  console.log("🟢 Socket.IO server ready");
  return io;
}
