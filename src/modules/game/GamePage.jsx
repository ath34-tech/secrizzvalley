// src/modules/game/GamePage.jsx
import React, { useEffect, useState } from "react";
import { startGame } from "./PhaserGame";
import "./game.css";

let game = null;

export default function GamePage() {
  const [characterData, setCharacterData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("characterData");
    if (saved) {
      setCharacterData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!characterData) return;

    game = startGame("phaser-game-container", characterData);

    return () => {
      if (game) {
        game.destroy(true);
        game = null;
      }
    };
  }, [characterData]);

  return (
    <div className="game-root">
      <div className="game-title">Secrizz Valley</div>

      <div className="game-wrapper">
        <div id="phaser-game-container" />
      </div>
    </div>
  );
}
