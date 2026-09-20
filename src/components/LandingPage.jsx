import { useState } from 'react';

export const LandingPage = ({ isLoggedIn, onLogin, wallet }) => {
  const { connect, isMetaMaskAvailable, loading, error } = wallet;

  const [showModal, setShowModal]   = useState(false);
  const [email, setEmail]           = useState('haha@gmail.com');
  const [password, setPassword]     = useState('123456');
  const [formError, setFormError]   = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password)      { setFormError('Email aur password dono dalo'); return; }
    if (!email.includes('@'))     { setFormError('Valid email dalo'); return; }
    if (password.length < 6)      { setFormError('Password 6+ chars ka hona chahiye'); return; }
    localStorage.setItem('royalix_user', JSON.stringify({ email }));
    setShowModal(false);
    onLogin();
  };

  const handleWalletClick = (type) => {
    if (!isLoggedIn) {
      setShowModal(true); // force login first
      return;
    }
    connect(type);
  };

  return (
    <div className="app">

      {/* ══════ NAVBAR ══════ */}
      <nav className="navbar">
        <div className="logo">
          <span>R</span>
          RoyaliX
        </div>

        <span className="network">
          <span className="dot" />
          Sepolia Testnet
        </span>

        {/* Right side buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* MetaMask */}
          <button
            className="connect-btn"
            style={!isLoggedIn ? disabledStyle : {}}
            onClick={() => handleWalletClick('metamask')}
            disabled={loading || (isLoggedIn && !isMetaMaskAvailable)}
            title={!isLoggedIn ? 'Pehle login karo' : ''}
          >
            {loading ? 'Connecting…' : '🦊 MetaMask'}
          </button>

          {/* WalletConnect */}
          <button
            className="connect-btn"
            style={!isLoggedIn ? { ...disabledStyle, background: '#18181b', border: '1px solid #333338', color: '#71717a' } : { background: '#18181b', border: '1px solid #333338', color: '#f4f4f5' }}
            onClick={() => handleWalletClick('walletconnect')}
            disabled={loading}
            title={!isLoggedIn ? 'Pehle login karo' : ''}
          >
            {loading ? '…' : '🔗 WalletConnect'}
          </button>

          {/* Login button – hide after logged in */}
          {!isLoggedIn ? (
            <button
              className="connect-btn"
              style={{ background: '#18181b', border: '1px solid #333338', color: '#f4f4f5' }}
              onClick={() => setShowModal(true)}
            >
              Login
            </button>
          ) : (
            <div className="account" style={{ fontSize: 12 }}>
              ✅ Logged in
            </div>
          )}
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <div className="container">
        <section className="hero">
          <div>
            <p className="tag">DECENTRALISED · TRANSPARENT · ON-CHAIN</p>
            <h1>
              Royalty<br />
              <span>Distribution</span><br />
              Protocol
            </h1>
            <p className="subtitle">
              RoyaliX lets creators manage and distribute royalty revenue
              transparently on the Ethereum blockchain — no middlemen, no fees.
            </p>

            {error && (
              <div className="message" style={{ marginTop: 20, color: '#ff8080', borderColor: '#5c2020', background: '#1a0e0e' }}>
                ❌ {error}
              </div>
            )}

            {!isLoggedIn ? (
              <p style={{ color: '#71717a', fontSize: 13, marginTop: 22 }}>
                🔒 Login karo upar se, phir wallet connect karo
              </p>
            ) : (
              <p style={{ color: '#65d68a', fontSize: 13, marginTop: 22 }}>
                ✅ Logged in! Ab header se wallet connect karo
              </p>
            )}
          </div>

          {/* Info card */}
          <div className="hero-card">
            <p className="card-label">CONTRACT ADDRESS</p>
            <p className="contract-address">
              {import.meta.env.VITE_CONTRACT_ADDRESS}
            </p>
            <p className="verified">✓ Deployed on Sepolia</p>

            <div style={{ marginTop: 22, borderTop: '1px solid #2b2b30', paddingTop: 18 }}>
              <p className="card-label">HOW IT WORKS</p>
              <p style={{ color: '#a1a1aa', fontSize: 12, margin: '0 0 8px', lineHeight: 1.6 }}>
                1. Login → 2. Connect Wallet → 3. Create Royalty → 4. Add Revenue → 5. Distribute
              </p>
            </div>

            <div style={{ marginTop: 16, borderTop: '1px solid #2b2b30', paddingTop: 16 }}>
              <p className="card-label">STATUS</p>
              {!isLoggedIn
                ? <p style={{ color: '#a1a1aa', fontSize: 13, margin: 0 }}>🔒 Login required</p>
                : <p style={{ color: '#65d68a', fontSize: 13, margin: 0 }}>✓ Logged in — connect wallet</p>
              }
            </div>
          </div>
        </section>
      </div>

      {/* ══════ FOOTER ══════ */}
      <footer style={{ padding: '0 7%' }}>
        <span><span style={{ color: '#d4d4d8', fontWeight: 700 }}>RoyaliX</span></span>
        <span>© 2025 — College Project on Sepolia</span>
        <span>
          <a
            href={`https://sepolia.etherscan.io/address/${import.meta.env.VITE_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#66666e', textDecoration: 'none' }}
          >
            View on Etherscan ↗
          </a>
        </span>
      </footer>

      {/* ══════ LOGIN MODAL ══════ */}
      {showModal && (
        <div style={overlay} onClick={() => setShowModal(false)}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button style={closeBtn} onClick={() => setShowModal(false)}>✕</button>

            <h2 style={{ margin: '0 0 6px', fontSize: 22, color: '#f4f4f5' }}>Login</h2>
            <p style={{ margin: '0 0 24px', color: '#71717a', fontSize: 13 }}>
              Apna account se login karo
            </p>

            {formError && (
              <div style={{ background: '#1a0e0e', border: '1px solid #5c2020', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#ff8080', fontSize: 13 }}>
                ❌ {formError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: '#71717a', marginBottom: 7, fontWeight: 600, letterSpacing: '0.5px' }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: '#71717a', marginBottom: 7, fontWeight: 600, letterSpacing: '0.5px' }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button type="submit" className="connect-btn" style={{ width: '100%', padding: '13px', fontSize: 14, borderRadius: 9 }}>
                Login
              </button>
            </form>

            <p style={{ textAlign: 'center', color: '#555', fontSize: 11, marginTop: 14, marginBottom: 0 }}>
              Demo: koi bhi email + 6+ char password
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

/* ── Modal styles ── */
const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
};

const modal = {
  background: '#111114',
  border: '1px solid #29292e',
  borderRadius: 16,
  padding: '32px 28px 28px',
  width: '100%',
  maxWidth: 380,
  position: 'relative',
};

const closeBtn = {
  position: 'absolute',
  top: 14,
  right: 14,
  background: 'transparent',
  border: 'none',
  color: '#71717a',
  fontSize: 16,
  cursor: 'pointer',
  lineHeight: 1,
  padding: 4,
};

const inputStyle = {
  width: '100%',
  padding: '11px 13px',
  background: '#0b0b0d',
  border: '1px solid #303036',
  borderRadius: 9,
  color: '#f4f4f5',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const disabledStyle = {
  opacity: 0.4,
  cursor: 'not-allowed',
};
