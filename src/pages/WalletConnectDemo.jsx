import { useState } from "react";
import "../styles/vault.css";

const short = (a) => (a ? `${a.slice(0, 8)}…${a.slice(-6)}` : "—");

export const WalletConnectDemo = ({ wallet, onBack }) => {
  const {
    connectWC,
    disconnect,
    connected,
    address,
    network,
    chainId,
    isSepolia,
    loading,
    error,
    walletType,
  } = wallet;
  const [copied, setCopied] = useState(false);

  const wcConnected = connected && walletType === "walletconnect";

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
                background: "rgba(59,141,224,.12)",
                color: "#3b8de0",
                border: "1px solid rgba(59,141,224,.25)",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              W
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
              / WalletConnect
            </span>
          </div>
        </div>

        <div className="vault-header-center">
          <div className="vault-network-pill">
            <span
              className={`vault-network-dot${wcConnected && isSepolia ? "" : " wrong"}`}
            />
            {wcConnected ? network || "Sepolia" : "Not Connected"}
          </div>
        </div>

        <div className="vault-header-right">
          {wcConnected ? (
            <button className="btn-disconnect" onClick={disconnect}>
              Disconnect
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{ width: "auto", padding: "9px 20px", fontSize: 13 }}
              onClick={connectWC}
              disabled={loading}
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
                "Connect WalletConnect"
              )}
            </button>
          )}
        </div>
      </header>

      <main className="vault-page">
        {/* ── Experiment banner ── */}
        <div
          style={{
            background: "rgba(59,141,224,.05)",
            border: "1px solid rgba(59,141,224,.14)",
            borderRadius: 12,
            padding: "16px 22px",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#3b8de0",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            Experiment 02 — WalletConnect
          </div>
          <div style={{ fontSize: 13, color: "#71717a", lineHeight: 1.65 }}>
            Demonstrates connecting a mobile or external wallet using the
            WalletConnect v2 protocol. A QR code is presented for scanning with
            any compatible mobile wallet application.
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <span className="alert-icon" style={{ fontSize: 12 }}>
              !
            </span>
            <span>{error}</span>
          </div>
        )}

        {!wcConnected ? (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {/* Connect card */}
            <div className="vcard">
              <div className="vcard-title">Connect via WalletConnect</div>
              <div className="vcard-sub">
                Initiates a WalletConnect v2 session. A modal with a QR code
                will appear — scan it using your mobile wallet to establish the
                connection.
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
                  "Click the connect button below",
                  "WalletConnect QR modal opens",
                  "Open your mobile wallet app",
                  "Scan the QR code displayed",
                  "Approve the connection on your phone",
                  "Connected address appears here",
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={stepBadge(
                        "#3b8de0",
                        "rgba(59,141,224,.1)",
                        "rgba(59,141,224,.2)",
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
                onClick={connectWC}
                disabled={loading}
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
                  "Connect WalletConnect"
                )}
              </button>
            </div>

            {/* Compatible wallets */}
            <div className="vcard">
              <div className="vcard-title">Compatible Wallets</div>
              <div className="vcard-sub">
                Any WalletConnect v2 compatible wallet can be used.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  [
                    "Trust Wallet",
                    "iOS & Android — most popular mobile wallet",
                  ],
                  ["Rainbow", "Ethereum-focused — iOS & Android"],
                  ["MetaMask Mobile", "MetaMask app on iOS or Android"],
                  ["Coinbase Wallet", "Coinbase mobile wallet app"],
                  ["Argent", "Smart contract wallet — iOS & Android"],
                  ["imToken", "Multi-chain wallet — iOS & Android"],
                ].map(([name, desc]) => (
                  <div
                    key={name}
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
                      {name}
                    </span>
                    <span style={{ fontSize: 12, color: "#52525b" }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="alert alert-success" style={{ marginBottom: 24 }}>
              <span className="alert-icon" style={{ fontSize: 12 }}>
                ✓
              </span>
              <span>
                WalletConnect session established on <strong>{network}</strong>
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
                  {chainId ? parseInt(chainId, 16) : "—"}
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-box-label">Protocol</span>
                <div className="stat-box-value blue" style={{ fontSize: 13 }}>
                  WalletConnect v2
                </div>
              </div>
            </div>

            <div className="vcard">
              <div className="vcard-title">Connected Wallet Address</div>
              <div className="vcard-sub">
                Address received from your mobile wallet via WalletConnect
                session.
              </div>
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
                <DataRow
                  label="Connection method"
                  value="WalletConnect v2 (QR)"
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
              <div className="vcard-title">Concepts Demonstrated</div>
              <div className="vcard-sub">
                Key technical ideas shown in this experiment
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  [
                    "WalletConnect v2",
                    "Open protocol for dApp-to-wallet communication",
                  ],
                  ["QR Pairing", "Secure session initiation via QR code scan"],
                  [
                    "Relay Server",
                    "WC relay handles message routing between devices",
                  ],
                  ["Session", "Persistent connection with defined expiry"],
                  [
                    "Provider Wrapper",
                    "WC provider is compatible with Ethers.js v6",
                  ],
                  ["disconnect()", "Terminates the WC session on both sides"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <code style={codeTag("#93c5fd", "#0d1120", "#1e3a6b")}>
                      {k}
                    </code>
                    <span
                      style={{ fontSize: 12, color: "#71717a", paddingTop: 2 }}
                    >
                      {v}
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
          <strong style={{ color: "#d4d4d8" }}>RoyaliX</strong> · Experiment 02
          — WalletConnect
        </span>
        <span>WalletConnect v2 · Sepolia Testnet</span>
      </footer>
    </div>
  );
};

/* ── Style helpers ── */
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
