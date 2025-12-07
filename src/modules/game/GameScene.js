// src/modules/game/GameScene.js
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init() {
    // Read character data attached to game
    this.characterData = this.game.characterData || null;
    console.log("Character data:", this.characterData);
  }

  preload() {
    this.load.image("map", "assets/tilesets/map.png");
    this.load.tilemapTiledJSON("valleyMap", "assets/maps/map_2.json");

    // If we have an IPFS hash, load avatar image via HTTP gateway
    if (this.characterData?.ipfsHash) {
      const cid = this.characterData.ipfsHash.replace("ipfs://", "");
      // choose your gateway; example uses Pinata public gateway [web:70][web:73]
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      this.load.image("avatar", url);
    }
  }

  create() {
    const map = this.make.tilemap({ key: "valleyMap" });
    console.log("Tilesets:", map.tilesets.map((ts) => ts.name));

    const ts1 = map.addTilesetImage("map_1", "map");
    map.createLayer("Tile Layer 1", [ts1], 0, 0);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(
      map.widthInPixels / 2,
      map.heightInPixels / 2
    );

    // Draw avatar in UI corner if loaded
    if (this.textures.exists("avatar")) {
      const avatar = this.add.image(80, 80, "avatar");
      avatar.setScrollFactor(0); // UI, not moving with camera
      const scale =
        64 / Math.max(avatar.width, avatar.height); // fit in 64x64 box
      avatar.setScale(scale);
      avatar.setStrokeStyle?.(2, 0xffffff);
    }
  }
}
