import React from "react";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import "./landing.css";
import pixelHouse from "../../assets/images/house_icon.png";
import pixelWheat from "../../assets/images/crop.png";
import pixelPaw from "../../assets/images/paw_icon.png";
import gamePreview from "../../assets/images/game_back.png";
import char1 from "../../assets/images/grid/g1.png";
import char2 from "../../assets/images/grid/g2.png";
import char3 from "../../assets/images/grid/g3.png";
import char4 from "../../assets/images/grid/g4.png";
import char5 from "../../assets/images/grid/g5.png";
import char6 from "../../assets/images/grid/g6.png";
import char7 from "../../assets/images/grid/g7.png";
import char8 from "../../assets/images/grid/g8.png";
import char9 from "../../assets/images/grid/g9.png";

const characters = [char1, char2, char3, char4, char5, char6, char7, char8, char9];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="hero-colored">Secrizz Valley</span>
            </h1>
            <p className="hero-subtitle">
              A cozy pixel-art multiplayer life sim where you build, farm, collect, and battle
            </p>
            <div className="hero-cta">
              <Button to="/register" variant="primary" size="lg">
                Start Your Adventure
              </Button>
              <Button to="/login" variant="secondary" size="lg">
                Login
              </Button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-pixel-art">
              <img src={pixelHouse} alt="House" className="pixel-item" />
              <img src={pixelWheat} alt="Wheat" className="pixel-item" />
              <img src={pixelPaw} alt="Pet" className="pixel-item" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        
        <div className="features-container">
          <h2 className="section-title">Game Features</h2>
          <p className="section-subtitle">What you can do in Secrizz Valley</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-landing">🏠</div>
              <h3 className="feature-title">Build & Customize</h3>
              <p className="feature-desc">
                Design your dream home with unique decorations and upgrades
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-landing">🌾</div>
              <h3 className="feature-title">Farm & Garden</h3>
              <p className="feature-desc">
                Plant crops, tend your garden, and harvest seasonal produce
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-landing">🐾</div>
              <h3 className="feature-title">Collect Pets</h3>
              <p className="feature-desc">
                Discover and train adorable pets with unique abilities
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-landing">⚔️</div>
              <h3 className="feature-title">Battle Others</h3>
              <p className="feature-desc">
                Challenge other villagers and become the champion of the valley
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-landing">🎨</div>
              <h3 className="feature-title">Customize Character</h3>
              <p className="feature-desc">
                Create your unique chibi character with countless customization options
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-landing">💎</div>
              <h3 className="feature-title">Web3 Integration</h3>
              <p className="feature-desc">
                Own NFT pets, houses, and tools on the blockchain (coming soon)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="how-container">
          <h2 className="section-title">How to Play</h2>
          <p className="section-subtitle">Get started in 3 simple steps</p>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Your Character</h3>
              <p>
                Customize your chibi character with different body types, hair styles, and
                colors
              </p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Build Your Home</h3>
              <p>
                Establish your farm in Secrizz Valley and start growing crops and collecting
                items
              </p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Connect & Compete</h3>
              <p>
                Meet other players, trade items, team up on challenges, and battle for
                supremacy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Preview Section */}
      <section className="preview" id="about">
        <div className="preview-container">
          <h2 className="section-title">Game Preview</h2>

          <div className="preview-content">
            <div className="preview-image">
              <div className="preview-placeholder">
                <div className="preview-grid">
                  {characters.map((src, index) => (
                    <div className="grid-cell" key={index}>
                      <img
                        src={src}
                        alt={`Character ${index + 1}`}
                        className="grid-cell-img"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="preview-text">
              <h3 className="preview-title">Experience Cozy Gameplay</h3>
              <p>
                Secrizz Valley is designed for relaxation and fun. Take your time tending to
                your farm, interact with friendly NPCs, and progress at your own pace.
              </p>
              <p>
                Whether you're into peaceful farming or competitive battles, there's something
                for everyone in our valley.
              </p>
              <ul className="preview-list">
                <li>✓ Pixel-art aesthetic</li>
                <li>✓ Multiplayer gameplay</li>
                <li>✓ Regular content updates</li>
                <li>✓ Community events</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Begin your adventure in Secrizz Valley today</p>
          <Button to="/register" variant="primary" size="lg">
            Create Account Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Secrizz Valley</h4>
              <p>A cozy multiplayer pixel-art RPG</p>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#community">Community</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Secrizz Valley. All rights reserved. Made with 💚 for pixel art lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
