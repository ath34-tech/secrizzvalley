// GameScene.js
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() { super("GameScene"); }

  init() {
    this.characterData = this.game.characterData || null;
    this.socket = this.game.socket || null;   // MUST exist (BootScene set it)
    this.otherPlayers = {};
    this.lastDustTime = 0;
    this.lastSent = 0;
    this.sendInterval = 100;

    console.log("[Scene init] userId:", this.characterData?.userId, "socket:", !!this.socket);
  }

  preload() {
    this.load.image("map", "assets/tilesets/map.png");
    this.load.tilemapTiledJSON("valleyMap", "assets/maps/map_2_final.json");

    if (this.characterData?.ipfsHash) {
      const cid = this.characterData.ipfsHash.replace("ipfs://", "");
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      this.load.image("avatar", url);
    } else {
      this.load.image("avatar", "assets/avatar_fallback.png");
    }

    this.load.image("avatar_default", "assets/avatar_fallback.png");
    this.load.image("dustSingle", "assets/effects/dust_small.png");
  }

  create() {
    const map = this.make.tilemap({ key: "valleyMap" });
    const ts1 = map.addTilesetImage("map_1", "map");
    map.createLayer("Tile Layer 1", [ts1], 0, 0);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(1);

    // Player avatar (existing behavior)
    if (this.textures.exists("avatar")) {
      const x = map.widthInPixels / 2;
      const y = map.heightInPixels / 2;
      this.avatar = this.physics.add.image(x, y, "avatar").setOrigin(0.5, 1);
      const scale = 64 / Math.max(this.avatar.width, this.avatar.height);
      this.avatar.setScale(scale);
      this.avatar.setCollideWorldBounds(true);
      this.avatar.body.setSize(this.avatar.width * 0.4, this.avatar.height * 0.25);
      this.avatar.body.setOffset(this.avatar.width * 0.3, this.avatar.height * 0.7);
      this.cameras.main.startFollow(this.avatar, true, 0.1, 0.1);
    }

    // Tiled collision objects (untouched)
    const collisionLayer = map.getObjectLayer("collision");
    this._collisionBlocks = [];
    if (collisionLayer) {
      collisionLayer.objects.forEach((obj) => {
        const block = this.physics.add.staticImage(obj.x + obj.width/2, obj.y + obj.height/2);
        block.setSize(obj.width, obj.height).setOrigin(0.5, 0.5).setVisible(false);
        this._collisionBlocks.push(block);
        this.physics.add.collider(this.avatar, block);
      });
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    // Setup socket event handlers (must run before we tell server we're ready)
    if (this.socket) {
      this.setupSocketEvents();

      // Tell server we are ready to receive the full snapshot
      console.log("[CLIENT] emitting client_ready");
      this.socket.emit("client_ready");
    } else {
      console.warn("No socket available in GameScene.init()");
    }

    this.playersGroup = this.physics.add.group();
    if (this.avatar) this.playersGroup.add(this.avatar);
  }

  setupSocketEvents() {
    const socket = this.socket;

    socket.on("initial_state", ({ players, avatars }) => {
      console.log("[CLIENT] initial_state received", { me: this.characterData?.userId, players, avatars });
      Object.entries(players || {}).forEach(([id, pos]) => {
        if (id === this.characterData.userId) return;
        const avatarUrl = avatars?.[id] || null;
        this.spawnOtherPlayer(id, pos.x ?? this.avatar.x + 30, pos.y ?? this.avatar.y, avatarUrl);
      });
    });

    socket.on("pos", (data) => {
      // data: { userId, x, y }
      const { userId, x, y } = data;
      if (userId === this.characterData.userId) return;
      const other = this.otherPlayers[userId];
      if (!other) {
        // spawn placeholder if never created
        this.spawnOtherPlayer(userId, x, y, null);
        return;
      }
      // update target; interpolation in update() moves sprite
      other.target = { x, y };
    });

    socket.on("avatar_update", ({ userId, avatar }) => {
      const other = this.otherPlayers[userId];
      if (!other) return;
      const key = `avatar_${userId}`;
      if (!this.textures.exists(key)) {
        this.load.image(key, avatar);
        this.load.once("complete", () => other.sprite.setTexture(key));
        this.load.start();
      } else {
        other.sprite.setTexture(key);
      }
    });

    socket.on("player_leave", ({ userId }) => {
      const other = this.otherPlayers[userId];
      if (other) {
        other.sprite.destroy();
        delete this.otherPlayers[userId];
      }
    });
  }

  spawnOtherPlayer(userId, x, y, avatarUrl = null) {
    if (this.otherPlayers[userId]) {
      this.otherPlayers[userId].target = { x, y };
      return;
    }

    const key = avatarUrl ? `avatar_${userId}` : "avatar_default";

    if (avatarUrl && !this.textures.exists(key)) {
      this.load.image(key, avatarUrl);
      this.load.once("complete", () => this._createRemoteSprite(userId, x, y, key));
      this.load.start();
      return;
    }

    this._createRemoteSprite(userId, x, y, key);
  }

  _createRemoteSprite(userId, x, y, key) {
    const sprite = this.physics.add.image(x, y, key).setOrigin(0.5, 1);
    const scale = 64 / Math.max(sprite.width, sprite.height);
    sprite.setScale(scale);
    sprite.body.setSize(sprite.width * 0.4, sprite.height * 0.25);
    sprite.body.setOffset(sprite.width * 0.3, sprite.height * 0.7);

    // collide with map blocks
    (this._collisionBlocks || []).forEach(b => this.physics.add.collider(sprite, b));

    // collide with player too
    if (this.avatar) this.physics.add.collider(this.avatar, sprite);

    // store meta for interpolation + dust
    this.otherPlayers[userId] = {
      sprite,
      target: { x, y },
      prev: { x, y },
      lastDustTime: 0
    };

    this.playersGroup.add(sprite);
  }

  // local dust (unchanged)
  spawnDust() {
    if (!this.avatar) return;
    const x = this.avatar.x + Phaser.Math.Between(-4, 4);
    const y = this.avatar.y + 10;
    const puff = this.add.image(x, y, "dustSingle").setOrigin(0.5,1).setDepth(999);
    puff.setAlpha(1).setScale(0.1);
    this.tweens.add({ targets: puff, scale: 0.35, alpha: 0, y: y-6, duration: 600, ease: "Sine.out", onComplete: ()=>puff.destroy() });
  }

  // dust at arbitrary x,y (for remote players)
  spawnDustAt(x, y) {
    const puff = this.add.image(x + Phaser.Math.Between(-4,4), y, "dustSingle").setOrigin(0.5,1).setDepth(999);
    puff.setAlpha(1).setScale(0.1);
    this.tweens.add({ targets: puff, scale: 0.35, alpha: 0, y: y-6, duration: 600, ease: "Sine.out", onComplete: ()=>puff.destroy() });
  }

  update(time, delta) {
    if (!this.avatar || !this.cursors) return;

    this.avatar.setVelocity(0);
    const speed = 180;
    if (this.cursors.left.isDown) this.avatar.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.avatar.setVelocityX(speed);
    if (this.cursors.up.isDown) this.avatar.setVelocityY(-speed);
    if (this.cursors.down.isDown) this.avatar.setVelocityY(speed);

    const moving = this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;
    if (moving && time - this.lastDustTime > 200) { this.spawnDust(); this.lastDustTime = time; }

    // throttle send
    if (this.socket && time - this.lastSent > this.sendInterval) {
      this.socket.emit("pos", { x: this.avatar.x, y: this.avatar.y, ts: Date.now() });
      this.lastSent = time;
    }

    // interpolate remote players & spawn dust when they move
    Object.values(this.otherPlayers).forEach(obj => {
      const sprite = obj.sprite;
      const target = obj.target;
      if (!target || !sprite) return;

      // save previous position
      const prevX = sprite.x;
      const prevY = sprite.y;

      // interpolate
      sprite.x = Phaser.Math.Linear(sprite.x, target.x, 0.25);
      sprite.y = Phaser.Math.Linear(sprite.y, target.y, 0.25);

      // distance moved this frame (approx)
      const dx = sprite.x - (obj.prev?.x ?? prevX);
      const dy = sprite.y - (obj.prev?.y ?? prevY);
      const moved = Math.hypot(dx, dy);

      // spawn dust if moved enough and not too often
      if (moved > 1 && time - (obj.lastDustTime || 0) > 180) {
        // place dust a little below sprite's origin
        const dustX = sprite.x;
        const dustY = sprite.y + (sprite.displayHeight * 0.1 || 10);
        this.spawnDustAt(dustX, dustY);
        obj.lastDustTime = time;
      }

      // update prev for next frame
      obj.prev.x = sprite.x;
      obj.prev.y = sprite.y;
    });
  }
}
