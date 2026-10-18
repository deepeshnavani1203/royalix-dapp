import {
  Contract,
  formatEther,
  formatUnits,
  getAddress,
  isAddress,
  parseEther,
  parseUnits,
} from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contractInfo";
import { MOCKUSDC_ADDRESS, MOCKUSDC_ABI } from "../contracts/mockUSDC";
import { VAULT_ADDRESS, VAULT_ABI } from "../contracts/studentVault";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Return a read-only contract (uses provider directly) */
const readContract = (address, abi, provider) =>
  new Contract(address, abi, provider);

/** Return a write-enabled contract (uses signer) */
const writeContract = async (address, abi, provider) => {
  const signer = await provider.getSigner();
  return new Contract(address, abi, signer);
};

/** Format a BigInt wei value to a human-readable string with `decimals` places */
export const fmt = (raw, decimals = 18, displayDecimals = 4) => {
  try {
    const s = formatUnits(raw, decimals);
    const n = parseFloat(s);
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: displayDecimals,
    });
  } catch {
    return "0";
  }
};

/** Parse a human-readable string to BigInt wei */
export const parse = (value, decimals = 18) =>
  parseUnits(String(value), decimals);

// ─── RoyaliX ────────────────────────────────────────────────────────────────

const royaltyContract = (provider) => {
  if (!CONTRACT_ADDRESS || !isAddress(CONTRACT_ADDRESS)) {
    throw new Error("Set a valid VITE_CONTRACT_ADDRESS in your .env file");
  }
  return new Contract(
    getAddress(CONTRACT_ADDRESS),
    CONTRACT_ABI,
    provider,
  );
};

const writableRoyaltyContract = async (provider) => {
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 11155111) {
    throw new Error(
      "Wrong network. Switch your wallet to Sepolia (chain ID 11155111) before submitting this transaction.",
    );
  }
  return royaltyContract(provider).connect(await provider.getSigner());
};

export const formatAddress = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

export const createRoyalty = async (provider, creatorShare, platformShare) => {
  const contract = await writableRoyaltyContract(provider);
  return contract.createRoyalty(creatorShare, platformShare);
};

export const addRevenue = async (provider, royaltyId, amount) => {
  const contract = await writableRoyaltyContract(provider);
  return contract.addRevenue(royaltyId, { value: parseEther(String(amount)) });
};

export const getRoyalty = async (provider, royaltyId) => {
  const [creator, totalRevenue, creatorShare, platformShare, active] =
    await royaltyContract(provider).getRoyalty(royaltyId);
  return {
    creator,
    totalRevenue,
    creatorShare: Number(creatorShare),
    platformShare: Number(platformShare),
    active,
  };
};

export const getAllRoyalties = async (provider) => {
  const contract = royaltyContract(provider);
  const count = Number(await contract.royaltyCount());
  const records = await Promise.all(
    Array.from({ length: count }, (_, royaltyId) =>
      contract.getRoyalty(royaltyId).then((royalty) => ({
        id: royaltyId,
        creator: royalty[0],
        totalRevenue: royalty[1],
        creatorShare: Number(royalty[2]),
        platformShare: Number(royalty[3]),
        active: royalty[4],
      })),
    ),
  );
  return records;
};

export const distributeRoyalty = async (provider, royaltyId) => {
  const contract = await writableRoyaltyContract(provider);
  return contract.distributeRoyalty(royaltyId);
};

export const getContractBalance = async (provider) =>
  formatEther(await royaltyContract(provider).getContractBalance());

export const getRoyaltyCount = async (provider) =>
  Number(await royaltyContract(provider).royaltyCount());

export const getContractOwner = async (provider) =>
  royaltyContract(provider).owner();

// ─── MockUSDC (ERC-20) ──────────────────────────────────────────────────────

export const getUSDCInfo = async (provider, userAddress) => {
  const c = readContract(MOCKUSDC_ADDRESS, MOCKUSDC_ABI, provider);
  const [name, symbol, decimals, totalSupply, balance, allowance] =
    await Promise.all([
      c.name(),
      c.symbol(),
      c.decimals(),
      c.totalSupply(),
      c.balanceOf(userAddress),
      c.allowance(userAddress, VAULT_ADDRESS),
    ]);
  return {
    name,
    symbol,
    decimals: Number(decimals),
    totalSupply: fmt(totalSupply, Number(decimals)),
    balance: fmt(balance, Number(decimals)),
    allowance: fmt(allowance, Number(decimals)),
    rawBalance: balance,
    rawAllowance: allowance,
  };
};

export const mintUSDC = async (provider, toAddress, amount, decimals = 18) => {
  const c = await writeContract(MOCKUSDC_ADDRESS, MOCKUSDC_ABI, provider);
  const tx = await c.mint(toAddress, parse(amount, decimals));
  return tx;
};

export const approveVault = async (provider, amount, decimals = 18) => {
  const c = await writeContract(MOCKUSDC_ADDRESS, MOCKUSDC_ABI, provider);
  const tx = await c.approve(VAULT_ADDRESS, parse(amount, decimals));
  return tx;
};

export const checkAllowance = async (provider, owner) => {
  const c = readContract(MOCKUSDC_ADDRESS, MOCKUSDC_ABI, provider);
  const dec = Number(await c.decimals());
  const raw = await c.allowance(owner, VAULT_ADDRESS);
  return { raw, formatted: fmt(raw, dec) };
};

// ─── StudentVault (ERC-4626) ────────────────────────────────────────────────

export const getVaultOverview = async (provider, userAddress) => {
  const v = readContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const [assetAddr, totalAssets, totalShares, myShares] = await Promise.all([
    v.asset(),
    v.totalAssets(),
    v.totalSupply(),
    v.balanceOf(userAddress),
  ]);
  return {
    assetAddress: assetAddr,
    totalAssets: fmt(totalAssets, 18),
    totalShares: fmt(totalShares, 18),
    myShares: fmt(myShares, 18),
    rawMyShares: myShares,
  };
};

// Preview deposit: assets → expected shares
export const previewDeposit = async (provider, assetAmount, decimals = 18) => {
  const v = readContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const raw = await v.previewDeposit(parse(assetAmount, decimals));
  return { raw, formatted: fmt(raw, decimals) };
};

// Deposit assets into vault
export const depositToVault = async (
  provider,
  assetAmount,
  receiver,
  decimals = 18,
) => {
  const v = await writeContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const tx = await v.deposit(parse(assetAmount, decimals), receiver);
  return tx;
};

// Preview mint: shares → required assets
export const previewMint = async (provider, shareAmount, decimals = 18) => {
  const v = readContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const raw = await v.previewMint(parse(shareAmount, decimals));
  return { raw, formatted: fmt(raw, decimals) };
};

// Mint exact shares from vault
export const mintShares = async (
  provider,
  shareAmount,
  receiver,
  decimals = 18,
) => {
  const v = await writeContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const tx = await v.mint(parse(shareAmount, decimals), receiver);
  return tx;
};

// Preview withdraw: assets → shares burned
export const previewWithdraw = async (provider, assetAmount, decimals = 18) => {
  const v = readContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const raw = await v.previewWithdraw(parse(assetAmount, decimals));
  return { raw, formatted: fmt(raw, decimals) };
};

// Withdraw assets from vault
export const withdrawFromVault = async (
  provider,
  assetAmount,
  receiver,
  owner,
  decimals = 18,
) => {
  const v = await writeContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const tx = await v.withdraw(parse(assetAmount, decimals), receiver, owner);
  return tx;
};

// Preview redeem: shares → returned assets
export const previewRedeem = async (provider, shareAmount, decimals = 18) => {
  const v = readContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const raw = await v.previewRedeem(parse(shareAmount, decimals));
  return { raw, formatted: fmt(raw, decimals) };
};

// Redeem shares from vault
export const redeemShares = async (
  provider,
  shareAmount,
  receiver,
  owner,
  decimals = 18,
) => {
  const v = await writeContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const tx = await v.redeem(parse(shareAmount, decimals), receiver, owner);
  return tx;
};

// Conversion: assets → shares
export const convertAssetsToShares = async (
  provider,
  assetAmount,
  decimals = 18,
) => {
  const v = readContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const raw = await v.convertToShares(parse(assetAmount, decimals));
  return { raw, formatted: fmt(raw, decimals) };
};

// Conversion: shares → assets
export const convertSharesToAssets = async (
  provider,
  shareAmount,
  decimals = 18,
) => {
  const v = readContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const raw = await v.convertToAssets(parse(shareAmount, decimals));
  return { raw, formatted: fmt(raw, decimals) };
};

// Custom: getVaultInfo()
export const getVaultInfo = async (provider) => {
  const v = readContract(VAULT_ADDRESS, VAULT_ABI, provider);
  const [underlyingAsset, totalAssets_, totalShares, vaultPurpose] =
    await v.getVaultInfo();
  return {
    underlyingAsset,
    totalAssets: fmt(totalAssets_, 18),
    totalShares: fmt(totalShares, 18),
    vaultPurpose,
  };
};
