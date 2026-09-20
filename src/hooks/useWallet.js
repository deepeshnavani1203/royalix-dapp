import { useState, useCallback } from 'react';
import {
  connectMetaMask,
  disconnectMetaMask,
  isMetaMaskInstalled,
  connectWalletConnect,
  disconnectWalletConnect,
} from '../services/walletService';

export const useWallet = () => {
  const [wallet, setWallet] = useState({
    connected: false,
    address: null,
    provider: null,
    chainId: null,
    isSepolia: false,
    loading: false,
    error: null,
    walletType: null,
  });

  const connect = useCallback(async (walletType = 'metamask') => {
    setWallet(prev => ({ ...prev, loading: true, error: null }));
    try {
      if (walletType === 'metamask') {
        const result = await connectMetaMask();
        setWallet({
          connected: true,
          address: result.address,
          provider: result.provider,
          chainId: '0xaa36a7',
          isSepolia: true,
          loading: false,
          error: null,
          walletType: 'metamask',
        });
      } else if (walletType === 'walletconnect') {
        const result = await connectWalletConnect();
        setWallet({
          connected: true,
          address: result.address,
          provider: result.provider,
          chainId: '0xaa36a7',
          isSepolia: true,
          loading: false,
          error: null,
          walletType: 'walletconnect',
        });
      }
    } catch (error) {
      setWallet(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (wallet.walletType === 'walletconnect') {
      await disconnectWalletConnect();
    } else {
      disconnectMetaMask();
    }
    setWallet({
      connected: false,
      address: null,
      provider: null,
      chainId: null,
      isSepolia: false,
      loading: false,
      error: null,
      walletType: null,
    });
  }, [wallet.walletType]);

  return {
    ...wallet,
    connect,
    disconnect,
    isMetaMaskAvailable: isMetaMaskInstalled(),
  };
};
