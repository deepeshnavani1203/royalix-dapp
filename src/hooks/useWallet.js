import { useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";
import {
  connectMetaMask,
  connectWalletConnect,
  disconnectWalletConnect,
  subscribeWalletConnect,
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
    let active = true;
    const restoreMetaMask = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (!active || accounts.length === 0) return;
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (!active) return;
        setWallet((current) =>
          current.walletType
            ? current
            : {
                ...EMPTY,
                connected: true,
                address: accounts[0],
                provider: new BrowserProvider(window.ethereum),
                network:
                  chainId === SEPOLIA_CHAIN_ID
                    ? "Sepolia Testnet"
                    : "Wrong Network",
                chainId,
                isSepolia: chainId === SEPOLIA_CHAIN_ID,
                walletType: "metamask",
              },
        );
      } catch (error) {
        if (active) {
          setWallet((current) => ({
            ...current,
            error: error.message || "Could not restore MetaMask connection.",
          }));
        }
      }
    };
    void restoreMetaMask();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (wallet.walletType !== "walletconnect") return;

    return subscribeWalletConnect({
      onAccountChanged: (address) => {
        if (!address) {
          setWallet(EMPTY);
          return;
        }
        setWallet((current) => ({ ...current, address }));
      },
      onChainChanged: (chainId) => {
        const isSepolia =
          Number(chainId) === Number.parseInt(SEPOLIA_CHAIN_ID, 16);
        setWallet((current) => ({
          ...current,
          chainId: chainId == null ? null : `0x${Number(chainId).toString(16)}`,
          isSepolia,
          network: chainId == null
            ? "Network unavailable"
            : isSepolia
              ? "Sepolia Testnet"
              : "Switching to Sepolia...",
        }));
      },
      onNetworkSwitchError: (error) => {
        setWallet((current) => ({
          ...current,
          isSepolia: false,
          network: "Wrong Network",
          error: error.message,
        }));
      },
    });
  }, [wallet.walletType]);

  // ── MetaMask account / chain listeners ──
  useEffect(() => {
    if (!isMMInstalled()) return;
    const onAccounts = (accounts) => {
      setWallet((current) => {
        if (current.walletType !== "metamask") return current;
        if (accounts.length === 0) return EMPTY;
        return { ...current, address: accounts[0] };
      });
    };
    const onChain = (chainId) => {
      setWallet((current) => {
        if (current.walletType !== "metamask") return current;
        return {
          ...current,
          chainId,
          isSepolia: chainId === SEPOLIA_CHAIN_ID,
          network:
            chainId === SEPOLIA_CHAIN_ID ? "Sepolia Testnet" : "Wrong Network",
        };
      });
    };
    const onDisconnect = () => {
      setWallet((current) =>
        current.walletType === "metamask" ? EMPTY : current,
      );
    };
    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", onChain);
    window.ethereum.on("disconnect", onDisconnect);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccounts);
      window.ethereum.removeListener("chainChanged", onChain);
      window.ethereum.removeListener("disconnect", onDisconnect);
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
    setWallet({ ...EMPTY, loading: true });
    try {
      if (wallet.walletType === "walletconnect") {
        await disconnectWalletConnect();
      }
      const result = await connectMetaMask();
      setWallet({
        ...EMPTY,
        connected: true,
        address: result.address,
        provider: result.provider,
        network: result.network,
        chainId: result.chainId,
        isSepolia: result.isSepolia,
        walletType: "metamask",
      });
    } catch (err) {
      setWallet((p) => ({
        ...p,
        loading: false,
        error: err.message || "MetaMask connection failed.",
      }));
    }
  }, [wallet.walletType]);

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
        network: result.network,
        chainId: result.chainId,
        isSepolia: result.isSepolia,
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
    try {
      if (wallet.walletType === "walletconnect") {
        await disconnectWalletConnect();
      }
      setWallet(EMPTY);
    } catch (error) {
      setWallet((current) => ({
        ...current,
        error: error.message || "Could not disconnect wallet.",
      }));
    }
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
