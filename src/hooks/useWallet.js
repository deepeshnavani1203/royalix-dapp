import { useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";
import {
  connectWalletConnect,
  disconnectWalletConnect,
} from "../services/walletService";

const SEPOLIA_CHAIN_ID = "0xaa36a7";
const isMMInstalled = () =>
  typeof window !== "undefined" && Boolean(window.ethereum);

const EMPTY = {
  connected: false,
  address: null,
  provider: null,
  network: null,
  chainId: null,
  isSepolia: false,
  loading: false,
  error: null,
  walletType: null,
};

export const useWallet = () => {
  const [wallet, setWallet] = useState(EMPTY);

  // ── auto-reconnect MetaMask on page reload ──
  useEffect(() => {
    if (!isMMInstalled()) return;
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length === 0) return;
      window.ethereum.request({ method: "eth_chainId" }).then((chainId) => {
        setWallet({
          ...EMPTY,
          connected: true,
          address: accounts[0],
          provider: new BrowserProvider(window.ethereum),
          network:
            chainId === SEPOLIA_CHAIN_ID ? "Sepolia Testnet" : "Wrong Network",
          chainId,
          isSepolia: chainId === SEPOLIA_CHAIN_ID,
          walletType: "metamask",
        });
      });
    });
  }, []);

  // ── MetaMask account / chain listeners ──
  useEffect(() => {
    if (!isMMInstalled()) return;
    const onAccounts = (accounts) => {
      if (accounts.length === 0) setWallet(EMPTY);
      else setWallet((p) => ({ ...p, address: accounts[0] }));
    };
    const onChain = (chainId) =>
      setWallet((p) => ({
        ...p,
        chainId,
        isSepolia: chainId === SEPOLIA_CHAIN_ID,
        network:
          chainId === SEPOLIA_CHAIN_ID ? "Sepolia Testnet" : "Wrong Network",
      }));
    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", onChain);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccounts);
      window.ethereum.removeListener("chainChanged", onChain);
    };
  }, []);

  // ── Connect MetaMask ──
  const connectMM = useCallback(async () => {
    if (!isMMInstalled()) {
      setWallet((p) => ({
        ...p,
        error: "MetaMask not installed. Visit metamask.io",
      }));
      return;
    }
    setWallet((p) => ({ ...p, loading: true, error: null }));
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (e) {
          if (e.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: "Ethereum Sepolia",
                  rpcUrls: ["https://rpc.sepolia.org"],
                  nativeCurrency: {
                    name: "SepoliaETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } else throw e;
        }
      }
      const finalChain = await window.ethereum.request({
        method: "eth_chainId",
      });
      setWallet({
        ...EMPTY,
        connected: true,
        address: accounts[0],
        provider: new BrowserProvider(window.ethereum),
        network:
          finalChain === SEPOLIA_CHAIN_ID ? "Sepolia Testnet" : "Wrong Network",
        chainId: finalChain,
        isSepolia: finalChain === SEPOLIA_CHAIN_ID,
        walletType: "metamask",
      });
    } catch (err) {
      setWallet((p) => ({
        ...p,
        loading: false,
        error: err.message || "MetaMask connection failed",
      }));
    }
  }, []);

  // ── Connect WalletConnect ──
  const connectWC = useCallback(async () => {
    setWallet((p) => ({ ...p, loading: true, error: null }));
    try {
      const result = await connectWalletConnect();
      setWallet({
        ...EMPTY,
        connected: true,
        address: result.address,
        provider: result.provider,
        network: "Sepolia Testnet",
        chainId: SEPOLIA_CHAIN_ID,
        isSepolia: true,
        walletType: "walletconnect",
      });
    } catch (err) {
      setWallet((p) => ({
        ...p,
        loading: false,
        error: err.message || "WalletConnect failed",
      }));
    }
  }, []);

  // ── Disconnect ──
  const disconnect = useCallback(async () => {
    if (wallet.walletType === "walletconnect") await disconnectWalletConnect();
    setWallet(EMPTY);
  }, [wallet.walletType]);

  return {
    ...wallet,
    connectMM,
    connectWC,
    // legacy alias so older panels still work if they call connect()
    connect: connectMM,
    disconnect,
    isMetaMaskAvailable: isMMInstalled(),
  };
};
