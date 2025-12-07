import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import valleyBg from "../../assets/ui/valley_intro.png";
import guideIdle from "../../assets/characters/guide_idle.png";
import "./introScene.css";

const DIALOGUE = [
  "…Hey. Can you hear me?",
  "Welcome to Secrizz Valley — a quiet place with a not-so-quiet future.",
  "The fields, the pets, the people here… they’re all waiting for someone to lead them.",
  "Take a breath. From this moment on, the valley’s story is tied to yours."
];

export default function GameIntroScreen() {
  const navigate = useNavigate();
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect for current line
  useEffect(() => {
    const fullText = DIALOGUE[lineIndex];
    setVisibleText("");
    setIsTyping(true);

    let i = 0;
    const speed = 22; // ms per character

    const id = setInterval(() => {
      i += 1;
      setVisibleText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(id);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(id);
  }, [lineIndex]);

  const handleAdvance = useCallback(() => {
    const fullText = DIALOGUE[lineIndex];

    // If still typing, finish instantly
    if (isTyping && visibleText !== fullText) {
      setVisibleText(fullText);
      setIsTyping(false);
      return;
    }

    // Move to next line or next scene
    if (lineIndex < DIALOGUE.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else {
      navigate("/intro/world");
    }
  }, [isTyping, visibleText, lineIndex, navigate]);

  return (
    <div className="scene-root" onClick={handleAdvance}>
      <div
        className="scene-bg"
        style={{ backgroundImage: `url(${valleyBg})` }}
      >
        <img src={guideIdle} alt="Guide" className="scene-character" />

        <div
          className="scene-dialogue"
          onClick={(e) => e.stopPropagation()} // so buttons can be clicked without double-advancing
        >
          <div className="scene-name-tag">???:</div>
          <p className="scene-text">
            {visibleText}
            {isTyping && <span className="scene-cursor">▋</span>}
          </p>

          <div className="scene-controls">
            <button
              type="button"
              className="scene-btn"
              onClick={handleAdvance}
            >
              {lineIndex < DIALOGUE.length - 1 ? "Click to continue" : "Enter the valley"}
            </button>
            <button
              type="button"
              className="scene-btn scene-btn-secondary"
              onClick={() => navigate("/intro/entry")}
            >
              Skip intro
            </button>
          </div>

          <div className="scene-hint">Click anywhere to advance</div>
        </div>
      </div>
    </div>
  );
}
