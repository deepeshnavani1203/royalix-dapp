import { useState } from "react";
import { getVaultInfo } from "../../services/contractService";

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");

export const VaultInfoPanel = ({ provider }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const d = await getVaultInfo(provider);
      setInfo(d);
    } catch (e) {
      setError(e?.reason || e?.message || "Failed to call getVaultInfo()");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p
        style={{
          fontSize: 13,
          color: "#71717a",
          margin: "0 0 20px",
          lineHeight: 1.6,
        }}
      >
        Calls the custom{" "}
        <code
          style={{
            color: "#a5b4fc",
            background: "#1a1a2e",
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          getVaultInfo()
        </code>{" "}
        function on the StudentVault contract and displays the on-chain vault
        metadata.
      </p>

      <button
        className="btn btn-accent"
        style={{ maxWidth: 240 }}
        onClick={handleFetch}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" /> Fetching…
          </>
        ) : (
          "Call getVaultInfo()"
        )}
      </button>

      {error && (
        <div className="alert alert-error" style={{ marginTop: 16 }}>
          <span className="alert-icon">❌</span>
          <span>{error}</span>
        </div>
      )}

      {info && (
        <div className="vault-info-grid">
          <div className="vault-info-cell">
            <span className="vault-info-cell-label">Underlying Asset</span>
            <div className="vault-info-cell-value">
              <a
                href={`https://sepolia.etherscan.io/address/${info.underlyingAsset}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#93c5fd", textDecoration: "none" }}
              >
                {short(info.underlyingAsset)}
              </a>
            </div>
          </div>

          <div className="vault-info-cell">
            <span className="vault-info-cell-label">Total Assets (USDC)</span>
            <div className="vault-info-cell-value" style={{ color: "#65d68a" }}>
              {info.totalAssets}
            </div>
          </div>

          <div className="vault-info-cell">
            <span className="vault-info-cell-label">Total Shares</span>
            <div className="vault-info-cell-value" style={{ color: "#93c5fd" }}>
              {info.totalShares}
            </div>
          </div>

          <div className="vault-info-cell">
            <span className="vault-info-cell-label">Exchange Rate</span>
            <div className="vault-info-cell-value">
              {info.totalShares !== "0"
                ? `${(parseFloat(info.totalAssets) / parseFloat(info.totalShares)).toFixed(6)} USDC/share`
                : "—"}
            </div>
          </div>

          <div className="vault-info-cell purpose">
            <span className="vault-info-cell-label">Vault Purpose</span>
            <div className="vault-info-cell-value">
              {info.vaultPurpose || "—"}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
