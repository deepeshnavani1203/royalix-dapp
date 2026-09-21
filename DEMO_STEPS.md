# RoyaliX — Demo Steps

> Three Web3 practical experiments on Ethereum Sepolia

---

## Before Anything

1. Open `.env` and replace the placeholders:
   ```
   VITE_MOCKUSDC_ADDRESS=0xYourMockUSDCAddress
   VITE_VAULT_ADDRESS=0xYourStudentVaultAddress
   ```
2. Run `npm run dev` — open `http://localhost:5173`
3. You will see the **RoyaliX home page** with three experiment cards.

---

## Experiment 01 — MetaMask

> Click **Open Experiment 01** on the home page.

### Setup (one time)

- Install MetaMask from https://metamask.io/download
- Create a wallet and save your seed phrase securely
- Get free Sepolia ETH from https://sepoliafaucet.com

### Demo Steps

| Step | Action                                    | What Happens                                                       |
| ---- | ----------------------------------------- | ------------------------------------------------------------------ |
| 1    | Click **Connect MetaMask**                | MetaMask popup opens in the browser                                |
| 2    | Click **Connect** in MetaMask             | Connection is approved                                             |
| 3    | Switch network if prompted                | App auto-switches to Sepolia                                       |
| 4    | View the dashboard                        | Address, Network, Chain ID, Sepolia status all shown               |
| 5    | Show the **Methods Demonstrated** section | Explains eth_requestAccounts, eth_chainId, BrowserProvider, events |
| 6    | Switch account in MetaMask                | Address updates live (accountsChanged event)                       |
| 7    | Click **Disconnect**                      | Wallet state is cleared                                            |
| 8    | Click **Back**                            | Returns to home page                                               |

### Key Points to Explain

- `eth_requestAccounts` — asks user permission to connect
- `BrowserProvider` — Ethers.js v6 wraps `window.ethereum`
- `wallet_switchEthereumChain` — switches network programmatically
- `accountsChanged` / `chainChanged` — real-time event listeners

---

## Experiment 02 — WalletConnect

> Click **Open Experiment 02** on the home page.

### Setup

- Install any WalletConnect-compatible mobile wallet:
  - Trust Wallet, Rainbow, MetaMask Mobile, Coinbase Wallet
- Configure it on Sepolia testnet

### Demo Steps

| Step | Action                                 | What Happens                                       |
| ---- | -------------------------------------- | -------------------------------------------------- |
| 1    | Click **Connect WalletConnect**        | WalletConnect QR modal opens                       |
| 2    | Open mobile wallet app                 | Navigate to WalletConnect scan                     |
| 3    | Scan the QR code                       | Session pairing begins                             |
| 4    | Approve connection on phone            | Mobile wallet confirms the session                 |
| 5    | View the dashboard                     | Address, Network, Chain ID, Protocol shown         |
| 6    | Show **Concepts Demonstrated** section | WC v2 protocol, QR pairing, relay server, sessions |
| 7    | Click **Disconnect**                   | WC session terminated on both devices              |
| 8    | Click **Back**                         | Returns to home page                               |

### Key Points to Explain

- WalletConnect v2 is an open protocol — works with any compatible wallet
- QR code initiates a secure encrypted session via relay server
- No private keys leave the mobile device
- `disconnect()` terminates the session on both sides

---

## Experiment 03 — ERC-4626 Vault

> Click **Open Experiment 03** on the home page.
> MetaMask must be connected to Sepolia.

### Setup

- Same MetaMask + Sepolia ETH setup as Experiment 01
- Contracts already deployed — addresses in `.env`

### Demo Steps

#### Section 01 — ERC-20 Token (MockUSDC)

| Step | Action                                     | Contract Call                         |
| ---- | ------------------------------------------ | ------------------------------------- |
| 1    | Connect MetaMask                           | —                                     |
| 2    | View token name, symbol, total supply      | `name()`, `symbol()`, `totalSupply()` |
| 3    | View your MockUSDC balance                 | `balanceOf(address)`                  |
| 4    | Enter an amount, click **Mint**            | `mint(address, amount)`               |
| 5    | Confirm in MetaMask, wait for confirmation | tx.wait()                             |
| 6    | Balance updates automatically              | `balanceOf()` refreshed               |
| 7    | Enter an amount, click **Approve**         | `approve(vaultAddress, amount)`       |
| 8    | Confirm in MetaMask                        | tx.wait()                             |
| 9    | Click **Check Allowance**                  | `allowance(user, vault)`              |

#### Section 02 — Vault Overview

| Step | Action                        | Contract Call        |
| ---- | ----------------------------- | -------------------- |
| 10   | View underlying asset address | `asset()`            |
| 11   | View total assets in vault    | `totalAssets()`      |
| 12   | View total vault shares       | `totalSupply()`      |
| 13   | View your vault shares        | `balanceOf(address)` |

#### Section 03 — Deposit

| Step | Action                                             | Contract Call               |
| ---- | -------------------------------------------------- | --------------------------- |
| 14   | Enter USDC amount, click **Preview Deposit**       | `previewDeposit(assets)`    |
| 15   | Note expected shares shown                         | Read-only, no gas           |
| 16   | Click **Deposit**, confirm in MetaMask             | `deposit(assets, receiver)` |
| 17   | Balances refresh — USDC decreases, shares increase | —                           |

#### Section 04 — Conversion

| Step | Action                                          | Contract Call             |
| ---- | ----------------------------------------------- | ------------------------- |
| 18   | Enter asset amount, click **convertToShares()** | `convertToShares(assets)` |
| 19   | Enter share amount, click **convertToAssets()** | `convertToAssets(shares)` |
| 20   | Show both results — read-only, no gas needed    | —                         |

#### Section 05 — Mint Shares

| Step | Action                                     | Contract Call            |
| ---- | ------------------------------------------ | ------------------------ |
| 21   | Enter share amount, click **Preview Mint** | `previewMint(shares)`    |
| 22   | Note required USDC shown                   | Read-only                |
| 23   | Click **Mint Shares**, confirm in MetaMask | `mint(shares, receiver)` |

#### Section 06 — Withdraw

| Step | Action                                        | Contract Call                       |
| ---- | --------------------------------------------- | ----------------------------------- |
| 24   | Enter USDC amount, click **Preview Withdraw** | `previewWithdraw(assets)`           |
| 25   | Note shares that will be burned               | Read-only                           |
| 26   | Click **Withdraw**, confirm in MetaMask       | `withdraw(assets, receiver, owner)` |
| 27   | USDC increases, shares decrease               | —                                   |

#### Section 07 — Redeem

| Step | Action                                       | Contract Call                     |
| ---- | -------------------------------------------- | --------------------------------- |
| 28   | Enter share amount, click **Preview Redeem** | `previewRedeem(shares)`           |
| 29   | Note USDC that will be returned              | Read-only                         |
| 30   | Click **Redeem Shares**, confirm in MetaMask | `redeem(shares, receiver, owner)` |
| 31   | MockUSDC returns to wallet                   | —                                 |

#### Section 08 — Vault Information

| Step | Action                                                         | Contract Call        |
| ---- | -------------------------------------------------------------- | -------------------- |
| 32   | Click **Call getVaultInfo()**                                  | `getVaultInfo()`     |
| 33   | View: Asset address, Total Assets, Total Shares, Vault Purpose | Custom view function |

---

## Full ERC-4626 Lifecycle Summary

```
Connect MetaMask
    → Mint MockUSDC       (ERC-20: mint)
    → Approve Vault       (ERC-20: approve)
    → Deposit             (ERC-4626: deposit)
    → Receive Shares      (ERC-4626: shares minted)
    → Convert             (ERC-4626: convertToShares / convertToAssets)
    → Mint Shares         (ERC-4626: mint)
    → Withdraw            (ERC-4626: withdraw → shares burned)
    → Redeem              (ERC-4626: redeem → USDC returned)
    → View Vault Info     (custom: getVaultInfo)
```

---

## Contracts on Sepolia

| Contract     | Description              | Address                           |
| ------------ | ------------------------ | --------------------------------- |
| MockUSDC     | ERC-20 underlying asset  | `VITE_MOCKUSDC_ADDRESS` in `.env` |
| StudentVault | ERC-4626 tokenised vault | `VITE_VAULT_ADDRESS` in `.env`    |

Verify both on https://sepolia.etherscan.io

---

## Useful Links

- Sepolia ETH faucet: https://sepoliafaucet.com
- MetaMask download: https://metamask.io/download
- ERC-4626 standard: https://eips.ethereum.org/EIPS/eip-4626
- Ethers.js v6 docs: https://docs.ethers.org/v6
