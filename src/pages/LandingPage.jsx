import { Link } from 'react-router-dom';
import '../styles/landing.css';

export const LandingPage = () => {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">RoyaliX</span>
          </div>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><Link to="/login" className="nav-cta">Get Started</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Decentralized Royalty & Revenue Distribution
          </h1>
          <p className="hero-subtitle">
            Manage creator revenue, define royalty shares, and distribute earnings 
            seamlessly through the RoyaliX platform powered by blockchain.
          </p>
          <div className="hero-cta">
            <Link to="/login" className="btn btn-primary">
              Start Now
              <span className="arrow">→</span>
            </Link>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <div className="card-content">
              <p className="card-label">REAL-TIME</p>
              <h3>Revenue Distribution</h3>
              <p className="card-desc">Powered by Ethereum Smart Contracts</p>
              <div className="stats">
                <div className="stat">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Transparent</span>
                </div>
                <div className="stat">
                  <span className="stat-value">0%</span>
                  <span className="stat-label">Intermediaries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to manage royalties on-chain</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Create Royalty Records</h3>
            <p>
              Set up creator and platform revenue shares with complete transparency 
              on the blockchain.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Add Revenue</h3>
            <p>
              Deposit funds directly to royalty pools with instant blockchain verification 
              and zero delays.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <h3>View Details</h3>
            <p>
              Access complete royalty information including shares, revenue, and 
              distribution status in real-time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Auto Distribution</h3>
            <p>
              Smart contracts automatically calculate and distribute revenue to creators 
              and platform based on agreed percentages.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Blockchain Security</h3>
            <p>
              All transactions are secured by Ethereum Sepolia testnet with complete 
              immutability and transparency.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Efficient</h3>
            <p>
              Experience lightning-fast operations with minimal gas fees on the 
              Ethereum Sepolia network.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-content">
          <h2>Why RoyaliX?</h2>
          <div className="about-grid">
            <div className="about-item">
              <h4>🌐 Decentralized</h4>
              <p>
                No middlemen, no censorship. Control your royalty distribution completely.
              </p>
            </div>
            <div className="about-item">
              <h4>💎 Transparent</h4>
              <p>
                Every transaction is recorded on-chain. Complete audit trail forever.
              </p>
            </div>
            <div className="about-item">
              <h4>🚀 Scalable</h4>
              <p>
                Handle unlimited royalty records and distributions without bottlenecks.
              </p>
            </div>
            <div className="about-item">
              <h4>🛡️ Secure</h4>
              <p>
                Powered by Ethereum's proven security infrastructure and smart contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join creators and platforms using RoyaliX today</p>
          <Link to="/login" className="btn btn-primary btn-large">
            Access Dashboard
            <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>RoyaliX</h4>
            <p>Decentralized Royalty Distribution Platform</p>
          </div>
          <div className="footer-section">
            <h4>Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Network</h4>
            <p>Ethereum Sepolia Testnet</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 RoyaliX. College Project.</p>
        </div>
      </footer>
    </div>
  );
};
