import { useState, useEffect, useCallback } from 'react';
import { formatEther } from 'ethers';
import {
  getContractBalance,
  getRoyaltyCount,
  getContractOwner,
  formatAddress,
} from '../../services/contractService';

export const ContractStatsPanel = ({ provider }) => {
  const [stats, setStats] = useState({
    walletBalance: null,
    contractBalance: null,
    royaltyCount: null,
    owner: null,
    walletAddress: null,
    loading: true,
    error: '',
  });

  const fetchStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: '' }));

      // Get wallet balance
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      const balanceWei = await provider.getBalance(walletAddress);
      const walletBalance = formatEther(balanceWei);

      // Get contract stats
      const [contractBalance, count, owner] = await Promise.all([
        getContractBalance(provider),
        getRoyaltyCount(provider),
        getContractOwner(provider),
      ]);

      setStats({
        walletBalance,
        contractBalance,
        royaltyCount: count,
        owner,
        walletAddress,
        loading: false,
        error: '',
      });
    } catch (error) {
      console.error('Fetch stats error:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch stats',
      }));
    }
  }, [provider]);

  useEffect(() => {
    void fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>📊 Contract Statistics</h2>
        <span className="panel-icon">📈</span>
      </div>

      <p className="panel-description">
        Real-time statistics from your RoyaliX smart contract on Ethereum Sepolia.
      </p>

      {stats.error && stats.owner !== null && (
        <div className="message error">{stats.error}</div>
      )}

      {stats.loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 10px' }}></div>
          <p style={{ color: '#a0a0b0' }}>Loading live wallet & contract data...</p>
        </div>
      ) : stats.owner === null ? (
        <div className="empty-state">
          <strong>Contract data unavailable</strong>
          <span>{stats.error || 'No response was received from the contract.'}</span>
          <button className="subtle-action" onClick={fetchStats}>
            Retry contract read
          </button>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">💳 Your Wallet Balance</div>
              <div className="stat-value" style={{ color: '#86efac' }}>
                {parseFloat(stats.walletBalance).toFixed(6)} ETH
              </div>
              <div style={{ fontSize: '11px', color: '#707080', marginTop: '8px' }}>
                Sepolia Test ETH
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">🏦 Contract Balance</div>
              <div className="stat-value">{parseFloat(stats.contractBalance).toFixed(4)} ETH</div>
              <div style={{ fontSize: '11px', color: '#707080', marginTop: '8px' }}>
                Total in contract
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">📊 Royalties Created</div>
              <div className="stat-value">{stats.royaltyCount}</div>
              <div style={{ fontSize: '11px', color: '#707080', marginTop: '8px' }}>
                Total records
              </div>
            </div>
          </div>

          <div className="data-display" style={{ marginTop: '24px' }}>
            <div className="data-row">
              <span className="data-label">Your Wallet Address</span>
              <span className="data-value" style={{ fontSize: '12px' }}>
                {formatAddress(stats.walletAddress)}
              </span>
            </div>

            <div className="data-row">
              <span className="data-label">Contract Address</span>
              <span className="data-value" style={{ fontSize: '12px' }}>
                {formatAddress(import.meta.env.VITE_CONTRACT_ADDRESS)}
              </span>
            </div>

            <div className="data-row">
              <span className="data-label">Contract Owner</span>
              <span className="data-value" style={{ fontSize: '12px' }}>
                {formatAddress(stats.owner)}
              </span>
            </div>

            <div className="data-row">
              <span className="data-label">Network</span>
              <span className="data-value">Sepolia (0xaa36a7)</span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={fetchStats}
            style={{ marginTop: '20px' }}
          >
            🔄 Refresh Stats
          </button>

          <div className="info-box" style={{ marginTop: '24px' }}>
            <p>
              💡 <strong>Your Balance:</strong> This is your Sepolia account balance. You can
              use this to pay gas fees and send revenue to the contract.
            </p>
            <p>
              <strong>Contract Balance:</strong> This is the total ETH held by the RoyaliX
              contract, waiting to be distributed.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>View on Explorer:</strong>{' '}
              <a
                href={`https://sepolia.etherscan.io/address/${stats.walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00d4ff', textDecoration: 'none' }}
              >
                View Your Wallet →
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
