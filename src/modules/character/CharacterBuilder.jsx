import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";               // ✅ ADD
import WalletConnect from "../../components/WalletConnect";
import { renderCharacter } from "./PhaserGame";
import { config } from "./assetsConfig";
import "./characterBuilder.css";

let game = null;

const BODY_LABELS = {
  body_1: "Body Style 1", body_2: "Body Style 2", body_3: "Body Style 3",
  body_4: "Body Style 4", body_5: "Body Style 5",
};

const HAIR_LABELS = {
  hair_1: "Hair Style 1", hair_2: "Hair Style 2", hair_3: "Hair Style 3",
  hair_4: "Hair Style 4", hair_5: "Hair Style 5",
};

const EYE_LABELS = {
  eye_1: "Eye Style 1", eye_2: "Eye Style 2", eye_3: "Eye Style 3",
  eye_4: "Eye Style 4", eye_5: "Eye Style 5",
};

// ✅ Minimal ABI with only the function you call
const CONTRACT_ABI = [
  "function saveCharacter(string ipfsHash) external"
];

export default function CharacterBuilder() {
  const navigate = useNavigate();
  const [characterName, setCharacterName] = useState("");
  const [selected, setSelected] = useState({
    body: config.body?.[0] || "body_1",
    hair: config.hair?.[0] || "hair_1",
    eyes: config.eyes?.[0] || "eye_1",
    smiles: "smile",
  });

  const [hairColor, setHairColor] = useState("#8B4513");
  const [eyeColor, setEyeColor] = useState("#4A90E2");
  const [randomizing, setRandomizing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Environment variables
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
  const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

  useEffect(() => {
    updatePhaser();
    return () => {
      if (game) game.destroy(true);
    };
  }, []);

  useEffect(() => {
    updatePhaser();
  }, [selected, hairColor, eyeColor]);

  const updatePhaser = () => {
    if (game) game.destroy(true);
    console.log("🎮 Rendering character:", selected);

    const colors = {
      hair: parseInt(hairColor.replace("#", "0x"), 16),
      eyes: parseInt(eyeColor.replace("#", "0x"), 16),
    };

    game = renderCharacter("game-container", selected, colors);
    console.log("✅ Game instance created:", game);
  };

  const handleChange = (key, value) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  const handleRandomize = () => {
    setRandomizing(true);
    setTimeout(() => {
      setSelected({
        body:
          config.body?.[Math.floor(Math.random() * config.body.length)] ||
          "body_1",
        hair:
          config.hair?.[Math.floor(Math.random() * config.hair.length)] ||
          "hair_1",
        eyes:
          config.eyes?.[Math.floor(Math.random() * config.eyes.length)] ||
          "eye_1",
        smiles: "smile",
      });
      setHairColor(
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
      );
      setEyeColor(
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
      );
      setRandomizing(false);
    }, 300);
  };

  // Export JPEG from Phaser
  const exportAsJPEG = () => {
    if (!game) {
      alert("❌ Game not initialized!");
      return;
    }

    const renderer = game.renderer;
    renderer.snapshot((image) => {
      const link = document.createElement("a");
      link.href = image.src;
      link.download = `${characterName || "character"}.jpg`;
      link.click();
      console.log("✅ JPEG exported locally");
    });
  };

  // Get JPEG as Blob for Pinata
  const getJPEGAsBlob = () => {
    return new Promise((resolve, reject) => {
      if (!game) {
        reject(new Error("Game not initialized"));
        return;
      }

      const renderer = game.renderer;
      renderer.snapshot((image) => {
        fetch(image.src)
          .then((res) => res.blob())
          .then((blob) => {
            console.log(
              "✅ JPEG blob created:",
              (blob.size / 1024).toFixed(2),
              "KB"
            );
            resolve(blob);
          })
          .catch(reject);
      });
    });
  };

  // Upload to Pinata IPFS
  const pinToIPFS = async (jpegBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", jpegBlob, `${characterName}.jpg`);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Pinata error: ${res.statusText}`);
      }

      const { IpfsHash } = await res.json();
      const ipfsUrl = `ipfs://${IpfsHash}`;
      console.log("✅ Pinned to IPFS:", ipfsUrl);
      return ipfsUrl;
    } catch (error) {
      console.error("❌ IPFS error:", error);
      throw error;
    }
  };

  // Encode contract call with ethers.js
  const encodeSmartContractCall = (ipfsHash) => {
    try {
      const iface = new ethers.Interface(CONTRACT_ABI);
      const encoded = iface.encodeFunctionData("saveCharacter", [ipfsHash]);
      console.log("✅ Encoded with ethers.js:", encoded);
      return encoded;
    } catch (error) {
      console.error("❌ Encoding error:", error);
      throw new Error("Failed to encode contract call: " + error.message);
    }
  };

  // Save to blockchain via MetaMask (Sepolia)
  const saveToBlockchain = async (userAddress, ipfsHash) => {
    try {
      console.log("⛓️ Saving to Ethereum Sepolia blockchain...");

      if (!CONTRACT_ADDRESS) {
        throw new Error("Contract address not configured!");
      }

      // Ensure network is Sepolia (0xaa36a7)
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      console.log("📍 Current chain ID:", chainId);
   if (chainId !== "0xaa36a7") {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    });
  } catch (switchError) {
    // If chain doesn't exist — request to add Sepolia
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0xaa36a7",
          chainName: "Ethereum Sepolia",
          nativeCurrency: {
            name: "SepoliaETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.sepolia.org/"],
          blockExplorerUrls: ["https://sepolia.etherscan.io/"],
        }],
      });
    } else {
      throw switchError;
    }
  }
}

      // Encode function call
      const data = encodeSmartContractCall(ipfsHash);

      // Optional gas estimate
      let gasLimit = "0x50000";
      try {
        const gasEstimate = await window.ethereum.request({
          method: "eth_estimateGas",
          params: [
            {
              from: userAddress,
              to: CONTRACT_ADDRESS,
              data,
            },
          ],
        });
        gasLimit =
          "0x" + Math.ceil(parseInt(gasEstimate, 16) * 1.2).toString(16);
        console.log("✅ Gas estimate:", gasEstimate);
      } catch (e) {
        console.warn("⚠️ Gas estimate failed, using default 0x50000");
      }

      // Send transaction
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: userAddress,
            to: CONTRACT_ADDRESS,
            value: "0x0",
            data,
            gas: gasLimit,
          },
        ],
      });

      console.log("✅ Transaction sent:", txHash);

      // Wait for confirmation (optional but nice UX)
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log("⏳ Waiting for confirmation...");
        const receipt = await provider.waitForTransaction(txHash, 1, 120000);
        if (receipt && receipt.status === 1) {
          console.log("✅ Transaction confirmed:", receipt.transactionHash);
        } else if (receipt && receipt.status === 0) {
          throw new Error("Transaction reverted on chain");
        }
      } catch (waitError) {
        console.warn(
          "⚠️ Confirmation timed out (tx may still succeed):",
          waitError.message
        );
      }

      return txHash;
    } catch (error) {
      console.error("❌ Blockchain error:", error);
      throw error;
    }
  };

  // Main save function
  const handleSave = async () => {
    if (!characterName.trim()) {
      alert("Please enter a character name!");
      return;
    }

    try {
      setSaving(true);

      // 1. Check MetaMask
      if (!window.ethereum) {
        alert("❌ MetaMask not detected!\n\nClick 'Connect MetaMask' first");
        return;
      }

      // 2. Get connected account
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length === 0) {
        alert("❌ Wallet not connected!\n\nClick 'Connect MetaMask' button");
        return;
      }

      const userAddress = accounts[0];
      console.log("🔐 Using wallet:", userAddress);

      // 3. Export JPEG
      console.log("📸 Exporting JPEG...");
      const jpegBlob = await getJPEGAsBlob();

      // 4. Pin to IPFS
      console.log("📌 Uploading to Pinata IPFS...");
      const ipfsHash = await pinToIPFS(jpegBlob);

      // 5. Save to blockchain
      const txHash = await saveToBlockchain(userAddress, ipfsHash);

      // 6. Store locally
      localStorage.setItem(
        "characterData",
        JSON.stringify({
          characterName,
          selected,
          hairColor,
          eyeColor,
          ipfsHash,
          address: userAddress,
          transactionHash: txHash,
          savedAt: new Date().toISOString(),
        })
      );

      alert(
        `🎉 ${characterName} saved!\n\n📍 IPFS: ${ipfsHash}\n\n⛓️ Tx: ${txHash}\n\n✅ Saved to blockchain!`
      );

      navigate("/game");
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Failed to save: " + (error.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const debugPhaser = () => {
    if (game) {
      console.log("✅ Phaser game exists");
      console.log("Canvas:", game.canvas);
      alert(
        "✅ Phaser game running!\n\nCanvas: " +
          game.canvas.width +
          "x" +
          game.canvas.height
      );
    } else {
      alert("❌ Game not initialized!");
    }
  };

  return (
    <div className="builder-root">
      <div className="builder-bg-overlay" />

      <div className="builder-container">
        <div className="builder-header">
          <h1 className="builder-title">Create Your Character</h1>
          <p className="builder-subtitle">
            Customize your avatar to explore Secrizz Valley
          </p>
          <WalletConnect />
        </div>

        <div className="builder-layout">
          <div className="builder-preview-section">
            <div className="builder-preview-box">
              <div id="game-container" className="game-canvas" />
              <div className="preview-glow" />
            </div>

            <div className="builder-randomize">
              <button
                className="randomize-btn"
                onClick={handleRandomize}
                disabled={randomizing}
              >
                {randomizing ? "✨ Randomizing..." : "🎲 Randomize"}
              </button>

              <button
                onClick={debugPhaser}
                style={{
                  marginTop: "8px",
                  padding: "6px 10px",
                  fontSize: "10px",
                  width: "100%",
                }}
              >
                🔍 Debug
              </button>

              <button
                onClick={exportAsJPEG}
                disabled={!characterName.trim()}
                style={{
                  marginTop: "8px",
                  padding: "8px 12px",
                  backgroundColor: "#FFA500",
                  color: "#fff",
                  width: "100%",
                }}
              >
                📥 Download JPEG (Test)
              </button>
            </div>
          </div>

          <div className="builder-controls-section">
            <div className="control-group">
              <label className="control-label">Character Name</label>
              <input
                type="text"
                className="control-input"
                placeholder="Enter your name..."
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                maxLength={20}
              />
              <span className="char-count">{characterName.length}/20</span>
            </div>

            <div className="control-group">
              <label className="control-label">Body Type</label>
              <select
                className="control-select"
                value={selected.body}
                onChange={(e) => handleChange("body", e.target.value)}
              >
                {config.body?.map((bodyType) => (
                  <option key={bodyType} value={bodyType}>
                    {BODY_LABELS[bodyType] || bodyType}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">Hair Style</label>
              <select
                className="control-select"
                value={selected.hair}
                onChange={(e) => handleChange("hair", e.target.value)}
              >
                {config.hair?.map((hairType) => (
                  <option key={hairType} value={hairType}>
                    {HAIR_LABELS[hairType] || hairType}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">Eye Style</label>
              <select
                className="control-select"
                value={selected.eyes}
                onChange={(e) => handleChange("eyes", e.target.value)}
              >
                {config.eyes?.map((eyeType) => (
                  <option key={eyeType} value={eyeType}>
                    {EYE_LABELS[eyeType] || eyeType}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">Hair Color</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  className="control-color-picker"
                  value={hairColor}
                  onChange={(e) => setHairColor(e.target.value)}
                />
                <span className="color-hex">{hairColor}</span>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Eye Color</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  className="control-color-picker"
                  value={eyeColor}
                  onChange={(e) => setEyeColor(e.target.value)}
                />
                <span className="color-hex">{eyeColor}</span>
              </div>
            </div>

            <div className="builder-actions">
              <button
                className="builder-save-btn"
                onClick={handleSave}
                disabled={!characterName.trim() || saving}
              >
                {saving
                  ? "⏳ Saving to Blockchain..."
                  : `✨ Save ${characterName || "..."} (IPFS + Blockchain)`}
              </button>
              <button
                className="builder-back-btn"
                onClick={() => navigate("/intro/entry")}
                disabled={saving}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
