import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreateRoyaltyPanel }   from './panels/CreateRoyaltyPanel';
import { AddRevenuePanel }      from './panels/AddRevenuePanel';
import { ViewRoyaltyPanel }     from './panels/ViewRoyaltyPanel';
import { DistributeRoyaltyPanel } from './panels/DistributeRoyaltyPanel';
import { ContractStatsPanel }   from './panels/ContractStatsPanel';
import { RoyaltyListPanel } from './panels/RoyaltyListPanel';
import '../styles/dashboard.css';

const short = (addr) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

export const Dashboard = ({ wallet, onDisconnect, onBack }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [refreshTick, setRefreshTick] = useState(0);
  const refreshAfterTransaction = () => setRefreshTick((tick) => tick + 1);

  const tabs = [
    { id: 'stats',      label: '📊 Stats'        },
    { id: 'agreements', label: '◇ Agreements' },
    { id: 'create',     label: '➕ Create Royalty' },
    { id: 'revenue',    label: '💰 Add Revenue'   },
    { id: 'view',       label: '👁 View Royalty'  },
    { id: 'distribute', label: '📤 Distribute'    },
  ];

  return (
    <div className="dashboard-container royalix-dashboard">

      {/* ── HEADER ── */}
      <header className="dashboard-header">
        <div className="dashboard-brand-group">
          <button className="back-link" onClick={onBack}>← Home</button>
          <Link className="logo-small dashboard-brand" to="/">
            <span className="brand-mark">R</span>
            RoyaliX
            <span className="dashboard-brand-caption">ROYALTY PROTOCOL</span>
          </Link>
        </div>

        <div className={`network-badge${wallet.isSepolia ? '' : ' network-badge-wrong'}`}>
          <span className="network-dot" />
          {wallet.isSepolia ? 'Sepolia · 11155111' : 'Wrong network'}
        </div>

        <div className="wallet-info">
          <span className="dashboard-wallet-type">MetaMask</span>
          <span className="wallet-address">{short(wallet.address)}</span>
          <button className="disconnect-btn" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="dashboard-main">
        {!wallet.isSepolia && (
          <div className="message error network-warning">
            Wallet network changed. Switch MetaMask to Sepolia (chain ID
            11155111) before reading or submitting RoyaliX contract operations.
            <button
              className="network-switch-action"
              type="button"
              onClick={wallet.connectMM}
              disabled={wallet.loading}
            >
              {wallet.loading ? "Requesting…" : "Switch to Sepolia"}
            </button>
          </div>
        )}
        <section className="royalix-dashboard-intro">
          <div>
            <span className="section-kicker">ROYALIX · MAIN PROJECT</span>
            <h1>Royalty control center</h1>
            <p>
              Transparent agreements and programmable revenue distribution,
              read directly from the Sepolia smart contract.
            </p>
          </div>
          <div className="contract-live-badge">
            <span className="network-dot" />
            LIVE CONTRACT DATA
          </div>
        </section>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {activeTab === 'stats' && (
            <ContractStatsPanel
              key={`stats-${refreshTick}`}
              provider={wallet.provider}
            />
          )}
          {activeTab === 'agreements' && (
            <RoyaltyListPanel
              provider={wallet.provider}
              refreshTrigger={refreshTick}
            />
          )}
          {activeTab === 'create' && (
            <CreateRoyaltyPanel
              provider={wallet.provider}
              onTransactionConfirmed={refreshAfterTransaction}
            />
          )}
          {activeTab === 'revenue' && (
            <AddRevenuePanel
              provider={wallet.provider}
              onTransactionConfirmed={refreshAfterTransaction}
            />
          )}
          {activeTab === 'view' && <ViewRoyaltyPanel provider={wallet.provider} />}
          {activeTab === 'distribute' && (
            <DistributeRoyaltyPanel
              provider={wallet.provider}
              onTransactionConfirmed={refreshAfterTransaction}
            />
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="dashboard-footer">
        <p>RoyaliX · Decentralized royalty distribution · Sepolia testnet</p>
      </footer>

    </div>
  );
};
