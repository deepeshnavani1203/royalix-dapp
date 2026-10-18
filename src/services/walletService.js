import { BrowserProvider } from 'ethers';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // Sepolia in hex
const SEPOLIA_CHAIN_ID_NUM = 11155111; // Sepolia numeric ID
let walletConnectAppKitPromise = null;
let walletConnectProvider = null;
let walletConnectAddress = null;
let walletConnectSepolia = null;

const getWalletConnectAppKit = async () => {
  const projectId = import.meta.env.VITE_REOWN_PROJECT_ID?.trim();
  if (!projectId || projectId === 'YOUR_PROJECT_ID_HERE') {
    throw new Error(
      'WalletConnect is not configured. Add your Reown Project ID as VITE_REOWN_PROJECT_ID in the project-root .env file, then restart Vite.',
    );
  }

  if (!walletConnectAppKitPromise) {
    walletConnectAppKitPromise = (async () => {
      const [{ createAppKit }, { sepolia }, { EthersAdapter }] =
        await Promise.all([
          import('@reown/appkit/react'),
          import('@reown/appkit/networks'),
          import('@reown/appkit-adapter-ethers'),
        ]);
      walletConnectSepolia = sepolia;
      const appKit = createAppKit({
        adapters: [new EthersAdapter()],
        networks: [sepolia],
        defaultNetwork: sepolia,
        projectId,
        metadata: {
          name: 'RoyaliX',
          description: 'Decentralized royalty and revenue distribution',
          url: window.location.origin,
          icons: [`${window.location.origin}/favicon.svg`],
        },
      });
      await appKit.ready();
      return appKit;
    })().catch((error) => {
      walletConnectAppKitPromise = null;
      throw error;
    });
  }

  return walletConnectAppKitPromise;
};

const toSafeWalletConnectError = (error) => {
  const projectId = import.meta.env.VITE_REOWN_PROJECT_ID?.trim();
  const message =
    error instanceof Error ? error.message : 'WalletConnect connection failed.';
  return new Error(
    projectId ? message.replaceAll(projectId, '[redacted]') : message,
  );
};

const getSepoliaWallet = async (appKit, address) => {
  if (Number(appKit.getChainId()) !== SEPOLIA_CHAIN_ID_NUM) {
    await appKit.switchNetwork(walletConnectSepolia, {
      throwOnFailure: true,
    });
  }

  const walletProvider = appKit.getWalletProvider();
  if (!walletProvider || typeof walletProvider.request !== 'function') {
    throw new Error(
      'WalletConnect connected, but the Ethers wallet provider is unavailable.',
    );
  }

  const provider = new BrowserProvider(walletProvider);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID_NUM) {
    throw new Error(
      'Switch the connected wallet to Sepolia (chain ID 11155111) to use RoyaliX.',
    );
  }

  walletConnectProvider = provider;
  walletConnectAddress = address;
  return {
    address,
    provider,
    connected: true,
    chainId: SEPOLIA_CHAIN_ID,
    network: 'Sepolia Testnet',
    isSepolia: true,
  };
};

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
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    if (!accounts.length) {
      throw new Error('MetaMask did not return an account. Unlock it and try again.');
    }

    let chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    if (chainId !== SEPOLIA_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: 'Ethereum Sepolia',
                  rpcUrls: ['https://rpc.sepolia.org'],
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                },
              ],
            });
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: SEPOLIA_CHAIN_ID }],
            });
          } catch (addOrSwitchError) {
            if (addOrSwitchError.code === 4001) {
              throw new Error(
                'Sepolia network setup was rejected in MetaMask. Approve the network request to continue.',
                { cause: addOrSwitchError },
              );
            }
            throw new Error(
              `Could not add or switch MetaMask to Sepolia: ${addOrSwitchError.message || 'network request failed'}`,
              { cause: addOrSwitchError },
            );
          }
        } else if (switchError.code === 4001) {
          throw new Error(
            'MetaMask network switch was rejected. Switch to Sepolia (chain ID 11155111) to continue.',
            { cause: switchError },
          );
        } else {
          throw new Error(
            `Could not switch MetaMask to Sepolia: ${switchError.message || 'network request failed'}`,
            { cause: switchError },
          );
        }
      }
    }

    chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== SEPOLIA_CHAIN_ID) {
      throw new Error(
        `Wrong network. Select Sepolia in MetaMask (chain ID 11155111); current chain ID is ${Number.parseInt(chainId, 16)}.`,
      );
    }

    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== SEPOLIA_CHAIN_ID_NUM) {
      throw new Error(
        'MetaMask is not connected to Sepolia (chain ID 11155111). Switch networks and try again.',
      );
    }

    return {
      address: accounts[0],
      provider,
      connected: true,
      chainId,
      network: 'Sepolia Testnet',
      isSepolia: true,
    };
  } catch (error) {
    if (error.code === 4001) {
      throw new Error(
        'MetaMask connection was rejected. Approve the connection request to continue.',
        { cause: error },
      );
    }
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
 * Connect through the Reown AppKit modal and its WalletConnect v2 session.
 */
export const connectWalletConnect = async () => {
  const appKit = await getWalletConnectAppKit();
  const existingAddress = appKit.getAddress('eip155');
  if (existingAddress) {
    return getSepoliaWallet(appKit, existingAddress).catch((error) => {
      throw toSafeWalletConnectError(error);
    });
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let modalWasOpened = false;
    let unsubscribeAccount = () => {};
    let unsubscribeState = () => {};

    const cleanup = () => {
      unsubscribeAccount();
      unsubscribeState();
    };

    const fail = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(toSafeWalletConnectError(error));
    };

    const finishConnection = async (account) => {
      if (settled || !account?.isConnected || !account.address) return;
      try {
        const wallet = await getSepoliaWallet(appKit, account.address);
        if (settled) return;
        settled = true;
        cleanup();
        resolve(wallet);
      } catch (error) {
        fail(error);
      }
    };

    unsubscribeAccount = appKit.subscribeAccount((account) => {
      void finishConnection(account);
    }, 'eip155');
    unsubscribeState = appKit.subscribeState((state) => {
      if (state.open) {
        modalWasOpened = true;
      } else if (modalWasOpened && !appKit.getAddress('eip155')) {
        fail(
          new Error(
            'WalletConnect connection was cancelled. Reopen the wallet picker to try again.',
          ),
        );
      }
    });

    const address = appKit.getAddress('eip155');
    if (address) {
      void finishConnection({ isConnected: true, address });
      return;
    }

    Promise.resolve()
      .then(() => appKit.open({ view: 'Connect', namespace: 'eip155' }))
      .catch(fail);
  });
};

/**
 * Disconnect WalletConnect
 */
export const disconnectWalletConnect = async () => {
  const appKit = await walletConnectAppKitPromise;
  if (appKit) await appKit.disconnect('eip155');
  walletConnectProvider = null;
  walletConnectAddress = null;
};

/**
 * Get WalletConnect status
 */
export const getWalletConnectStatus = () => {
  return {
    connected: !!walletConnectProvider,
    address: walletConnectAddress,
  };
};

export const subscribeWalletConnect = (callbacks) => {
  if (!walletConnectAppKitPromise) return () => {};

  let active = true;
  let unsubscribeAccount = () => {};
  let unsubscribeNetwork = () => {};
  let switchingToSepolia = false;

  void walletConnectAppKitPromise.then((appKit) => {
    if (!active) return;
    unsubscribeAccount = appKit.subscribeAccount((account) => {
      walletConnectAddress = account.isConnected ? account.address || null : null;
      if (!account.isConnected) walletConnectProvider = null;
      callbacks.onAccountChanged?.(
        account.isConnected ? account.address || null : null,
      );
    }, 'eip155');

    unsubscribeNetwork = appKit.subscribeNetwork(({ chainId }) => {
      callbacks.onChainChanged?.(chainId);
      if (
        chainId === undefined ||
        Number(chainId) === SEPOLIA_CHAIN_ID_NUM ||
        switchingToSepolia
      ) {
        return;
      }
      switchingToSepolia = true;
      void appKit
        .switchNetwork(walletConnectSepolia, { throwOnFailure: true })
        .catch((error) => {
          callbacks.onNetworkSwitchError?.(toSafeWalletConnectError(error));
        })
        .finally(() => {
          switchingToSepolia = false;
        });
    });
  });

  return () => {
    active = false;
    unsubscribeAccount();
    unsubscribeNetwork();
  };
};
