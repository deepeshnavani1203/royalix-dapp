import { useState } from "react";
import { MockUSDCPanel } from "./vault/MockUSDCPanel";
import { VaultOverviewPanel } from "./vault/VaultOverviewPanel";
import { DepositPanel } from "./vault/DepositPanel";
import { ConversionPanel } from "./vault/ConversionPanel";
import { MintSharesPanel } from "./vault/MintSharesPanel";
import { WithdrawPanel } from "./vault/WithdrawPanel";
import { RedeemPanel } from "./vault/RedeemPanel";
import { VaultInfoPanel } from "./vault/VaultInfoPanel";
import "../styles/vault.css";

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "");

/* ── Section divider ─────────────────────────────────── */
const SectionLabel = ({ label, title, desc }) => (
  <div className="section-label">
    <div
      className="section-label-icon"
      style={{ fontSize: 11, fontWeight: 800, color: "#52525b" }}
    >
      {label}
    </div>
    <div className="section-label-text">
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
    <div className="section-rule" />
  </div>
);

/* ── Card wrapper ────────────────────────────────────── */
const Card = ({ title, sub, children, style }) => (
  <div className="vcard" style={style}>
    {title && <div className="vcard-title">{title}</div>}
    {sub && <div className="vcard-sub">{sub}</div>}
    {children}
  </div>
);

/* ── Dashboard ───────────────────────────────────────── */
export const VaultDashboard = ({ wallet, onDisconnect, onBack }) => {
  const { provider, address, network, isSepolia } = wallet;
  const [refreshTick, setRefreshTick] = useState(0);
  const refresh = () => setRefreshTick((t) => t + 1);

  return (
    <div className="vault-app">
      {/* HEADER */}
      <header className="vault-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={backBtnStyle}>
              ← Back
            </button>
          )}
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
            <span className={`vault-network-dot${isSepolia ? "" : " wrong"}`} />
            {network || "Unknown Network"}
          </div>
        </div>

        <div className="vault-header-right">
          <div className="wallet-pill">
            <div className="wallet-avatar" />
            <span>{short(address)}</span>
          </div>
          <button className="btn-disconnect" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      </header>

      {/* WRONG NETWORK BANNER */}
      {!isSepolia && (
        <div
          style={{
            background: "rgba(248,113,113,.07)",
            borderBottom: "1px solid rgba(248,113,113,.18)",
            padding: "10px 48px",
            fontSize: 13,
            color: "#fca5a5",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Network mismatch — please switch to Sepolia Testnet in MetaMask.
        </div>
      )}

      {/* PAGE */}
      <main className="vault-page">
        {/* 1 — ERC-20 */}
        <SectionLabel
          label="01"
          title="ERC-20 Token — MockUSDC"
          desc="Mint testnet USDC, approve the vault allowance, and check balances"
        />
        <Card
          title="MockUSDC Token"
          sub="Interact with the deployed MockUSDC ERC-20 contract on Sepolia"
        >
          <MockUSDCPanel provider={provider} address={address} />
        </Card>

        {/* 2 — Vault Overview */}
        <SectionLabel
          label="02"
          title="ERC-4626 Vault Overview"
          desc="Live stats from the deployed vault — assets, shares, and your position"
        />
        <Card
          title="Vault Statistics"
          sub="Data from the vault contract: totalAssets(), totalSupply(), balanceOf()"
        >
          <VaultOverviewPanel
            provider={provider}
            address={address}
            refreshTrigger={refreshTick}
          />
        </Card>

        {/* 3 — Deposit */}
        <SectionLabel
          label="03"
          title="Deposit"
          desc="Deposit MockUSDC into the vault and receive proportional vault shares"
        />
        <Card
          title="Deposit Assets"
          sub="previewDeposit(assets) → deposit(assets, receiver)"
        >
          <DepositPanel
            provider={provider}
            address={address}
            onSuccess={refresh}
          />
        </Card>

        {/* 4 — Conversion */}
        <SectionLabel
          label="04"
          title="Conversion"
          desc="Convert between asset and share amounts using the current vault exchange rate"
        />
        <Card
          title="Assets / Shares Converter"
          sub="Read-only view calls — no gas required"
        >
          <ConversionPanel provider={provider} />
        </Card>

        {/* 5 — Mint Shares */}
        <SectionLabel
          label="05"
          title="Mint Vault Shares"
          desc="Specify an exact number of shares to receive — vault calculates required assets"
        />
        <Card
          title="Mint Exact Shares"
          sub="previewMint(shares) → mint(shares, receiver)"
        >
          <MintSharesPanel
            provider={provider}
            address={address}
            onSuccess={refresh}
          />
        </Card>

        {/* 6 — Withdraw */}
        <SectionLabel
          label="06"
          title="Withdraw"
          desc="Withdraw an exact asset amount from the vault — corresponding shares are burned"
        />
        <Card
          title="Withdraw Assets"
          sub="previewWithdraw(assets) → withdraw(assets, receiver, owner)"
        >
          <WithdrawPanel
            provider={provider}
            address={address}
            onSuccess={refresh}
          />
        </Card>

        {/* 7 — Redeem */}
        <SectionLabel
          label="07"
          title="Redeem"
          desc="Burn vault shares and receive the underlying MockUSDC back"
        />
        <Card
          title="Redeem Shares"
          sub="previewRedeem(shares) → redeem(shares, receiver, owner)"
        >
          <RedeemPanel
            provider={provider}
            address={address}
            onSuccess={refresh}
          />
        </Card>

        {/* 8 — Vault Info */}
        <SectionLabel
          label="08"
          title="Vault Information"
          desc="Custom on-chain function returning vault metadata"
        />
        <Card
          title="getVaultInfo()"
          sub="Calls the custom view function on the vault contract"
        >
          <VaultInfoPanel provider={provider} />
        </Card>

        {/* Flow Reference */}
        <div style={{ marginTop: 56 }}>
          <SectionLabel
            label="—"
            title="Lifecycle Reference"
            desc="The complete ERC-20 → ERC-4626 → ERC-20 flow at a glance"
          />
          <Card>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
                gap: 10,
              }}
            >
              {[
                ["01", "Connect MetaMask", "Wallet connected to Sepolia"],
                ["02", "View USDC Balance", "balanceOf() on MockUSDC"],
                ["03", "Mint MockUSDC", "mint(to, amount)"],
                ["04", "Approve Vault", "approve(vault, amount)"],
                ["05", "Check Allowance", "allowance(user, vault)"],
                ["06", "Preview Deposit", "previewDeposit(assets)"],
                ["07", "Deposit", "deposit(assets, receiver)"],
                ["08", "Receive Shares", "Vault shares credited"],
                ["09", "View Vault Stats", "totalAssets(), totalSupply()"],
                ["10", "Convert", "convertToShares / convertToAssets"],
                ["11", "Mint Shares", "mint(shares, receiver)"],
                ["12", "Withdraw", "withdraw(assets, receiver, owner)"],
                ["13", "Redeem", "redeem(shares, receiver, owner)"],
                ["14", "Receive USDC", "MockUSDC returned to wallet"],
                ["15", "Vault Info", "getVaultInfo()"],
              ].map(([n, title, sub]) => (
                <div
                  key={n}
                  style={{
                    background: "#0d0d10",
                    border: "1px solid #1a1a1e",
                    borderRadius: 9,
                    padding: "11px 13px",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      background: "#1a1a28",
                      color: "#818cf8",
                      border: "1px solid #2e2e50",
                      borderRadius: 5,
                      width: 22,
                      height: 22,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {n}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#e4e4e7",
                        marginBottom: 2,
                      }}
                    >
                      {title}
                    </div>
                    <div style={{ fontSize: 10, color: "#52525b" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="vault-footer">
        <span>
          <strong style={{ color: "#d4d4d8" }}>RoyaliX</strong> · Experiment 03
          — ERC-4626 Vault on Sepolia
        </span>
        <span>
          <a
            href={`https://sepolia.etherscan.io/address/${import.meta.env.VITE_VAULT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vault on Etherscan
          </a>
          {" · "}
          <a
            href={`https://sepolia.etherscan.io/address/${import.meta.env.VITE_MOCKUSDC_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            MockUSDC
          </a>
        </span>
      </footer>
    </div>
  );
};

const backBtnStyle = {
  background: "transparent",
  border: "1px solid #27272a",
  borderRadius: 7,
  padding: "6px 12px",
  color: "#71717a",
  fontSize: 12,
  cursor: "pointer",
};
