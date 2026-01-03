// PhaserGame.js
import Phaser from "phaser";
import GameScene from "./GameScene";

export function startGame(parentId, characterData, socket) {
  const parent = document.getElementById(parentId);
  if (parent) {
    parent.style.width = "100%";
    parent.style.height = "100%";
    parent.style.display = "block";
  } else {
    console.warn("Phaser parent not found:", parentId);
  }

  const config = {
    type: Phaser.AUTO,
    parent: parentId,
    backgroundColor: "#000000",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: { debug: false, gravity: { y: 0 } },
    },
    audio: false,
    scene: [
      class BootScene extends Phaser.Scene {
        constructor() { super({ key: "BootScene" }); }
        init() {
          // attach before GameScene starts
          this.game.characterData = characterData;
          this.game.socket = socket;
        }
        create() {
          this.scene.launch("GameScene");
        }
      },
      GameScene
    ],
  };

  return new Phaser.Game(config);
}
