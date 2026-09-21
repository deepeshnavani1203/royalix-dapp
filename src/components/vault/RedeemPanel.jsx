import { useState } from "react";
import { previewRedeem, redeemShares } from "../../services/contractService";

export const RedeemPanel = ({ provider, address, onSuccess }) => {
  const [shares, setShares] = useState("");
  const [preview, setPreview] = useState(null);
  const [prevLoading, setPrevLoading] = useState(false);
  const [tx, setTx] = useState(null);

  const handlePreview = async () => {
    if (!shares || Number(shares) <= 0) {
      setPreview("Enter a valid share amount first");
      return;
    }
    setPrevLoading(true);
    setPreview(null);
    try {
      const r = await previewRedeem(provider, shares);
      setPreview(r.formatted);
    } catch (e) {
      setPreview("Error: " + (e.reason || e.message));
    } finally {
      setPrevLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!shares || Number(shares) <= 0) {
      setTx({ status: "error", msg: "Enter a valid share amount" });
      return;
    }
    setTx({ status: "pending", msg: "Waiting for MetaMask confirmation…" });
    try {
      const t = await redeemShares(provider, shares, address, address);
      setTx({
        status: "pending",
        msg: "Transaction sent. Waiting for confirmation…",
        hash: t.hash,
      });
      await t.wait();
      setTx({
        status: "success",
        msg: `Redeemed ${shares} shares for USDC!`,
        hash: t.hash,
      });
      setShares("");
      setPreview(null);
      onSuccess?.();
    } catch (e) {
      setTx({
        status: "error",
        msg: e?.reason || e?.message || "Redeem failed",
      });
    }
  };

  return (
    <>
      <div className="field">
        <label>Vault Shares to Redeem</label>
        <input
          type="number"
          min="0"
          placeholder="e.g. 50"
          value={shares}
          onChange={(e) => {
            setShares(e.target.value);
            setPreview(null);
          }}
        />
      </div>

      <p
        style={{
          fontSize: 12,
          color: "#52525b",
          margin: "0 0 4px",
          lineHeight: 1.5,
        }}
      >
        <code style={{ color: "#71717a" }}>previewRedeem(shares)</code> shows
        how much USDC you will receive. Receiver and owner are set to your
        wallet automatically.
      </p>

      {preview !== null && (
        <div className="preview-box">
          <span className="preview-box-label">Assets returned ≈</span>
          <span>
            <span className="preview-box-value">{preview}</span>
            <span className="preview-box-unit">USDC</span>
          </span>
        </div>
      )}

      <div className="btn-row">
        <button
          className="btn btn-secondary"
          onClick={handlePreview}
          disabled={prevLoading}
        >
          {prevLoading ? (
            <>
              <span className="spinner" /> Previewing…
            </>
          ) : (
            "Preview Redeem"
          )}
        </button>
        <button
          className="btn btn-red"
          onClick={handleRedeem}
          disabled={tx?.status === "pending"}
        >
          {tx?.status === "pending" ? (
            <>
              <span className="spinner" /> Redeeming…
            </>
          ) : (
            "Redeem Shares"
          )}
        </button>
      </div>

      <TxAlert tx={tx} />
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
