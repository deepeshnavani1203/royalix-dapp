import { useState } from 'react';
import { getRoyalty, formatAddress } from '../../services/contractService';

export const ViewRoyaltyPanel = ({ provider }) => {
  const [royaltyId, setRoyaltyId] = useState('');
  const [royalty, setRoyalty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFetchRoyalty = async () => {
    try {
      setMessage('');
      setRoyalty(null);

      // Validation
      const id = parseInt(royaltyId);
      if (isNaN(id) || id < 0) {
        setMessageType('error');
        setMessage('❌ Royalty ID must be a valid number');
        return;
      }

      setLoading(true);
      setMessageType('');
      setMessage('🔍 Fetching royalty data...');

      // Call contract
      const data = await getRoyalty(provider, id);
      
      setRoyalty({
        id,
        creator: data.creator,
        totalRevenue: data.totalRevenue,
        creatorShare: data.creatorShare,
        platformShare: data.platformShare,
        active: data.active,
      });

      setMessageType('success');
      setMessage('✅ Royalty data retrieved');
      setLoading(false);
    } catch (error) {
      console.error('Fetch royalty error:', error);
      setMessageType('error');
      setLoading(false);
      
      if (error.message.includes('call revert')) {
        setMessage('❌ Royalty ID does not exist');
      } else {
        setMessage(`❌ Error: ${error.message.slice(0, 100)}`);
      }
    }
  };

  // Format Wei to ETH
  const formatWei = (wei) => {
    try {
      const ethValue = BigInt(wei) / BigInt(10 ** 18);
      const remainder = BigInt(wei) % BigInt(10 ** 18);
      const decimals = remainder.toString().padStart(18, '0').slice(0, 4);
      return `${ethValue}.${decimals}`;
    } catch {
      return '0';
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>👁️ View Royalty</h2>
        <span className="panel-icon">🔍</span>
      </div>

      <p className="panel-description">
        Retrieve complete details about a royalty record from the blockchain.
        This is a read-only operation that doesn't require gas fees.
      </p>

      <div className="form-group">
        <label>Royalty ID</label>
        <input
          type="number"
          className="form-input"
          placeholder="Enter royalty ID to fetch"
          value={royaltyId}
          onChange={(e) => setRoyaltyId(e.target.value)}
          min="0"
          disabled={loading}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleFetchRoyalty}
        disabled={loading || !royaltyId}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span> Fetching...
          </>
        ) : (
          <>Fetch Royalty →</>
        )}
      </button>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      {royalty && (
        <div className="data-display" style={{ marginTop: '24px' }}>
          <div className="data-row">
            <span className="data-label">Royalty ID</span>
            <span className="data-value">#{royalty.id}</span>
          </div>

          <div className="data-row">
            <span className="data-label">Creator Address</span>
            <span className="data-value" style={{ fontSize: '12px' }}>
              {formatAddress(royalty.creator)}
            </span>
          </div>

          <div className="data-row">
            <span className="data-label">Total Revenue</span>
            <span className="data-value">{formatWei(royalty.totalRevenue)} ETH</span>
          </div>

          <div className="data-row">
            <span className="data-label">Creator Share</span>
            <span className="data-value">{royalty.creatorShare}%</span>
          </div>

          <div className="data-row">
            <span className="data-label">Platform Share</span>
            <span className="data-value">{royalty.platformShare}%</span>
          </div>

          <div className="data-row">
            <span className="data-label">Status</span>
            <span
              className="data-value"
              style={{ color: royalty.active ? '#86efac' : '#fca5a5' }}
            >
              {royalty.active ? '🟢 Active' : '🔴 Inactive'}
            </span>
          </div>

          <div
            className="data-row"
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span className="data-label">Creator Will Receive</span>
            <span className="data-value">
              {formatWei(
                (BigInt(royalty.totalRevenue) * BigInt(royalty.creatorShare)) /
                  BigInt(100)
              )}{' '}
              ETH
            </span>
          </div>

          <div className="data-row">
            <span className="data-label">Platform Will Receive</span>
            <span className="data-value">
              {formatWei(
                (BigInt(royalty.totalRevenue) * BigInt(royalty.platformShare)) /
                  BigInt(100)
              )}{' '}
              ETH
            </span>
          </div>
        </div>
      )}

      <div className="info-box" style={{ marginTop: '24px' }}>
        <p>
          💡 <strong>Note:</strong> This is a blockchain read operation. No gas
          fees are required. Data is fetched directly from the smart contract.
        </p>
      </div>
    </div>
  );
};
