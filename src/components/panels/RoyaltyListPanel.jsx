import { useCallback, useEffect, useState } from "react";
import { formatEther } from "ethers";
import {
  formatAddress,
  getAllRoyalties,
} from "../../services/contractService";

export const RoyaltyListPanel = ({ provider, refreshTrigger = 0 }) => {
  const [royalties, setRoyalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const records = await getAllRoyalties(provider);
      setRoyalties(records);
    } catch (readError) {
      setError(readError.message || "Could not load royalty agreements.");
    } finally {
      setLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    let current = true;
    const load = async () => {
      try {
        const records = await getAllRoyalties(provider);
        if (current) setRoyalties(records);
      } catch (readError) {
        if (current) {
          setError(readError.message || "Could not load royalty agreements.");
        }
      } finally {
        if (current) setLoading(false);
      }
    };
    void load();
    return () => {
      current = false;
    };
  }, [provider, refreshTrigger]);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="panel-number">ON-CHAIN RECORDS</p>
          <h2>Royalty agreements</h2>
        </div>
        <button
          className="subtle-action"
          type="button"
          onClick={refresh}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <p className="panel-description">
        Agreement details are read directly from this contract’s{" "}
        <code>royaltyCount()</code> and <code>getRoyalty()</code> functions.
      </p>

      {error && <div className="message error">{error}</div>}
      {loading ? (
        <div className="empty-state">
          <span className="loading-spinner" />
          <span>Reading agreements from Sepolia…</span>
        </div>
      ) : royalties.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">◇</span>
          <strong>No agreements found</strong>
          <span>Create the first agreement to see its live contract record here.</span>
        </div>
      ) : (
        <div className="agreement-list">
          {royalties.map((royalty) => (
            <article className="agreement-card" key={royalty.id}>
              <div className="agreement-card-head">
                <div>
                  <span className="agreement-id">AGREEMENT / {royalty.id}</span>
                  <h3>{formatAddress(royalty.creator)}</h3>
                </div>
                <span
                  className={`agreement-status${royalty.active ? "" : " inactive"}`}
                >
                  {royalty.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="agreement-metrics">
                <div>
                  <span>Creator share</span>
                  <strong>{royalty.creatorShare}%</strong>
                </div>
                <div>
                  <span>Platform share</span>
                  <strong>{royalty.platformShare}%</strong>
                </div>
                <div>
                  <span>Pending revenue</span>
                  <strong>{formatEther(royalty.totalRevenue)} ETH</strong>
                </div>
              </div>
              <div className="agreement-address">
                Creator <code>{royalty.creator}</code>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
