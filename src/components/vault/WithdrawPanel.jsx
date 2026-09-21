import { useState } from "react";
import {
  previewWithdraw,
  withdrawFromVault,
} from "../../services/contractService";

export const WithdrawPanel = ({ provider, address, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState(null);
  const [prevLoading, setPrevLoading] = useState(false);
  const [tx, setTx] = useState(null);

  const handlePreview = async () => {
    if (!amount || Number(amount) <= 0) {
      setPreview("Enter a valid amount first");
      return;
    }
    setPrevLoading(true);
    setPreview(null);
    try {
      const r = await previewWithdraw(provider, amount);
      setPreview(r.formatted);
    } catch (e) {
      setPreview("Error: " + (e.reason || e.message));
    } finally {
      setPrevLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      setTx({ status: "error", msg: "Enter a valid asset amount" });
      return;
    }
    setTx({ status: "pending", msg: "Waiting for MetaMask confirmation…" });
    try {
      const t = await withdrawFromVault(provider, amount, address, address);
      setTx({
        status: "pending",
        msg: "Transaction sent. Waiting for confirmation…",
        hash: t.hash,
      });
      await t.wait();
      setTx({
        status: "success",
        msg: `Withdrew ${amount} USDC successfully!`,
        hash: t.hash,
      });
      setAmount("");
      setPreview(null);
      onSuccess?.();
    } catch (e) {
      setTx({
        status: "error",
        msg: e?.reason || e?.message || "Withdraw failed",
      });
    }
  };

  return (
    <>
      <div className="field">
        <label>Asset Amount to Withdraw (USDC)</label>
        <input
          type="number"
          min="0"
          placeholder="e.g. 100"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
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
        <code style={{ color: "#71717a" }}>previewWithdraw(assets)</code> shows
        shares that will be burned. Receiver and owner are set to your wallet
        automatically.
      </p>

      {preview !== null && (
        <div className="preview-box">
          <span className="preview-box-label">Shares burned ≈</span>
          <span>
            <span className="preview-box-value">{preview}</span>
            <span className="preview-box-unit">Shares</span>
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
            "Preview Withdraw"
          )}
        </button>
        <button
          className="btn btn-red"
          onClick={handleWithdraw}
          disabled={tx?.status === "pending"}
        >
          {tx?.status === "pending" ? (
            <>
              <span className="spinner" /> Withdrawing…
            </>
          ) : (
            "Withdraw"
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
