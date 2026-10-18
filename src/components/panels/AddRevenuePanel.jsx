import { useState } from 'react';
import { addRevenue } from '../../services/contractService';

export const AddRevenuePanel = ({ provider, onTransactionConfirmed }) => {
  const [royaltyId, setRoyaltyId] = useState('');
  const [revenueAmount, setRevenueAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleAddRevenue = async () => {
    try {
      setMessage('');

      // Validation
      const id = Number(royaltyId);
      const amount = Number(revenueAmount);

      if (!Number.isInteger(id) || id < 0) {
        setMessageType('error');
        setMessage('❌ Royalty ID must be a valid number');
        return;
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        setMessageType('error');
        setMessage('❌ Revenue amount must be a positive number');
        return;
      }

      setLoading(true);
      setMessageType('');
      setMessage(`⏳ Requesting wallet confirmation to send ${amount} ETH...`);

      // Call contract
      const tx = await addRevenue(provider, id, amount);
      setMessageType('pending');
      setMessage(`⏳ Transaction pending... ${tx.hash.slice(0, 10)}...`);

      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt) {
        setMessageType('success');
        setMessage(
          `✅ Revenue added! Sent ${amount} ETH to Royalty #${id}. Hash: ${tx.hash.slice(0, 20)}...`
        );
        setRoyaltyId('');
        setRevenueAmount('');
        onTransactionConfirmed?.();
      }
    } catch (error) {
      console.error('Add revenue error:', error);
      setMessageType('error');
      
      if (error.code === 'ACTION_REJECTED') {
        setMessage('❌ Transaction rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        setMessage('❌ Insufficient ETH balance (need gas + revenue amount)');
      } else if (error.message.includes('Invalid royalty')) {
        setMessage('❌ Royalty ID does not exist');
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
        <h2>💰 Add Revenue</h2>
        <span className="panel-icon">💳</span>
      </div>

      <p className="panel-description">
        Send ETH to a specific royalty. This is a payable transaction that adds
        funds to the contract for distribution.
      </p>

      <div className="form-group">
        <label>Royalty ID</label>
        <input
          type="number"
          className="form-input"
          placeholder="e.g., 1"
          value={royaltyId}
          onChange={(e) => setRoyaltyId(e.target.value)}
          min="0"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Revenue Amount (ETH)</label>
        <input
          type="number"
          className="form-input"
          placeholder="e.g., 0.01"
          value={revenueAmount}
          onChange={(e) => setRevenueAmount(e.target.value)}
          step="0.001"
          min="0"
          disabled={loading}
        />
      </div>

      <div className="data-display">
        <div className="data-row">
          <span className="data-label">Amount to Send</span>
          <span className="data-value">
            {revenueAmount ? `${revenueAmount} ETH` : '0 ETH'}
          </span>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleAddRevenue}
        disabled={loading || !royaltyId || !revenueAmount}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span> Processing...
          </>
        ) : (
          <>Send ETH →</>
        )}
      </button>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <div className="info-box" style={{ marginTop: '24px' }}>
        <p>
          💡 <strong>How it works:</strong> You send ETH to this royalty ID.
          The contract stores it, and later you can distribute it between
          creator and platform based on the split percentages.
        </p>
      </div>
    </div>
  );
};
