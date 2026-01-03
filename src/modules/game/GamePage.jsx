// GamePage.jsx
import React, { useEffect, useState } from "react";
import { startGame } from "./PhaserGame";
import { supabase } from "../../utils/supabaseClient";
import { io } from "socket.io-client";
import "./game.css";

let game = null;

export default function GamePage() {
  const [characterData, setCharacterData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("characterData");
    if (!saved) return;
    const stored = JSON.parse(saved);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.access_token) return;
      const token = session.access_token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;
      const updated = { ...stored, token, userId };
      localStorage.setItem("characterData", JSON.stringify(updated));
      setCharacterData(updated);
    });
  }, []);

  useEffect(() => {
    if (!characterData) return;

    const socket = io("http://localhost:8000", {
      auth: {
        token: characterData.token,
        room: "valley-1",
        avatar: characterData.ipfsHash
          ? `https://gateway.pinata.cloud/ipfs/${characterData.ipfsHash.replace("ipfs://", "")}`
          : null,
      },
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect_error", (err) => console.error("Socket error", err));
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED", socket.id);

      // Start Phaser AFTER socket connected; Phaser's BootScene will attach socket
      if (!game) {
        game = startGame("phaser-game-container", characterData, socket);
        // expose for debugging
        window.__GAME__ = game;
      }
    });

    return () => {
      try { socket.disconnect(); } catch (e) {}
      if (game) {
        game.destroy(true);
        game = null;
        window.__GAME__ = null;
      }
    };
  }, [characterData]);

  return (
    <div className="game-root" style={{ width: "100%", height: "100vh" }}>
      <div className="game-title">Secrizz Valley</div>
      <div className="game-wrapper" style={{ width: "100%", height: "100%" }}>
        <div id="phaser-game-container" style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
