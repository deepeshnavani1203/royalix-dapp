import '../styles/vault.css';

const MOCKUSDC_ADDR = import.meta.env.VITE_MOCKUSDC_ADDRESS || 'Not configured';
const VAULT_ADDR    = import.meta.env.VITE_VAULT_ADDRESS    || 'Not configured';

const short = (a) => (a && a.length > 10) ? `${a.slice(0, 10)}…${a.slice(-6)}` : a;

export const VaultLandingPage = ({ wallet }) => {
  const { connect, loading, error, isMetaMaskAvailable } = wallet;

  return (
    <div className="vault-app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <header className="vault-header">
        <div className="vault-logo">
          <div className="vault-logo-badge">S</div>
          StudentVault
        </div>
        <div className="vault-header-center">
          <div className="vault-network-pill">
            <span className="vault-network-dot" />
            Ethereum Sepolia
          </div>
        </div>
        <div className="vault-header-right">
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '9px 20px', fontSize: 13 }}
            onClick={connect}
            disabled={loading || !isMetaMaskAvailable}
          >
            {loading
              ? <><span className="spinner" style={{ borderTopColor: '#0b0b0d' }} /> Connecting…</>
              : !isMetaMaskAvailable
                ? '🦊 Install MetaMask'
                : '🦊 Connect MetaMask'}
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <main style={{ flex: 1 }}>
        <div style={{
          width: 'min(1280px, 92%)',
          margin: '0 auto',
          padding: '80px 0 60px',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}>

          {/* Left copy */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              background: 'rgba(99,91,255,.1)',
              border: '1px solid rgba(99,91,255,.2)',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#a5b4fc',
              marginBottom: 28,
              textTransform: 'uppercase',
            }}>
              ERC-4626 · ERC-20 · Sepolia
            </div>

            <h1 style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-2px',
              margin: '0 0 24px',
              color: '#f4f4f5',
            }}>
              Deploying &<br />
              <span style={{ color: '#635bff' }}>Interacting</span><br />
              with ERC-4626
            </h1>

            <p style={{
              fontSize: 15,
              color: '#71717a',
              lineHeight: 1.8,
              maxWidth: 520,
              margin: '0 0 40px',
            }}>
              A hands-on practical demonstrating the full lifecycle of an
              ERC-4626 tokenised vault — from minting USDC to depositing,
              converting, and redeeming vault shares on Ethereum Sepolia.
            </p>

            {error && (
              <div className="alert alert-error" style={{ maxWidth: 480, marginBottom: 24 }}>
                <span className="alert-icon">❌</span>
                <span>{error}</span>
              </div>
            )}

            {!isMetaMaskAvailable && (
              <div className="alert alert-info" style={{ maxWidth: 480, marginBottom: 24 }}>
                <span className="alert-icon">🦊</span>
                <span>
                  MetaMask is not installed.{' '}
                  <a href="https://metamask.io/download" target="_blank" rel="noopener noreferrer"
                     style={{ color: '#93c5fd' }}>
                    Install it here ↗
                  </a>
                </span>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: 'auto', padding: '14px 32px', fontSize: 15 }}
              onClick={connect}
              disabled={loading || !isMetaMaskAvailable}
            >
              {loading
                ? <><span className="spinner" style={{ borderTopColor: '#0b0b0d' }} /> Connecting…</>
                : '🦊 Connect MetaMask to Start'}
            </button>

            {/* Flow preview */}
            <div style={{ marginTop: 36, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Mint USDC', 'Approve', 'Deposit', 'Shares', 'Withdraw', 'Redeem'].map((step, i) => (
                <span key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: '#52525b',
                }}>
                  <span style={{
                    padding: '3px 10px',
                    background: '#111114',
                    border: '1px solid #1e1e24',
                    borderRadius: 6,
                    color: '#71717a',
                  }}>{step}</span>
                  {i < 5 && <span style={{ color: '#2a2a32' }}>→</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Right info card */}
          <div>
            {/* Contract card */}
            <div className="vcard" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', color: '#52525b', textTransform: 'uppercase', marginBottom: 16 }}>
                Deployed Contracts · Sepolia
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <ContractRow label="🪙 MockUSDC" addr={MOCKUSDC_ADDR} />
                <ContractRow label="🏦 StudentVault" addr={VAULT_ADDR} />
              </div>

              <div style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop: '1px solid #1e1e24',
                fontSize: 12,
                color: '#65d68a',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#65d68a', display: 'inline-block' }} />
                Live on Ethereum Sepolia Testnet
              </div>
            </div>

            {/* Standards card */}
            <div className="vcard" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', color: '#52525b', textTransform: 'uppercase', marginBottom: 14 }}>
                Standards Used
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['ERC-20',   'MockUSDC underlying asset token'],
                  ['ERC-4626', 'Tokenised vault standard'],
                  ['Ethers v6','Web3 provider & signer'],
                  ['MetaMask', 'Browser wallet connection'],
                ].map(([badge, desc]) => (
                  <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                    <span style={{
                      padding: '2px 8px',
                      background: '#1a1a28',
                      border: '1px solid #2e2e50',
                      borderRadius: 5,
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#818cf8',
                      whiteSpace: 'nowrap',
                    }}>{badge}</span>
                    <span style={{ color: '#71717a', fontSize: 12 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="vault-footer">
        <span>
          <strong style={{ color: '#d4d4d8' }}>StudentVault</strong> — ERC-4626 Practical
        </span>
        <span>Ethereum Sepolia Testnet · Built with React + Ethers.js v6</span>
      </footer>

    </div>
  );
};

// ── small helper ─────────────────────────────────────────
const ContractRow = ({ label, addr }) => (
  <div style={{
    background: '#0d0d10',
    border: '1px solid #1e1e24',
    borderRadius: 10,
    padding: '12px 14px',
  }}>
    <div style={{ fontSize: 11, color: '#52525b', marginBottom: 4 }}>{label}</div>
    <a
      href={`https://sepolia.etherscan.io/address/${addr}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontSize: 12, fontFamily: 'Courier New, monospace', color: '#93c5fd', textDecoration: 'none', wordBreak: 'break-all' }}
    >
      {addr}
    </a>
  </div>
);
