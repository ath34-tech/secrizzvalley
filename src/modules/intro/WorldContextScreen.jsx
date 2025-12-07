import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import townBg from "../../assets/ui/valley_town.png";
import guideIdle from "../../assets/characters/guide_idle.png";
import "./introScene.css";
// import cropIcon from "../../assets/ui/crop.png";
// import petIcon from "../../assets/ui/pet.png";
// import tradeIcon from "../../assets/ui/trade.png";
import tradeIcon from "../../assets/images/house_icon.png";
import cropIcon from "../../assets/images/crop.png";
import petIcon from "../../assets/images/paw_icon.png";

const DIALOGUE = [
  "This place looks peaceful, right? Don't let it fool you.",
  "You'll cultivate crops and tend to fields — the valley's lifeblood.",
  "You'll raise and train adorable pets to keep as companions or sell for coin.",
  "You'll trade with neighbors, buy and sell goods, and build a thriving economy.",
  "How you shape this valley is up to you — but you won't be doing it alone."
];

export default function WorldContextScreen() {
  const navigate = useNavigate();
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

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
      navigate("/intro/entry");
    }
  }, [isTyping, visibleText, lineIndex, navigate]);

  return (
    <div className="scene-root" onClick={handleAdvance}>
      <div
        className="scene-bg"
        style={{ backgroundImage: `url(${townBg})` }}
      >
        {/* Big centered icon based on line index */}
    {lineIndex === 1 && (
          <div className="scene-feature-icon scene-feature-icon-crops">
            <img src={cropIcon} alt="Crops" />
          </div>
        )}
        {lineIndex === 2 && (
          <div className="scene-feature-icon scene-feature-icon-pets">
            <img src={petIcon} alt="Pets" />
          </div>
        )}
        {lineIndex === 3 && (
          <div className="scene-feature-icon scene-feature-icon-trade">
            <img src={tradeIcon} alt="Trade" />
          </div>
        )}

        <img src={guideIdle} alt="Guide" className="scene-character" />

        <div
          className="scene-dialogue"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="scene-name-tag">Guide:</div>
          <p className="scene-text">
            {visibleText}
            {isTyping && <span className="scene-cursor">▋</span>}
          </p>

          {/* Controls */}
          <div className="scene-controls">
            <button
              type="button"
              className="scene-btn"
              onClick={handleAdvance}
            >
              {lineIndex < DIALOGUE.length - 1 ? "Next" : "Continue"}
            </button>
            <button
              type="button"
              className="scene-btn scene-btn-secondary"
              onClick={() => navigate("/intro/entry")}
            >
              Skip
            </button>
          </div>

          <div className="scene-hint">Click anywhere to advance</div>
        </div>
      </div>
    </div>
  );
}
