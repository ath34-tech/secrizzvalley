import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import "./character.css";

// import char1 from "../../assets/characters/char1.png";
// import char2 from "../../assets/characters/char2.png";
// import char3 from "../../assets/characters/char3.png";
// import char4 from "../../assets/characters/char4.png";
// import char5 from "../../assets/characters/char5.png";
// import char6 from "../../assets/characters/char6.png";
// import char7 from "../../assets/characters/char7.png";
// import char8 from "../../assets/characters/char8.png";
// import char9 from "../../assets/characters/char9.png";

// const characters = [
//   { id: 1, src: char1, name: "Character 1" },
//   { id: 2, src: char2, name: "Character 2" },
//   { id: 3, src: char3, name: "Character 3" },
//   { id: 4, src: char4, name: "Character 4" },
//   { id: 5, src: char5, name: "Character 5" },
//   { id: 6, src: char6, name: "Character 6" },
//   { id: 7, src: char7, name: "Character 7" },
//   { id: 8, src: char8, name: "Character 8" },
//   { id: 9, src: char9, name: "Character 9" },
// ];

export default function CharacterGridScreen() {
  const [selectedChar, setSelectedChar] = useState(null);
  const navigate = useNavigate();

  const handleSelectChar = (charId) => {
    setSelectedChar(charId);
  };

  const handleContinue = () => {
    if (selectedChar) {
      navigate("/character", { state: { selectedCharId: selectedChar } });
    }
  };

  return (
    <div className="char-grid-root">
      <div className="char-grid-container">
        <div className="char-grid-header">
          <h1 className="char-grid-title">Pick Your Base Look</h1>
          <p className="char-grid-subtitle">
            Choose a character preset to customize
          </p>
        </div>

        <div className="character-grid">
          {characters.map((char) => (
            <div
              key={char.id}
              className={`character-cell ${selectedChar === char.id ? "active" : ""}`}
              onClick={() => handleSelectChar(char.id)}
            >
              <img
                src={char.src}
                alt={char.name}
                className="character-img"
              />
              {selectedChar === char.id && (
                <div className="selection-badge">✓</div>
              )}
            </div>
          ))}
        </div>

        <div className="char-grid-actions">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedChar}
            className="char-grid-btn"
          >
            Continue to Customize
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate("/intro/entry")}
            className="char-grid-btn"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
