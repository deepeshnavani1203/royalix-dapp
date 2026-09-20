import { useState } from 'react';
import { distributeRoyalty, getRoyalty, formatAddress } from '../../services/contractService';

export const DistributeRoyaltyPanel = ({ provider }) => {
  const [royaltyId, setRoyaltyId] = useState('');
  const [royaltyData, setRoyaltyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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

  const handleFetchForDistribution = async () => {
    try {
      setMessage('');
      setRoyaltyData(null);

      const id = parseInt(royaltyId);
      if (isNaN(id) || id < 0) {
        setMessageType('error');
        setMessage('❌ Royalty ID must be a valid number');
        return;
      }

      setLoading(true);
      setMessageType('');
      setMessage('🔍 Fetching royalty preview...');

      const data = await getRoyalty(provider, id);
      
      const creatorAmount = (BigInt(data.totalRevenue) * BigInt(data.creatorShare)) / BigInt(100);
      const platformAmount = (BigInt(data.totalRevenue) * BigInt(data.platformShare)) / BigInt(100);

      setRoyaltyData({
        id,
        creator: data.creator,
        totalRevenue: data.totalRevenue,
        creatorShare: data.creatorShare,
        platformShare: data.platformShare,
        active: data.active,
        creatorAmount,
        platformAmount,
      });

      setMessageType('success');
      setMessage('✅ Ready to distribute');
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessageType('error');
      setLoading(false);
      
      if (error.message.includes('call revert')) {
        setMessage('❌ Royalty ID does not exist');
      } else {
        setMessage(`❌ Error: ${error.message.slice(0, 100)}`);
      }
    }
  };

  const handleDistribute = async () => {
    try {
      if (!royaltyData) {
        setMessageType('error');
        setMessage('❌ Fetch royalty first');
        return;
      }

      if (BigInt(royaltyData.totalRevenue) === BigInt(0)) {
        setMessageType('error');
        setMessage('❌ No revenue to distribute');
        return;
      }

      setDistributing(true);
      setMessageType('');
      setMessage('⏳ Requesting wallet confirmation...');

      // Call contract
      const tx = await distributeRoyalty(provider, royaltyData.id);
      setMessageType('pending');
      setMessage(`⏳ Transaction pending... ${tx.hash.slice(0, 10)}...`);

      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt) {
        setMessageType('success');
        setMessage(`✅ Distribution complete! Hash: ${tx.hash.slice(0, 20)}...`);
        setRoyaltyId('');
        setRoyaltyData(null);
      }
    } catch (error) {
      console.error('Distribute error:', error);
      setMessageType('error');
      
      if (error.code === 'ACTION_REJECTED') {
        setMessage('❌ Transaction rejected by user');
      } else if (error.message.includes('No revenue')) {
        setMessage('❌ No revenue available to distribute');
      } else {
        setMessage(`❌ Error: ${error.message.slice(0, 100)}`);
      }
    } finally {
      setDistributing(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>📤 Distribute Royalty</h2>
        <span className="panel-icon">💸</span>
      </div>

      <p className="panel-description">
        Distribute accumulated revenue to the creator and platform based on
        their configured share percentages.
      </p>

      <div className="form-group">
        <label>Royalty ID</label>
        <input
          type="number"
          className="form-input"
          placeholder="Enter royalty ID"
          value={royaltyId}
          onChange={(e) => setRoyaltyId(e.target.value)}
          min="0"
          disabled={loading || distributing}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleFetchForDistribution}
        disabled={loading || distributing || !royaltyId}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span> Loading...
          </>
        ) : (
          <>Preview Distribution →</>
        )}
      </button>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      {royaltyData && (
        <>
          <div className="data-display" style={{ marginTop: '24px' }}>
            <div className="data-row">
              <span className="data-label">Royalty ID</span>
              <span className="data-value">#{royaltyData.id}</span>
            </div>

            <div className="data-row">
              <span className="data-label">Creator Address</span>
              <span className="data-value" style={{ fontSize: '12px' }}>
                {formatAddress(royaltyData.creator)}
              </span>
            </div>

            <div className="data-row">
              <span className="data-label">Total Revenue</span>
              <span className="data-value">
                {formatWei(royaltyData.totalRevenue)} ETH
              </span>
            </div>

            <div className="data-row">
              <span className="data-label">Creator Share</span>
              <span className="data-value">{royaltyData.creatorShare}%</span>
            </div>

            <div className="data-row">
              <span className="data-label">Platform Share</span>
              <span className="data-value">{royaltyData.platformShare}%</span>
            </div>
          </div>

          <div
            className="data-display"
            style={{
              marginTop: '16px',
              background: 'rgba(0, 212, 255, 0.08)',
              borderColor: 'rgba(0, 212, 255, 0.3)',
            }}
          >
            <div className="data-row">
              <span className="data-label">→ Creator Receives</span>
              <span className="data-value" style={{ color: '#00d4ff' }}>
                {formatWei(royaltyData.creatorAmount)} ETH
              </span>
            </div>

            <div className="data-row">
              <span className="data-label">→ Platform Receives</span>
              <span className="data-value" style={{ color: '#00d4ff' }}>
                {formatWei(royaltyData.platformAmount)} ETH
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleDistribute}
            disabled={distributing || BigInt(royaltyData.totalRevenue) === BigInt(0)}
            style={{ marginTop: '20px' }}
          >
            {distributing ? (
              <>
                <span className="loading-spinner"></span> Distributing...
              </>
            ) : BigInt(royaltyData.totalRevenue) === BigInt(0) ? (
              <>No Revenue to Distribute</>
            ) : (
              <>Execute Distribution →</>
            )}
          </button>
        </>
      )}

      <div className="info-box" style={{ marginTop: '24px' }}>
        <p>
          💡 <strong>How it works:</strong> The smart contract will automatically
          transfer the creator's share to their address and the platform's share
          to the owner address. This is an atomic transaction.
        </p>
      </div>
    </div>
  );
};
