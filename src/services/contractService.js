import { Contract, formatUnits, parseUnits } from "ethers";
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
