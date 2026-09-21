import { useState } from "react";
import "../styles/vault.css";

const short = (a) => (a ? `${a.slice(0, 8)}…${a.slice(-6)}` : "—");

export const MetaMaskDemo = ({ wallet, onBack }) => {
  const {
    connectMM,
    disconnect,
    connected,
    address,
    network,
    chainId,
    isSepolia,
    loading,
    error,
    isMetaMaskAvailable,
  } = wallet;
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="vault-app"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* ── Header ── */}
      <header className="vault-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={backBtnStyle}>
            ← Back
          </button>
          <div className="vault-logo">
            <div
              className="vault-logo-badge"
              style={{
                background: "rgba(224,123,57,.12)",
                color: "#e07b39",
                border: "1px solid rgba(224,123,57,.25)",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              M
            </div>
            RoyaliX
            <span
              style={{
                color: "#3f3f46",
                fontWeight: 400,
                fontSize: 13,
                marginLeft: 4,
              }}
            >
              / MetaMask
            </span>
          </div>
        </div>

        <div className="vault-header-center">
          <div className="vault-network-pill">
            <span className={`vault-network-dot${isSepolia ? "" : " wrong"}`} />
            {connected ? network || "Unknown" : "Not Connected"}
          </div>
        </div>

        <div className="vault-header-right">
          {connected ? (
            <button className="btn-disconnect" onClick={disconnect}>
              Disconnect
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{ width: "auto", padding: "9px 20px", fontSize: 13 }}
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
          )}
        </div>
      </header>

      <main className="vault-page">
        {/* ── Experiment banner ── */}
        <div
          style={{
            background: "rgba(224,123,57,.05)",
            border: "1px solid rgba(224,123,57,.14)",
            borderRadius: 12,
            padding: "16px 22px",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#e07b39",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            Experiment 01 — MetaMask Wallet Connection
          </div>
          <div style={{ fontSize: 13, color: "#71717a", lineHeight: 1.65 }}>
            Demonstrates connecting a browser wallet using MetaMask and
            Ethers.js v6 BrowserProvider. Reads the wallet address, detects the
            current network, and automatically switches to Sepolia.
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <span className="alert-icon">!</span>
            <span>{error}</span>
          </div>
        )}
        {!isMetaMaskAvailable && (
          <div className="alert alert-info" style={{ marginBottom: 20 }}>
            <span className="alert-icon">i</span>
            <span>
              MetaMask extension not detected.{" "}
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

        {!connected ? (
          /* ── Pre-connect layout ── */
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div className="vcard">
              <div className="vcard-title">Connect Your Wallet</div>
              <div className="vcard-sub">
                Click the button to open MetaMask. Approve the connection
                request and the app will automatically switch your network to
                Sepolia if needed.
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {[
                  "MetaMask popup opens in browser",
                  "Approve the connection request",
                  "App switches network to Sepolia",
                  "Connected address is displayed",
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={stepBadge(
                        "#e07b39",
                        "rgba(224,123,57,.1)",
                        "rgba(224,123,57,.2)",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 13, color: "#71717a" }}>{s}</span>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary"
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

            <div className="vcard">
              <div className="vcard-title">What Is MetaMask?</div>
              <div className="vcard-sub">
                MetaMask is a browser extension wallet that allows users to
                interact with Ethereum-based dApps without running a full node.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Browser Extension", "Available for Chrome, Firefox, Edge"],
                  ["Key Management", "Stores private keys encrypted locally"],
                  [
                    "EIP-1193 Provider",
                    "Injects window.ethereum into the browser",
                  ],
                  [
                    "Network Switching",
                    "Supports adding and switching EVM networks",
                  ],
                  [
                    "Transaction Signing",
                    "Signs and broadcasts transactions on-chain",
                  ],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      background: "#0d0d10",
                      border: "1px solid #1a1a1e",
                      borderRadius: 7,
                      padding: "9px 13px",
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#d4d4d8",
                        minWidth: 130,
                        flexShrink: 0,
                      }}
                    >
                      {k}
                    </span>
                    <span style={{ fontSize: 12, color: "#52525b" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Connected layout ── */
          <>
            <div className="alert alert-success" style={{ marginBottom: 24 }}>
              <span className="alert-icon" style={{ fontSize: 12 }}>
                ✓
              </span>
              <span>
                MetaMask connected on <strong>{network}</strong>
              </span>
            </div>

            <div className="stats-row" style={{ marginBottom: 20 }}>
              <div className="stat-box">
                <span className="stat-box-label">Status</span>
                <div className="stat-box-value green" style={{ fontSize: 14 }}>
                  Connected
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-box-label">Network</span>
                <div className="stat-box-value" style={{ fontSize: 14 }}>
                  {network}
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-box-label">Chain ID</span>
                <div className="stat-box-value" style={{ fontSize: 14 }}>
                  {parseInt(chainId, 16)}
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-box-label">On Sepolia</span>
                <div className="stat-box-value green" style={{ fontSize: 14 }}>
                  {isSepolia ? "Yes" : "No"}
                </div>
              </div>
            </div>

            <div className="vcard">
              <div className="vcard-title">Wallet Address</div>
              <div className="vcard-sub">Your connected Ethereum address.</div>
              <div style={addressBox}>
                <span
                  style={{
                    fontFamily: "Courier New, monospace",
                    fontSize: 13,
                    color: "#f4f4f5",
                    wordBreak: "break-all",
                  }}
                >
                  {address}
                </span>
                <button onClick={copyAddress} style={copyBtnStyle(copied)}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="data-list">
                <DataRow label="Short address" value={short(address)} />
                <DataRow label="Wallet type" value="MetaMask" />
                <DataRow
                  label="Provider"
                  value="Ethers.js v6 BrowserProvider"
                />
                <DataRow
                  label="Etherscan"
                  value={
                    <a
                      href={`https://sepolia.etherscan.io/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#93c5fd", textDecoration: "none" }}
                    >
                      View account
                    </a>
                  }
                />
              </div>
            </div>

            <div className="vcard" style={{ marginTop: 16 }}>
              <div className="vcard-title">Methods Demonstrated</div>
              <div className="vcard-sub">
                JSON-RPC and Ethers.js calls used in this experiment
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  [
                    "eth_requestAccounts",
                    "Prompts user to approve wallet connection",
                  ],
                  ["eth_chainId", "Reads the current network chain ID"],
                  [
                    "wallet_switchEthereumChain",
                    "Switches MetaMask to a specified network",
                  ],
                  [
                    "wallet_addEthereumChain",
                    "Adds a new network if not already present",
                  ],
                  [
                    "BrowserProvider",
                    "Ethers.js v6 wrapper for window.ethereum",
                  ],
                  [
                    "accountsChanged",
                    "Event: fires when user switches account",
                  ],
                  ["chainChanged", "Event: fires when user switches network"],
                ].map(([method, desc]) => (
                  <div
                    key={method}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <code style={codeTag("#818cf8", "#1a1a28", "#2e2e50")}>
                      {method}
                    </code>
                    <span
                      style={{ fontSize: 12, color: "#71717a", paddingTop: 2 }}
                    >
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="vault-footer">
        <span>
          <strong style={{ color: "#d4d4d8" }}>RoyaliX</strong> · Experiment 01
          — MetaMask
        </span>
        <span>Ethers.js v6 BrowserProvider · Sepolia Testnet</span>
      </footer>
    </div>
  );
};

/* ── Shared style helpers ── */
const backBtnStyle = {
  background: "transparent",
  border: "1px solid #27272a",
  borderRadius: 7,
  padding: "6px 12px",
  color: "#71717a",
  fontSize: 12,
  cursor: "pointer",
};

const stepBadge = (color, bg, border) => ({
  width: 20,
  height: 20,
  borderRadius: 5,
  background: bg,
  border: `1px solid ${border}`,
  display: "grid",
  placeItems: "center",
  fontSize: 9,
  fontWeight: 800,
  color,
  flexShrink: 0,
});

const addressBox = {
  background: "#0d0d10",
  border: "1px solid #1a1a1e",
  borderRadius: 9,
  padding: "14px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 4,
};

const copyBtnStyle = (copied) => ({
  flexShrink: 0,
  padding: "6px 12px",
  borderRadius: 6,
  background: copied ? "rgba(101,214,138,.08)" : "#1a1a1e",
  border: `1px solid ${copied ? "rgba(101,214,138,.25)" : "#2a2a32"}`,
  color: copied ? "#65d68a" : "#a1a1aa",
  fontSize: 11,
  cursor: "pointer",
});

const codeTag = (color, bg, border) => ({
  padding: "2px 7px",
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: 4,
  fontSize: 11,
  color,
  whiteSpace: "nowrap",
  flexShrink: 0,
});

const DataRow = ({ label, value }) => (
  <div className="data-list-row">
    <span className="data-list-label">{label}</span>
    <span className="data-list-value">{value}</span>
  </div>
);
