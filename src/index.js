import express from "express";
import { createServer } from "http";
import { initSocketServer } from "./network/socketServer.js";
import { PORT } from "./config.js";

const app = express();
const httpServer = createServer(app);

initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🔥 Multiplayer server listening on ${PORT}`);
});
