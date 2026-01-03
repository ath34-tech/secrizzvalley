// rooms.js
const ROOMS = {}; // { roomId: { userId: { socketId, avatarUrl } } }

export function addPlayer(room, userId, socket, avatarUrl = null) {
  ROOMS[room] ||= {};
  ROOMS[room][userId] = {
    socketId: socket.id,
    avatarUrl: avatarUrl,
  };
}

export function removePlayer(room, userId) {
  if (!ROOMS[room]) return;
  delete ROOMS[room][userId];
}

export function getRoomPlayers(room) {
  return ROOMS[room] || {};
}
