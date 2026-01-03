// world.js
class World {
  constructor() {
    this.rooms = {}; // rooms[roomId][userId] = { x, y, ts }
  }

  setPosition(room, userId, x, y) {
    this.rooms[room] ||= {};
    this.rooms[room][userId] = { x, y, ts: Date.now() };
  }

  removePlayer(room, userId) {
    if (this.rooms[room]) delete this.rooms[room][userId];
  }

  getRoom(room) {
    return this.rooms[room] || {};
  }
}

export default new World();
