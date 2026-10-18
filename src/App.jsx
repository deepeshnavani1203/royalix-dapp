import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useWallet } from "./hooks/useWallet";
import { HomePage } from "./pages/HomePage";
import { MetaMaskDemo } from "./pages/MetaMaskDemo";
import { WalletConnectDemo } from "./pages/WalletConnectDemo";
import { Dashboard } from "./components/Dashboard";
import { VaultDashboard } from "./components/VaultDashboard";
import "./styles/vault.css";

function App() {
  const wallet = useWallet();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/experiment/metamask"
          element={<MetaMaskRoute wallet={wallet} />}
        />
        <Route
          path="/experiment/walletconnect"
          element={<WalletConnectRoute wallet={wallet} />}
        />
        <Route path="/royalix" element={<RoyaliXRoute wallet={wallet} />} />
        <Route path="/vault" element={<VaultRoute wallet={wallet} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function MetaMaskRoute({ wallet }) {
  const navigate = useNavigate();
  return <MetaMaskDemo wallet={wallet} onBack={() => navigate("/")} />;
}

function WalletConnectRoute({ wallet }) {
  const navigate = useNavigate();
  return <WalletConnectDemo wallet={wallet} onBack={() => navigate("/")} />;
}

function RoyaliXRoute({ wallet }) {
  const navigate = useNavigate();
  const isMetaMaskSession = wallet.walletType === "metamask";

  if (wallet.connected && wallet.address && isMetaMaskSession) {
    return (
      <Dashboard
        wallet={wallet}
        onDisconnect={wallet.disconnect}
        onBack={() => navigate("/")}
      />
    );
  }

  return (
    <RoyaliXConnectGate
      wallet={wallet}
      onBack={() => navigate("/")}
      isWalletConnectSession={wallet.walletType === "walletconnect"}
    />
  );
}

function VaultRoute({ wallet }) {
  const navigate = useNavigate();
  if (wallet.connected && wallet.address && wallet.isSepolia) {
    return (
      <VaultDashboard
        wallet={wallet}
        onDisconnect={wallet.disconnect}
        onBack={() => navigate("/")}
      />
    );
  }

  return (
    <RoyaliXConnectGate
      wallet={wallet}
      onBack={() => navigate("/")}
      isWalletConnectSession={wallet.walletType === "walletconnect"}
      title="Connect MetaMask to Continue"
      description="The ERC-4626 vault practical requires MetaMask connected to Sepolia."
    />
  );
}

function RoyaliXConnectGate({
  wallet,
  onBack,
  isWalletConnectSession,
  title = "Connect MetaMask to RoyaliX",
  description = "Connect your browser wallet on Sepolia to read the live RoyaliX contract and manage royalty agreements.",
}) {
  const { connectMM, disconnect, loading, error, isMetaMaskAvailable } = wallet;

  return (
    <div className="vault-app">
      <header className="vault-header">
        <button className="back-link" onClick={onBack}>
          ← Home
        </button>
        <div className="vault-logo">
          <div className="vault-logo-badge">R</div>
          RoyaliX
        </div>
        <div className="vault-network-pill">
          <span className="vault-network-dot" />
          Sepolia · 11155111
        </div>
      </header>

      <main className="connect-gate">
        <div className="connect-gate-card">
          <span className="eyebrow">ROYALIX · SEPOLIA</span>
          <h1>{isWalletConnectSession ? "Switch to MetaMask" : title}</h1>
          <p>
            {isWalletConnectSession
              ? "WalletConnect remains available for Experiment 02. The main RoyaliX platform uses MetaMask separately."
              : description}
          </p>
          {error && <div className="message error">{error}</div>}
          {!isMetaMaskAvailable && (
            <div className="message error">
              MetaMask extension not detected. Install or enable MetaMask in
              this browser, then refresh the page.
            </div>
          )}
          <div className="connect-gate-actions">
            {isWalletConnectSession && (
              <button
                className="btn btn-secondary"
                onClick={disconnect}
                disabled={loading}
              >
                Disconnect WalletConnect
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={connectMM}
              disabled={loading || !isMetaMaskAvailable}
            >
              {loading ? "Connecting…" : "Connect MetaMask"}
            </button>
          </div>
          <div className="gate-network-note">
            Network required: Sepolia, chain ID 11155111
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
