import { useState } from 'react';
import { CreateRoyaltyPanel }   from './panels/CreateRoyaltyPanel';
import { AddRevenuePanel }      from './panels/AddRevenuePanel';
import { ViewRoyaltyPanel }     from './panels/ViewRoyaltyPanel';
import { DistributeRoyaltyPanel } from './panels/DistributeRoyaltyPanel';
import { ContractStatsPanel }   from './panels/ContractStatsPanel';
import '../styles/dashboard.css';

const short = (addr) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

export const Dashboard = ({ wallet, onDisconnect }) => {
  const [activeTab, setActiveTab] = useState('stats');

  const tabs = [
    { id: 'stats',      label: '📊 Stats'        },
    { id: 'create',     label: '➕ Create Royalty' },
    { id: 'revenue',    label: '💰 Add Revenue'   },
    { id: 'view',       label: '👁 View Royalty'  },
    { id: 'distribute', label: '📤 Distribute'    },
  ];

  return (
    <div className="dashboard-container">

      {/* ── HEADER ── */}
      <header className="dashboard-header">
        <div className="logo-small">
          <span style={{
            width: 30, height: 30, background: '#f4f4f5', color: '#0b0b0d',
            borderRadius: 8, display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700
          }}>R</span>
          RoyaliX
        </div>

        <div className="network-badge">
          <span className="network-dot" />
          Sepolia Testnet
        </div>

        <div className="wallet-info">
          <span className="wallet-address">{short(wallet.address)}</span>
          <button className="disconnect-btn" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="dashboard-main">
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
          {activeTab === 'stats'      && <ContractStatsPanel    provider={wallet.provider} />}
          {activeTab === 'create'     && <CreateRoyaltyPanel    provider={wallet.provider} />}
          {activeTab === 'revenue'    && <AddRevenuePanel       provider={wallet.provider} />}
          {activeTab === 'view'       && <ViewRoyaltyPanel      provider={wallet.provider} />}
          {activeTab === 'distribute' && <DistributeRoyaltyPanel provider={wallet.provider} />}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="dashboard-footer">
        <p>© 2025 RoyaliX — Decentralized Royalty Distribution on Sepolia</p>
      </footer>

    </div>
  );
};
