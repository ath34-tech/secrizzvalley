// connection.js
import { verifyToken } from "../auth/supabase.js";
import { addPlayer, removePlayer, getRoomPlayers } from "./rooms.js";
import { setupHandlers } from "./handlers.js";
import world from "../game/world.js";

/**
 * Sends full room state to everyone in a room.
 */
function sendFullState(io, room) {
  const roomPlayers = getRoomPlayers(room);
  const players = {};
  const avatars = {};

  for (const [id, p] of Object.entries(roomPlayers)) {
    avatars[id] = p.avatarUrl || null;
    players[id] = world.getRoom(room)[id] || { x: 200, y: 200 };
  }

  // Broadcast a unified snapshot to everyone in the room
  io.to(room).emit("initial_state", { players, avatars });
  console.log(`[STATE BROADCAST] room=${room} players=${Object.keys(players)}`);
}

export async function handleConnection(io, socket) {
  const { token, room = "default-room", avatar = null } = socket.handshake.auth || {};

  const payload = await verifyToken(token);
  if (!payload) {
    socket.emit("auth_failed");
    socket.disconnect(true);
    return;
  }

  const userId = payload.sub;

  addPlayer(room, userId, socket, avatar);
  socket.join(room);

  // Ensure a world position exists for this user
  world.setPosition(room, userId, 200, 200);

  console.log(`[JOIN] user=${userId} socket=${socket.id} room=${room}`);
  console.log(`[ROOM_PLAYERS]`, Object.keys(getRoomPlayers(room)));
  console.log(`[WORLD_PLAYERS]`, Object.keys(world.getRoom(room)));

  // Setup movement and other handlers
  setupHandlers(io, socket, room, userId);

  // Wait for client readiness before sending state. Client will emit 'client_ready'
  socket.on("client_ready", () => {
    console.log(`[CLIENT READY] user=${userId} socket=${socket.id}`);
    // Send full state to entire room (includes the joiner)
    sendFullState(io, room);
  });

  socket.on("disconnect", () => {
    world.removePlayer(room, userId);
    removePlayer(room, userId);
    // Notify others someone left
    io.to(room).emit("player_leave", { userId });
    console.log(`User ${userId} left ${room}`);
  });
}
