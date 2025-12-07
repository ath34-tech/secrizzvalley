// src/modules/game/PhaserGame.js
import Phaser from "phaser";
import GameScene from "./GameScene";

export function startGame(parentId, characterData) {
  const config = {
    type: Phaser.AUTO,
    parent: parentId,
    backgroundColor: "#000000",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: "100%",
      height: "100%",
    },
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    scene: [GameScene],
  };

  const game = new Phaser.Game(config);
  // Attach data so the scene can read it in init()
  game.characterData = characterData;
  return game;
}
