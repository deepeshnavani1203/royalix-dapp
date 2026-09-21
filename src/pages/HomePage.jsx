import "../styles/vault.css";

export const HomePage = ({ onSelect }) => {
  return (
    <div
      className="vault-app"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* ── Header ── */}
      <header className="vault-header">
        <div className="vault-logo">
          <div className="vault-logo-badge">R</div>
          RoyaliX
        </div>
        <div className="vault-header-center">
          <div className="vault-network-pill">
            <span className="vault-network-dot" />
            Ethereum Sepolia
          </div>
        </div>
        <div className="vault-header-right">
          <span
            style={{ fontSize: 12, color: "#52525b", letterSpacing: "0.3px" }}
          >
            Web3 Practical Experiments
          </span>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ flex: 1 }}>
        <div
          style={{
            width: "min(1100px, 92%)",
            margin: "0 auto",
            padding: "72px 0 80px",
          }}
        >
          {/* Page title */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 14px",
                background: "rgba(99,91,255,.08)",
                border: "1px solid rgba(99,91,255,.18)",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1.4px",
                color: "#818cf8",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Blockchain Practical — Three Experiments
            </div>
            <h1
              style={{
                fontSize: "clamp(34px, 5vw, 58px)",
                fontWeight: 800,
                letterSpacing: "-2px",
                margin: "0 0 18px",
                lineHeight: 1.05,
                color: "#f4f4f5",
              }}
            >
              RoyaliX <span style={{ color: "#635bff" }}>Dashboard</span>
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "#71717a",
                maxWidth: 500,
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              Three hands-on experiments covering wallet connections and
              ERC-4626 tokenised vault interactions on Ethereum Sepolia.
            </p>
          </div>

          {/* ── Cards ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            <ExperimentCard
              number="01"
              title="MetaMask"
              subtitle="Browser Wallet Connection"
              desc="Connect using MetaMask browser extension. Demonstrates wallet address detection, network reading, and automatic Sepolia switching via Ethers.js v6."
              tags={["MetaMask", "BrowserProvider", "Ethers v6"]}
              color="#e07b39"
              colorBg="rgba(224,123,57,.07)"
              colorBorder="rgba(224,123,57,.18)"
              steps={[
                "Install MetaMask extension",
                "Click Connect MetaMask",
                "Approve the connection popup",
                "Auto-switches to Sepolia",
                "View address and network info",
              ]}
              onClick={() => onSelect("metamask")}
            />

            <ExperimentCard
              number="02"
              title="WalletConnect"
              subtitle="Mobile Wallet via QR Code"
              desc="Connect any mobile wallet using the WalletConnect v2 protocol. Scan the QR code with Trust Wallet, Rainbow, or any compatible mobile app."
              tags={["WalletConnect v2", "QR Code", "Mobile Wallet"]}
              color="#3b8de0"
              colorBg="rgba(59,141,224,.07)"
              colorBorder="rgba(59,141,224,.18)"
              steps={[
                "Click Connect WalletConnect",
                "QR code modal appears",
                "Open mobile wallet app",
                "Scan the QR code",
                "Approve on your phone",
              ]}
              onClick={() => onSelect("walletconnect")}
            />

            <ExperimentCard
              number="03"
              title="ERC-4626 Vault"
              subtitle="Tokenised Vault Practical"
              desc="Full lifecycle demo of an ERC-4626 vault. Mint MockUSDC, approve, deposit for shares, convert, withdraw, and redeem — all using deployed Sepolia contracts."
              tags={["ERC-4626", "ERC-20", "MockUSDC", "Vault"]}
              color="#635bff"
              colorBg="rgba(99,91,255,.07)"
              colorBorder="rgba(99,91,255,.18)"
              steps={[
                "Connect MetaMask",
                "Mint MockUSDC tokens",
                "Approve vault spending",
                "Deposit and receive shares",
                "Withdraw or redeem",
              ]}
              onClick={() => onSelect("vault")}
            />
          </div>

          {/* ── Footer note ── */}
          <div
            style={{
              marginTop: 48,
              padding: "20px 28px",
              background: "#0d0d10",
              border: "1px solid #1a1a1e",
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#52525b",
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              All experiments run on{" "}
              <span style={{ color: "#65d68a", fontWeight: 600 }}>
                Ethereum Sepolia Testnet
              </span>{" "}
              — no real funds required. Get free test ETH at{" "}
              <a
                href="https://sepoliafaucet.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#93c5fd", textDecoration: "none" }}
              >
                sepoliafaucet.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="vault-footer">
        <span>
          <strong style={{ color: "#d4d4d8" }}>RoyaliX</strong> — Web3 Practical
          Project
        </span>
        <span>React · Vite · Ethers.js v6 · Ethereum Sepolia</span>
      </footer>
    </div>
  );
};

/* ── Card component ────────────────────────────────────── */
const ExperimentCard = ({
  number,
  title,
  subtitle,
  desc,
  tags,
  color,
  colorBg,
  colorBorder,
  steps,
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      background: "#111114",
      border: `1px solid ${colorBorder}`,
      borderRadius: 16,
      padding: "28px",
      cursor: "pointer",
      transition: "transform .18s, box-shadow .18s",
      display: "flex",
      flexDirection: "column",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = `0 16px 48px ${colorBg}`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    {/* Number + icon row */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          background: colorBg,
          border: `1px solid ${colorBorder}`,
          display: "grid",
          placeItems: "center",
          fontSize: 14,
          fontWeight: 800,
          color,
        }}
      >
        {number}
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#2a2a32",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Experiment {number}
      </span>
    </div>

    {/* Title block */}
    <div
      style={{
        fontSize: 10,
        color: "#52525b",
        fontWeight: 700,
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {subtitle}
    </div>
    <div
      style={{
        fontSize: 19,
        fontWeight: 800,
        color: "#f4f4f5",
        marginBottom: 12,
      }}
    >
      {title}
    </div>
    <p
      style={{
        fontSize: 13,
        color: "#71717a",
        lineHeight: 1.75,
        margin: "0 0 22px",
      }}
    >
      {desc}
    </p>

    {/* Steps */}
    <div style={{ marginBottom: 22 }}>
      {steps.map((s, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 7,
          }}
        >
          <span
            style={{
              width: 17,
              height: 17,
              borderRadius: 4,
              background: colorBg,
              border: `1px solid ${colorBorder}`,
              display: "grid",
              placeItems: "center",
              fontSize: 9,
              fontWeight: 800,
              color,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>
          <span style={{ fontSize: 12, color: "#71717a" }}>{s}</span>
        </div>
      ))}
    </div>

    {/* Tags */}
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}
    >
      {tags.map((t) => (
        <span
          key={t}
          style={{
            padding: "3px 8px",
            background: colorBg,
            border: `1px solid ${colorBorder}`,
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 700,
            color,
          }}
        >
          {t}
        </span>
      ))}
    </div>

    {/* CTA */}
    <div
      style={{
        marginTop: "auto",
        padding: "10px 16px",
        background: colorBg,
        border: `1px solid ${colorBorder}`,
        borderRadius: 8,
        textAlign: "center",
        fontSize: 12,
        fontWeight: 700,
        color,
      }}
    >
      Open Experiment {number} →
    </div>
  </div>
);
