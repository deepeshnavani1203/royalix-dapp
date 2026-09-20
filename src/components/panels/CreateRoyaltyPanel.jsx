import { useState } from 'react';
import { createRoyalty } from '../../services/contractService';

export const CreateRoyaltyPanel = ({ provider }) => {
  const [creatorShare, setCreatorShare] = useState('80');
  const [platformShare, setPlatformShare] = useState('20');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleCreateRoyalty = async () => {
    try {
      setMessage('');
      setTxHash('');

      // Validation
      const creator = parseFloat(creatorShare);
      const platform = parseFloat(platformShare);

      if (isNaN(creator) || isNaN(platform)) {
        setMessageType('error');
        setMessage('❌ Both values must be numbers');
        return;
      }

      if (creator + platform !== 100) {
        setMessageType('error');
        setMessage(`❌ Shares must equal 100% (currently ${creator + platform}%)`);
        return;
      }

      if (creator < 0 || platform < 0) {
        setMessageType('error');
        setMessage('❌ Shares cannot be negative');
        return;
      }

      setLoading(true);
      setMessageType('');
      setMessage('⏳ Requesting wallet confirmation...');

      // Call contract
      const tx = await createRoyalty(provider, creator, platform);
      setTxHash(tx.hash);
      setMessageType('pending');
      setMessage(`⏳ Transaction pending... ${tx.hash.slice(0, 10)}...`);

      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt) {
        setMessageType('success');
        setMessage(`✅ Royalty created! Hash: ${tx.hash.slice(0, 20)}...`);
        setCreatorShare('80');
        setPlatformShare('20');
      }
    } catch (error) {
      console.error('Create royalty error:', error);
      setMessageType('error');
      
      if (error.code === 'ACTION_REJECTED') {
        setMessage('❌ Transaction rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        setMessage('❌ Insufficient ETH for gas fees');
      } else {
        setMessage(`❌ Error: ${error.message.slice(0, 100)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>➕ Create Royalty</h2>
        <span className="panel-icon">📝</span>
      </div>

      <p className="panel-description">
        Set the revenue split between the creator and platform. The shares must
        add up to exactly 100%.
      </p>

      <div className="form-row">
        <div className="form-group">
          <label>Creator Share (%)</label>
          <input
            type="number"
            className="form-input"
            value={creatorShare}
            onChange={(e) => setCreatorShare(e.target.value)}
            min="0"
            max="100"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Platform Share (%)</label>
          <input
            type="number"
            className="form-input"
            value={platformShare}
            onChange={(e) => setPlatformShare(e.target.value)}
            min="0"
            max="100"
            disabled={loading}
          />
        </div>
      </div>

      <div className="data-display">
        <div className="data-row">
          <span className="data-label">Total Split</span>
          <span className="data-value">
            {parseFloat(creatorShare) + parseFloat(platformShare)}%
          </span>
        </div>
        <div className="data-row">
          <span className="data-label">Status</span>
          <span
            className="data-value"
            style={{
              color:
                parseFloat(creatorShare) + parseFloat(platformShare) === 100
                  ? '#86efac'
                  : '#fca5a5',
            }}
          >
            {parseFloat(creatorShare) + parseFloat(platformShare) === 100
              ? '✓ Valid'
              : '✗ Invalid'}
          </span>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleCreateRoyalty}
        disabled={loading || parseFloat(creatorShare) + parseFloat(platformShare) !== 100}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span> Creating...
          </>
        ) : (
          <>Create Royalty →</>
        )}
      </button>

      {message && <div className={`message ${messageType}`}>{message}</div>}
    </div>
  );
};
