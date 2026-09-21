import { useState } from "react";
import { previewMint, mintShares } from "../../services/contractService";

export const MintSharesPanel = ({ provider, address, onSuccess }) => {
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
      const r = await previewMint(provider, shares);
      setPreview(r.formatted);
    } catch (e) {
      setPreview("Error: " + (e.reason || e.message));
    } finally {
      setPrevLoading(false);
    }
  };

  const handleMint = async () => {
    if (!shares || Number(shares) <= 0) {
      setTx({ status: "error", msg: "Enter a valid share amount" });
      return;
    }
    setTx({ status: "pending", msg: "Waiting for MetaMask confirmation…" });
    try {
      const t = await mintShares(provider, shares, address);
      setTx({
        status: "pending",
        msg: "Transaction sent. Waiting for confirmation…",
        hash: t.hash,
      });
      await t.wait();
      setTx({
        status: "success",
        msg: `Minted ${shares} vault shares!`,
        hash: t.hash,
      });
      setShares("");
      setPreview(null);
      onSuccess?.();
    } catch (e) {
      setTx({ status: "error", msg: e?.reason || e?.message || "Mint failed" });
    }
  };

  return (
    <>
      <div className="field">
        <label>Number of Shares to Mint</label>
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
        <code style={{ color: "#71717a" }}>previewMint(shares)</code> shows how
        many USDC will be required. Receiver is set to your connected wallet
        automatically.
      </p>

      {preview !== null && (
        <div className="preview-box">
          <span className="preview-box-label">Assets required ≈</span>
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
            "Preview Mint"
          )}
        </button>
        <button
          className="btn btn-primary"
          onClick={handleMint}
          disabled={tx?.status === "pending"}
        >
          {tx?.status === "pending" ? (
            <>
              <span className="spinner" /> Minting…
            </>
          ) : (
            "Mint Shares"
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
