import { Link } from "react-router-dom";
import "../styles/home.css";

const destinations = [
  {
    number: "01",
    eyebrow: "WALLET BASICS",
    title: "MetaMask Integration",
    description:
      "Connect the browser extension, inspect your wallet address, and confirm the active Sepolia network.",
    route: "/experiment/metamask",
    action: "Open MetaMask experiment",
    icon: "↗",
    theme: "orange",
    tags: ["Browser wallet", "Ethers v6", "Sepolia"],
  },
  {
    number: "02",
    eyebrow: "EXTERNAL WALLET",
    title: "WalletConnect Integration",
    description:
      "Pair an external wallet through Reown AppKit and the WalletConnect QR session.",
    route: "/experiment/walletconnect",
    action: "Open WalletConnect experiment",
    icon: "⌁",
    theme: "blue",
    tags: ["WalletConnect v2", "QR pairing", "Reown"],
  },
  {
    number: "03",
    eyebrow: "MAIN PROJECT",
    title: "RoyaliX Platform",
    description:
      "Create royalty agreements, add ETH revenue, inspect live records, and distribute proceeds on-chain.",
    route: "/royalix",
    action: "Launch RoyaliX",
    icon: "✳",
    theme: "violet",
    tags: ["Royalty splits", "Revenue", "Smart contract"],
  },
];

export const HomePage = () => (
  <div className="home-shell">
    <header className="home-nav">
      <Link className="home-brand" to="/" aria-label="RoyaliX home">
        <span className="brand-mark">R</span>
        <span>royalix</span>
        <span className="brand-type">WEB3 LAB</span>
      </Link>
      <nav className="home-nav-links" aria-label="Main navigation">
        <a href="#experiments">Experiments</a>
        <Link to="/royalix">Main project</Link>
      </nav>
      <div className="home-network">
        <span className="home-network-dot" />
        Sepolia testnet
      </div>
    </header>

    <main className="home-main">
      <section className="home-hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="kicker-line" />
            DECENTRALIZED ROYALTY INFRASTRUCTURE
          </div>
          <h1>
            Fair value flows,
            <br />
            <span>built on-chain.</span>
          </h1>
          <p>
            RoyaliX is a royalty and revenue distribution platform. Explore
            wallet integrations, then manage agreements transparently on
            Ethereum Sepolia.
          </p>
          <div className="hero-actions">
            <Link className="home-primary-action" to="/royalix">
              Enter RoyaliX <span aria-hidden="true">↗</span>
            </Link>
            <a className="home-text-action" href="#experiments">
              Explore experiments <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Royalty distribution overview">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-orb">
            <span>R</span>
            <small>ROYALIX</small>
          </div>
          <div className="flow-chip creator-chip">
            <span className="flow-dot creator-dot" />
            <span>
              CREATOR <b>80%</b>
            </span>
          </div>
          <div className="flow-chip platform-chip">
            <span className="flow-dot platform-dot" />
            <span>
              PLATFORM <b>20%</b>
            </span>
          </div>
          <div className="visual-caption">
            <span>01 / 02</span>
            programmable revenue splits
          </div>
        </div>
      </section>

      <section className="home-stats" aria-label="Project details">
        <div>
          <span className="stat-overline">NETWORK</span>
          <strong>Ethereum Sepolia</strong>
        </div>
        <div>
          <span className="stat-overline">CHAIN ID</span>
          <strong>11155111</strong>
        </div>
        <div>
          <span className="stat-overline">PLATFORM</span>
          <strong>React · Ethers.js · Solidity</strong>
        </div>
        <div>
          <span className="stat-overline">ACCESS</span>
          <strong>Testnet only</strong>
        </div>
      </section>

      <section id="experiments" className="destination-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">LEARN · CONNECT · BUILD</span>
            <h2>Choose your destination</h2>
          </div>
          <p>
            Three focused experiences, one clear path from wallet connection
            to on-chain royalty management.
          </p>
        </div>

        <div className="destination-grid">
          {destinations.map((destination) => (
            <article
              className={`destination-card ${destination.theme}`}
              key={destination.number}
            >
              <div className="destination-topline">
                <span className="destination-number">{destination.number}</span>
                <span className="destination-icon" aria-hidden="true">
                  {destination.icon}
                </span>
              </div>
              <span className="destination-eyebrow">{destination.eyebrow}</span>
              <h3>{destination.title}</h3>
              <p>{destination.description}</p>
              <div className="destination-tags">
                {destination.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <Link className="destination-link" to={destination.route}>
                {destination.action}
                <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>

    <footer className="home-footer">
      <Link className="footer-brand" to="/">
        <span className="brand-mark">R</span> RoyaliX
      </Link>
      <span>Decentralized Royalty &amp; Revenue Distribution</span>
      <span className="footer-testnet">
        <span className="home-network-dot" /> TESTNET ENVIRONMENT
      </span>
    </footer>
  </div>
);
