import { useState } from "react";
import {
  convertAssetsToShares,
  convertSharesToAssets,
} from "../../services/contractService";

export const ConversionPanel = ({ provider }) => {
  const [assetAmt, setAssetAmt] = useState("");
  const [shareAmt, setShareAmt] = useState("");
  const [a2sResult, setA2sResult] = useState(null);
  const [s2aResult, setS2aResult] = useState(null);
  const [a2sLoading, setA2sLoading] = useState(false);
  const [s2aLoading, setS2aLoading] = useState(false);

  const handleA2S = async () => {
    if (!assetAmt || Number(assetAmt) <= 0) return;
    setA2sLoading(true);
    setA2sResult(null);
    try {
      const r = await convertAssetsToShares(provider, assetAmt);
      setA2sResult({ value: r.formatted, ok: true });
    } catch (e) {
      setA2sResult({ value: e.reason || e.message, ok: false });
    } finally {
      setA2sLoading(false);
    }
  };

  const handleS2A = async () => {
    if (!shareAmt || Number(shareAmt) <= 0) return;
    setS2aLoading(true);
    setS2aResult(null);
    try {
      const r = await convertSharesToAssets(provider, shareAmt);
      setS2aResult({ value: r.formatted, ok: true });
    } catch (e) {
      setS2aResult({ value: e.reason || e.message, ok: false });
    } finally {
      setS2aLoading(false);
    }
  };

  return (
    <div className="conversion-grid">
      {/* Assets → Shares */}
      <div className="conversion-card">
        <div className="conversion-card-title">Assets → Shares</div>
        <div className="field">
          <label>Asset Amount (USDC)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 100"
            value={assetAmt}
            onChange={(e) => {
              setAssetAmt(e.target.value);
              setA2sResult(null);
            }}
          />
        </div>
        <button
          className="btn btn-accent"
          onClick={handleA2S}
          disabled={a2sLoading}
        >
          {a2sLoading ? (
            <>
              <span className="spinner" /> Converting…
            </>
          ) : (
            "convertToShares()"
          )}
        </button>
        {a2sResult && (
          <div
            className={`preview-box${a2sResult.ok ? "" : " alert-error"}`}
            style={{ marginTop: 12 }}
          >
            <span className="preview-box-label">= Shares</span>
            <span>
              <span
                className="preview-box-value"
                style={a2sResult.ok ? {} : { color: "#fca5a5", fontSize: 13 }}
              >
                {a2sResult.value}
              </span>
              {a2sResult.ok && <span className="preview-box-unit">SVT</span>}
            </span>
          </div>
        )}
      </div>

      {/* Shares → Assets */}
      <div className="conversion-card">
        <div className="conversion-card-title">Shares → Assets</div>
        <div className="field">
          <label>Share Amount (SVT)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 100"
            value={shareAmt}
            onChange={(e) => {
              setShareAmt(e.target.value);
              setS2aResult(null);
            }}
          />
        </div>
        <button
          className="btn btn-accent"
          onClick={handleS2A}
          disabled={s2aLoading}
        >
          {s2aLoading ? (
            <>
              <span className="spinner" /> Converting…
            </>
          ) : (
            "convertToAssets()"
          )}
        </button>
        {s2aResult && (
          <div
            className={`preview-box${s2aResult.ok ? "" : " alert-error"}`}
            style={{ marginTop: 12 }}
          >
            <span className="preview-box-label">= Assets</span>
            <span>
              <span
                className="preview-box-value"
                style={s2aResult.ok ? {} : { color: "#fca5a5", fontSize: 13 }}
              >
                {s2aResult.value}
              </span>
              {s2aResult.ok && <span className="preview-box-unit">USDC</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
