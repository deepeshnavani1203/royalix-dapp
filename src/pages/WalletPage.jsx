import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserProvider } from 'ethers';
import '../styles/wallet.css';

export const WalletPage = ({ onWalletConnected }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const metamaskInstalled = typeof window !== 'undefined' && window.ethereum !== undefined;

  const handleMetaMaskConnect = async () => {
    setLoading(true);
    setError('');

    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed');
        setLoading(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Check current network (Sepolia is 0xaa36a7)
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if (chainId !== '0xaa36a7') {
        try {
          // Try to switch to Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            // Network not added, add it
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xaa36a7',
                  chainName: 'Ethereum Sepolia',
                  rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                },
              ],
            });
          }
        }
      }

      // Create provider
      const provider = new BrowserProvider(window.ethereum);
      
      // Store wallet info
      localStorage.setItem('walletAddress', accounts[0]);
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletProvider', 'metamask');

      onWalletConnected?.({
        address: accounts[0],
        provider,
        chainId,
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Connection error:', err);
      if (err.code === 4001) {
        setError('You rejected the connection request');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnectConnect = () => {
    setError('WalletConnect integration coming in next phase');
  };

  return (
    <div className="wallet-page">
      <div className="wallet-container">
        {/* Header */}
        <div className="wallet-header">
          <div className="header-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">RoyaliX</span>
          </div>
          <h1>Connect Your Wallet</h1>
          <p>Choose how you want to connect to the RoyaliX platform</p>
        </div>

        {/* Wallet Options */}
        <div className="wallet-options">
          {/* MetaMask Option */}
          <div className="wallet-option-card">
            <div className="wallet-header-top">
              <div className="wallet-icon-large">🦊</div>
              <h2>MetaMask</h2>
            </div>
            <p className="wallet-description">
              Connect using your MetaMask wallet. The most popular Ethereum wallet.
            </p>
            <ul className="wallet-features">
              <li>✓ Browser extension</li>
              <li>✓ Mobile app support</li>
              <li>✓ Most secure</li>
            </ul>
            <button
              onClick={handleMetaMaskConnect}
              disabled={loading || !metamaskInstalled}
              className="wallet-connect-btn metamask-btn"
              title={!metamaskInstalled ? 'MetaMask not detected' : ''}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Connecting...
                </>
              ) : metamaskInstalled ? (
                <>
                  <span className="btn-icon">🔗</span> Connect MetaMask
                </>
              ) : (
                <>
                  <span className="btn-icon">⚠️</span> MetaMask Not Detected
                </>
              )}
            </button>
            {!metamaskInstalled && (
              <p className="wallet-install">
                <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
                  Install MetaMask →
                </a>
              </p>
            )}
          </div>

          {/* WalletConnect Option */}
          <div className="wallet-option-card">
            <div className="wallet-header-top">
              <div className="wallet-icon-large">🌐</div>
              <h2>WalletConnect</h2>
            </div>
            <p className="wallet-description">
              Connect using any WalletConnect compatible wallet (Coinbase, Trust, etc).
            </p>
            <ul className="wallet-features">
              <li>✓ Multiple wallets</li>
              <li>✓ Mobile first</li>
              <li>✓ QR code scanning</li>
            </ul>
            <button
              onClick={handleWalletConnectConnect}
              disabled={true}
              className="wallet-connect-btn walletconnect-btn"
              title="Coming soon"
            >
              <span className="btn-icon">🔒</span> Coming Soon
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-container">
            <div className="error-card">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Network Info */}
        <div className="network-info">
          <h3>Network Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Network:</span>
              <span className="info-value">Ethereum Sepolia</span>
            </div>
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">Testnet</span>
            </div>
            <div className="info-item">
              <span className="info-label">Chain ID:</span>
              <span className="info-value">11155111</span>
            </div>
          </div>
          <div className="faucet-section">
            <p>Need test ETH?</p>
            <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="faucet-link">
              Get free Sepolia ETH →
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-items">
            <details className="faq-item">
              <summary>What is a wallet?</summary>
              <p>
                A wallet is a digital container that holds your cryptocurrency and allows you 
                to interact with blockchain applications. It's like a bank account for Web3.
              </p>
            </details>
            <details className="faq-item">
              <summary>Is it safe to connect my wallet?</summary>
              <p>
                Yes! Connecting your wallet only gives RoyaliX permission to read your address 
                and send transactions you approve. Your private keys never leave your wallet.
              </p>
            </details>
            <details className="faq-item">
              <summary>Which network should I use?</summary>
              <p>
                RoyaliX runs on Ethereum Sepolia testnet. This is for testing purposes and uses 
                test ETH which has no real value. Perfect for learning and development!
              </p>
            </details>
            <details className="faq-item">
              <summary>How do I get test ETH?</summary>
              <p>
                Visit the Sepolia Faucet above. Connect your wallet and request test ETH. 
                You'll receive tokens instantly to use on Sepolia.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="wallet-side">
        <div className="side-content">
          <h2>Secure Connection</h2>
          <p>
            Your wallet connection is encrypted and secure. RoyaliX never has access to your 
            private keys or sensitive information.
          </p>
          <div className="security-features">
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Private Keys Safe</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✅</span>
              <span>You Control Transactions</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌐</span>
              <span>Ethereum Powered</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Instant Connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
