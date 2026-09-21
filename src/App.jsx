import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { HomePage } from "./pages/HomePage";
import { MetaMaskDemo } from "./pages/MetaMaskDemo";
import { WalletConnectDemo } from "./pages/WalletConnectDemo";
import { VaultDashboard } from "./components/VaultDashboard";
import "./styles/vault.css";

// Views: 'home' | 'metamask' | 'walletconnect' | 'vault'
function App() {
  const wallet = useWallet();
  const [view, setView] = useState("home");

  const goHome = () => {
    if (wallet.connected) wallet.disconnect();
    setView("home");
  };

  if (view === "home") {
    return <HomePage onSelect={setView} />;
  }

  if (view === "metamask") {
    return <MetaMaskDemo wallet={wallet} onBack={goHome} />;
  }

  if (view === "walletconnect") {
    return <WalletConnectDemo wallet={wallet} onBack={goHome} />;
  }

  if (view === "vault") {
    if (wallet.connected && wallet.address) {
      return (
        <VaultDashboard
          wallet={wallet}
          onDisconnect={wallet.disconnect}
          onBack={goHome}
        />
      );
    }
    return <VaultConnectGate wallet={wallet} onBack={goHome} />;
  }

  return null;
}

/* ── Vault connect gate ──────────────────────────────── */
const VaultConnectGate = ({ wallet, onBack }) => {
  const { connectMM, loading, error, isMetaMaskAvailable } = wallet;

  return (
    <div
      className="vault-app"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header className="vault-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={backBtn}>
            ← Back
          </button>
          <div className="vault-logo">
            <div className="vault-logo-badge">R</div>
            RoyaliX
            <span
              style={{
                color: "#3f3f46",
                fontWeight: 400,
                fontSize: 13,
                marginLeft: 4,
              }}
            >
              / ERC-4626
            </span>
          </div>
        </div>
        <div className="vault-header-center">
          <div className="vault-network-pill">
            <span className="vault-network-dot" />
            Ethereum Sepolia
          </div>
        </div>
        <div />
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "min(460px, 90%)", textAlign: "center" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(99,91,255,.08)",
              border: "1px solid rgba(99,91,255,.18)",
              display: "grid",
              placeItems: "center",
              fontSize: 22,
              margin: "0 auto 20px",
            }}
          >
            V
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              margin: "0 0 10px",
              color: "#f4f4f5",
            }}
          >
            Connect Wallet to Continue
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#71717a",
              lineHeight: 1.7,
              margin: "0 0 28px",
            }}
          >
            Experiment 03 requires MetaMask connected to Sepolia to interact
            with the deployed MockUSDC and vault contracts.
          </p>

          {error && (
            <div
              className="alert alert-error"
              style={{ marginBottom: 16, textAlign: "left" }}
            >
              <span className="alert-icon" style={{ fontSize: 12 }}>
                !
              </span>
              <span>{error}</span>
            </div>
          )}
          {!isMetaMaskAvailable && (
            <div
              className="alert alert-info"
              style={{ marginBottom: 16, textAlign: "left" }}
            >
              <span className="alert-icon" style={{ fontSize: 12 }}>
                i
              </span>
              <span>
                MetaMask not found.{" "}
                <a
                  href="https://metamask.io/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#93c5fd" }}
                >
                  Install from metamask.io
                </a>
              </span>
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ maxWidth: 280, margin: "0 auto" }}
            onClick={connectMM}
            disabled={loading || !isMetaMaskAvailable}
          >
            {loading ? (
              <>
                <span
                  className="spinner"
                  style={{ borderTopColor: "#0b0b0d" }}
                />{" "}
                Connecting…
              </>
            ) : (
              "Connect MetaMask"
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

const backBtn = {
  background: "transparent",
  border: "1px solid #27272a",
  borderRadius: 7,
  padding: "6px 12px",
  color: "#71717a",
  fontSize: 12,
  cursor: "pointer",
};

export default App;
