import React from "react";
import { useNavigate } from "react-router-dom";
import entrybg from "../../assets/ui/entry_bg.png";
import "./entryChoice.css";

export default function CharacterEntryChoiceScreen() {
  const navigate = useNavigate();

  const handleCustom = () => {
    // Go to builder with flag that user wants to customize
    navigate("/character", { state: { mode: "custom" } });
  };

  const handleQuickStart = () => {
    // Go to builder with randomized options
    navigate("/character", { state: { mode: "quickstart" } });
  };

  return (
    <div className="entry-root">
      <div
        className="entry-bg"
        style={{ backgroundImage: `url(${entrybg})` }}
      >
        <div className="entry-container">
          <div className="entry-header">
            <h1 className="entry-title">Who Are You?</h1>
            <p className="entry-subtitle">Choose how you enter Secrizz Valley</p>
          </div>

          <div className="entry-choices">
            {/* Choice 1: Custom Character */}
            <div
              className="entry-choice-card"
              onClick={handleCustom}
            >
              <div className="choice-icon">✨</div>
              <h2 className="choice-title">Design Your Own</h2>
              <p className="choice-desc">
                Customize every detail of your unique chibi character. Pick your
                hair, colors, outfit, and more.
              </p>
              <div className="choice-arrow">→</div>
            </div>

            {/* Choice 2: Quick Start */}
            <div
              className="entry-choice-card"
              onClick={handleQuickStart}
            >
              <div className="choice-icon">⚡</div>
              <h2 className="choice-title">Quick Start</h2>
              <p className="choice-desc">
                Jump right in with a random character. You can always
                customize later.
              </p>
              <div className="choice-arrow">→</div>
            </div>
          </div>

          <div className="entry-footer">
            <button
              className="entry-back-btn"
              onClick={() => window.history.back()}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
