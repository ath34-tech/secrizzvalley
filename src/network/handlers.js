// handlers.js
import world from "../game/world.js";
import { validMovement } from "../game/movement.js";
import { getRoomPlayers } from "./rooms.js";

export function setupHandlers(io, socket, room, userId) {
  socket.on("pos", (data) => {
    console.log(`[RECV pos] from ${userId}`, data);
    const prev = world.getRoom(room)[userId];
    const next = { x: data.x, y: data.y, ts: data.ts || Date.now() };

    if (!validMovement(prev, next)) {
      socket.emit("movement_rejected", { reason: "speed" });
      return;
    }

    world.setPosition(room, userId, next.x, next.y);

    console.log(`[EMIT pos] from ${userId} -> room:${room}`, next);
    socket.to(room).emit("pos", {
      userId,
      x: next.x,
      y: next.y,
      ts: next.ts,
    });
  });

  socket.on("avatar_update", (avatarUrl) => {
    console.log(`[RECV avatar_update] from ${userId}`, avatarUrl);
    const players = getRoomPlayers(room);
    if (players[userId]) players[userId].avatarUrl = avatarUrl;

    // Broadcast updated avatar as a small msg (clients will request state if needed)
    socket.to(room).emit("avatar_update", { userId, avatar: avatarUrl });
  });

  socket.on("request_state", () => {
    console.log(`[RECV request_state] from ${userId}`);
    const roomPlayers = getRoomPlayers(room);
    const avatars = {};
    const players = {};

    for (const [id, p] of Object.entries(roomPlayers)) {
      avatars[id] = p.avatarUrl || null;
      players[id] = world.getRoom(room)[id] || { x: 200, y: 200 };
    }

    socket.emit("initial_state", { players, avatars });
  });
}
