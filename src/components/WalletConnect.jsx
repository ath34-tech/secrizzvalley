// src/components/WalletConnect.jsx
import { useState } from 'react'

export default function WalletConnect() {
  const [address, setAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      
      if (!window.ethereum) {
        alert("❌ MetaMask not installed!\n\nDownload: https://metamask.io")
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        console.log("✅ Connected:", accounts[0])
        localStorage.setItem('walletAddress', accounts[0])
      }

    } catch (error) {
      console.error("Connection error:", error)
      alert("❌ Connection failed: " + error.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    localStorage.removeItem('walletAddress')
  }

  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      {address ? (
        <button 
          onClick={disconnectWallet}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          ✅ {address.slice(0, 6)}...{address.slice(-4)} | Disconnect
        </button>
      ) : (
        <button 
          onClick={connectWallet}
          disabled={isConnecting}
          style={{
            backgroundColor: "#FF6B35",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: isConnecting ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            opacity: isConnecting ? 0.6 : 1
          }}
        >
          {isConnecting ? "⏳ Connecting..." : "🦊 Connect MetaMask"}
        </button>
      )}
    </div>
  )
}
