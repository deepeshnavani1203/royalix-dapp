import { useState, useEffect, useCallback } from "react";
import { VAULT_ADDRESS } from "../../contracts/studentVault";
import { getVaultOverview } from "../../services/contractService";

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");

export const VaultOverviewPanel = ({ provider, address, refreshTrigger }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!provider || !address) return;
    setLoading(true);
    setError(null);
    try {
      const d = await getVaultOverview(provider, address);
      setData(d);
    } catch (e) {
      setError(e.message || "Failed to load vault data");
    } finally {
      setLoading(false);
    }
  }, [provider, address]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshTrigger]);

  return (
    <>
      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-box-label">Underlying Asset</span>
          <div className="stat-box-value small">
            {loading ? (
              "…"
            ) : data ? (
              <a
                href={`https://sepolia.etherscan.io/address/${data.assetAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#93c5fd", textDecoration: "none" }}
              >
                {short(data.assetAddress)}
              </a>
            ) : (
              "—"
            )}
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-box-label">Total Assets</span>
          <div className="stat-box-value green">
            {loading ? "…" : (data?.totalAssets ?? "—")}
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-box-label">Total Vault Shares</span>
          <div className="stat-box-value blue">
            {loading ? "…" : (data?.totalShares ?? "—")}
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-box-label">My Shares</span>
          <div className="stat-box-value">
            {loading ? "…" : (data?.myShares ?? "—")}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          <span>{error}</span>
        </div>
      )}

      <div className="data-list">
        <div className="data-list-row">
          <span className="data-list-label">🏦 Vault Contract</span>
          <span className="data-list-value">
            <a
              href={`https://sepolia.etherscan.io/address/${VAULT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#93c5fd", textDecoration: "none" }}
            >
              {short(VAULT_ADDRESS)}
            </a>
          </span>
        </div>
        <div className="data-list-row">
          <span className="data-list-label">👤 Connected Wallet</span>
          <span className="data-list-value">{short(address)}</span>
        </div>
        <div className="data-list-row">
          <span className="data-list-label">📊 Share Ownership</span>
          <span className="data-list-value">
            {data && data.totalShares !== "0" && data.myShares !== "0"
              ? `${((parseFloat(data.myShares) / parseFloat(data.totalShares)) * 100).toFixed(4)}%`
              : "0%"}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button
          className="btn btn-secondary"
          style={{ width: "auto", padding: "9px 18px" }}
          onClick={refresh}
        >
          {loading ? (
            <>
              <span className="spinner" /> Refreshing…
            </>
          ) : (
            "Refresh"
          )}
        </button>
      </div>
    </>
  );
};
