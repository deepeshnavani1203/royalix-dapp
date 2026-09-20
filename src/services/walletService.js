import { BrowserProvider } from 'ethers';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // Sepolia in hex
const SEPOLIA_CHAIN_ID_NUM = 11155111; // Sepolia numeric ID
let walletConnectProvider = null;

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

/**
 * Connect to MetaMask
 */
export const connectMetaMask = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    // Check current network
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    // If not on Sepolia, request network switch
    if (chainId !== SEPOLIA_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError) {
        // If the chain hasn't been added to MetaMask, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
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
        } else {
          throw switchError;
        }
      }
    }

    return {
      address: accounts[0],
      provider: new BrowserProvider(window.ethereum),
      connected: true,
    };
  } catch (error) {
    console.error('MetaMask connection error:', error);
    throw error;
  }
};

/**
 * Get current MetaMask account and network
 */
export const getMetaMaskStatus = async () => {
  if (!isMetaMaskInstalled()) {
    return { connected: false, address: null, chainId: null };
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    return {
      connected: accounts.length > 0,
      address: accounts[0] || null,
      chainId,
      isSepolia: chainId === SEPOLIA_CHAIN_ID,
    };
  } catch (error) {
    console.error('Error getting MetaMask status:', error);
    return { connected: false, address: null, chainId: null };
  }
};

/**
 * Disconnect MetaMask (client-side only)
 */
export const disconnectMetaMask = () => {
  return { connected: false, address: null };
};

/**
 * Setup MetaMask event listeners
 */
export const setupMetaMaskListeners = (callbacks) => {
  if (!isMetaMaskInstalled()) return;

  // Listen for account changes
  window.ethereum.on('accountsChanged', (accounts) => {
    callbacks?.onAccountChanged?.(accounts[0] || null);
  });

  // Listen for chain changes
  window.ethereum.on('chainChanged', (chainId) => {
    callbacks?.onChainChanged?.(chainId);
  });

  // Listen for connection
  window.ethereum.on('connect', () => {
    callbacks?.onConnect?.();
  });

  // Listen for disconnection
  window.ethereum.on('disconnect', () => {
    callbacks?.onDisconnect?.();
  });
};

/**
 * Connect to WalletConnect (simplified approach)
 */
export const connectWalletConnect = async () => {
  try {
    const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;
    if (!projectId) {
      throw new Error('WalletConnect Project ID not configured. Add VITE_REOWN_PROJECT_ID to .env');
    }

    // Use direct WalletConnect provider approach
    // For now, show a message that WalletConnect is being set up
    console.log('WalletConnect connecting with Project ID:', projectId);
    
    // Create a simple prompt for user to scan QR code
    const message = `WalletConnect QR Code:\n\nProject ID: ${projectId}\n\nPlease use your mobile wallet to scan.`;
    alert(message);

    throw new Error('WalletConnect setup requires additional UI. Using MetaMask for now.');
  } catch (error) {
    console.error('WalletConnect error:', error);
    throw error;
  }
};

/**
 * Disconnect WalletConnect
 */
export const disconnectWalletConnect = async () => {
  if (walletConnectProvider) {
    walletConnectProvider = null;
  }
};

/**
 * Get WalletConnect status
 */
export const getWalletConnectStatus = () => {
  return {
    connected: !!walletConnectProvider,
    address: walletConnectProvider?.address || null,
  };
};
