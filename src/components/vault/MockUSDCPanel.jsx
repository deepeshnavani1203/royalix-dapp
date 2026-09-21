import { useState, useEffect, useCallback } from "react";
import { MOCKUSDC_ADDRESS } from "../../contracts/mockUSDC";
import { VAULT_ADDRESS } from "../../contracts/studentVault";
import {
  getUSDCInfo,
  mintUSDC,
  approveVault,
  checkAllowance,
} from "../../services/contractService";

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");

export const MockUSDCPanel = ({ provider, address }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── mint form
  const [mintAmt, setMintAmt] = useState("");
  const [mintTx, setMintTx] = useState(null); // { status, hash, msg }

  // ── approve form
  const [approveAmt, setApproveAmt] = useState("");
  const [approveTx, setApproveTx] = useState(null);

  // ── allowance check
  const [allowanceResult, setAllowanceResult] = useState(null);

  const refresh = useCallback(async () => {
    if (!provider || !address) return;
    setLoading(true);
    try {
      const data = await getUSDCInfo(provider, address);
      setInfo(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [provider, address]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ── Helpers
  const txRun = async (setTx, fn) => {
    setTx({ status: "pending", msg: "Waiting for MetaMask confirmation…" });
    try {
      const tx = await fn();
      setTx({
        status: "pending",
        msg: "Transaction sent. Waiting for confirmation…",
        hash: tx.hash,
      });
      await tx.wait();
      setTx({
        status: "success",
        msg: "Transaction confirmed!",
        hash: tx.hash,
      });
      refresh();
    } catch (e) {
      setTx({
        status: "error",
        msg: e?.reason || e?.message || "Transaction failed",
      });
    }
  };

  const handleMint = () => {
    if (!mintAmt || isNaN(mintAmt) || Number(mintAmt) <= 0) {
      setMintTx({ status: "error", msg: "Enter a valid amount to mint" });
      return;
    }
    txRun(setMintTx, () =>
      mintUSDC(provider, address, mintAmt, info?.decimals ?? 18),
    );
  };

  const handleApprove = () => {
    if (!approveAmt || isNaN(approveAmt) || Number(approveAmt) <= 0) {
      setApproveTx({ status: "error", msg: "Enter a valid amount to approve" });
      return;
    }
    txRun(setApproveTx, () =>
      approveVault(provider, approveAmt, info?.decimals ?? 18),
    );
  };

  const handleCheckAllowance = async () => {
    setAllowanceResult(null);
    try {
      const r = await checkAllowance(provider, address);
      setAllowanceResult(r.formatted);
    } catch (e) {
      setAllowanceResult("Error: " + e.message);
    }
  };

  return (
    <>
      {/* ── Stats row ── */}
      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-box-label">Token Name</span>
          <div className="stat-box-value">
            {loading ? "…" : (info?.name ?? "—")}
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-box-label">Symbol</span>
          <div className="stat-box-value green">
            {loading ? "…" : (info?.symbol ?? "—")}
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-box-label">Total Supply</span>
          <div className="stat-box-value">
            {loading ? "…" : (info?.totalSupply ?? "—")}
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-box-label">My Balance</span>
          <div className="stat-box-value blue">
            {loading ? "…" : (info?.balance ?? "—")}
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-box-label">Vault Allowance</span>
          <div className="stat-box-value">
            {loading ? "…" : (info?.allowance ?? "—")}
          </div>
        </div>
      </div>

      {/* ── Contract addresses ── */}
      <div className="data-list" style={{ marginBottom: 24 }}>
        <div className="data-list-row">
          <span className="data-list-label">📄 MockUSDC Contract</span>
          <span className="data-list-value">
            <a
              href={`https://sepolia.etherscan.io/address/${MOCKUSDC_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#93c5fd", textDecoration: "none" }}
            >
              {short(MOCKUSDC_ADDRESS)}
            </a>
          </span>
        </div>
        <div className="data-list-row">
          <span className="data-list-label">🏦 Vault (spender)</span>
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
      </div>

      {/* ── Action cards ── */}
      <div className="two-col">
        {/* Mint */}
        <div className="vcard" style={{ margin: 0 }}>
          <div className="vcard-title">Mint MockUSDC</div>
          <div className="vcard-sub">
            Mint testnet USDC directly to your wallet.
          </div>
          <div className="field">
            <label>Amount</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 1000"
              value={mintAmt}
              onChange={(e) => setMintAmt(e.target.value)}
            />
          </div>
          <div className="btn-row single">
            <button
              className="btn btn-green"
              onClick={handleMint}
              disabled={mintTx?.status === "pending"}
            >
              {mintTx?.status === "pending" ? (
                <>
                  <span className="spinner" /> Minting…
                </>
              ) : (
                "Mint"
              )}
            </button>
          </div>
          <TxAlert tx={mintTx} />
        </div>

        {/* Approve */}
        <div className="vcard" style={{ margin: 0 }}>
          <div className="vcard-title">Approve Vault</div>
          <div className="vcard-sub">
            Allow the vault to spend your MockUSDC.
          </div>
          <div className="field">
            <label>Amount to Approve</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 1000"
              value={approveAmt}
              onChange={(e) => setApproveAmt(e.target.value)}
            />
          </div>
          <div className="btn-row single">
            <button
              className="btn btn-accent"
              onClick={handleApprove}
              disabled={approveTx?.status === "pending"}
            >
              {approveTx?.status === "pending" ? (
                <>
                  <span className="spinner" /> Approving…
                </>
              ) : (
                "Approve"
              )}
            </button>
          </div>
          <TxAlert tx={approveTx} />
        </div>
      </div>

      {/* Check Allowance */}
      <div className="vcard" style={{ marginTop: 16 }}>
        <div className="vcard-title">Check Allowance</div>
        <div className="vcard-sub">
          Query the current vault allowance from the contract.
        </div>
        <button
          className="btn btn-secondary"
          style={{ marginTop: 0 }}
          onClick={handleCheckAllowance}
        >
          Check Allowance
        </button>
        {allowanceResult !== null && (
          <div className="preview-box" style={{ marginTop: 14 }}>
            <span className="preview-box-label">Vault Allowance</span>
            <span>
              <span className="preview-box-value">{allowanceResult}</span>
              <span className="preview-box-unit">USDC</span>
            </span>
          </div>
        )}
      </div>
    </>
  );
};

const TxAlert = ({ tx }) => {
  if (!tx) return null;
  const cls =
    tx.status === "pending"
      ? "alert-pending"
      : tx.status === "success"
        ? "alert-success"
        : "alert-error";
  const icon =
    tx.status === "pending" ? "⏳" : tx.status === "success" ? "✅" : "❌";
  return (
    <div className={`alert ${cls}`}>
      <span className="alert-icon">{icon}</span>
      <div>
        <div>{tx.msg}</div>
        {tx.hash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", opacity: 0.8, fontSize: 11 }}
          >
            View on Etherscan ↗
          </a>
        )}
      </div>
    </div>
  );
};
