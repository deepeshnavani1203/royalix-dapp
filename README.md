# RoyaliX — Experiments 1 and 2

This repository contains a React/Vite frontend for connecting a browser wallet
to the RoyaliX royalty-distribution contract. The current UI covers wallet
connection, contract statistics, royalty creation, revenue deposits, royalty
lookups, and distribution.

## Recovery inventory

| Purpose | File or value |
| --- | --- |
| RoyaliX Solidity source | `src/contracts/RoyaliX.sol` |
| RoyaliX browser ABI | `src/contractInfo.js` |
| Contract read/write integration | `src/services/contractService.js` |
| React/Vite app and dependencies | `src/`, `package.json` |
| Local contract address | `.env` (`VITE_CONTRACT_ADDRESS`) |
| Network | Sepolia, chain ID `11155111` (`0xaa36a7`) |

The source in this repository is reconstructed to match the existing frontend
ABI and expected RoyaliX workflow; it does not restore an earlier deployment.
The deployment address must come from your own Remix deployment. Experiment 1
can use the same RoyaliX contract to demonstrate React/Ethers.js integration
unless its original handout specifies a different contract or behavior.

No private key, seed phrase, wallet password, or custom RPC URL is required by
this browser frontend. MetaMask provides the wallet and RPC connection. Use
only Sepolia test ETH.

## Contract behavior

`RoyaliX.sol` uses Solidity `^0.8.24`.

- `owner()` is the deploying account and receives the platform share.
- `createRoyalty(creatorShare, platformShare)` creates a record for the caller.
  Shares must each be at most 100 and total exactly 100. IDs start at 0.
- `addRevenue(royaltyId)` is payable, accepts a positive ETH value, and adds it
  to that record.
- `getRoyalty(royaltyId)` returns creator, accumulated revenue in wei, both
  percentage shares, and active status.
- `royaltyCount()` returns the number of records.
- `getContractBalance()` returns the contract's ETH balance in wei.
- `distributeRoyalty(royaltyId)` pays the creator their percentage and the
  owner the remainder. Anyone can trigger this; the proceeds always go to the
  recorded recipients. The accumulated amount is cleared before external
  transfers, and a failed payout reverts the complete transaction.

## Deploy in Remix

1. Open [Remix](https://remix.ethereum.org), create `RoyaliX.sol`, and copy in
   the complete source from `src/contracts/RoyaliX.sol`.
2. In **Solidity Compiler**, select compiler `0.8.24`. Optimization is not
   required; leave it off for the beginner workflow.
3. Compile `RoyaliX.sol` and resolve any compiler errors before deploying.
4. In **Deploy & Run Transactions**, select **Injected Provider - MetaMask**.
   Unlock MetaMask and switch it to **Sepolia** (chain ID `11155111`). Confirm
   Remix shows the expected account and Sepolia network.
5. Select `RoyaliX` and click **Deploy**. Confirm the transaction in MetaMask
   and wait for it to be mined.
6. Copy the deployed contract address from Remix. This is the **contract
   address**, not your MetaMask wallet address. Save it in your local `.env` as
   `VITE_CONTRACT_ADDRESS`.
7. In Remix's deployed contract panel, test:
   - `owner`, `royaltyCount`, and `getContractBalance` (initially zero balance
     and zero count).
   - `createRoyalty(80, 20)`, then check `royaltyCount`, `royalties(0)`, and
     `getRoyalty(0)`. The creator should be the deploying account.
   - In the **Value** field, enter a small amount such as `0.001` with unit
     `ether`, then call `addRevenue(0)`.
   - Check `getRoyalty(0)` and `getContractBalance`; the revenue is returned
     in wei.
   - Call `distributeRoyalty(0)` and verify the creator and owner wallet
     balances changed (allowing for gas on the account that submits the
     transaction). Check that the royalty revenue and contract balance return
     to zero.

Do not expect the old address to reappear: a newly deployed contract has a new
address and empty state. Save the new address and the ABI produced by Remix.
The frontend ABI is already represented in `src/contractInfo.js`; if the
contract changes, update it from the compiler-generated ABI.

## Run the frontend

```powershell
npm install
Copy-Item .env.example .env
```

Edit `.env` and set `VITE_CONTRACT_ADDRESS` to your newly deployed Sepolia
contract address. Do not include a private key. The frontend uses MetaMask and
does not require a manually configured RPC URL. Restart Vite after changing
`.env`, then run:

```powershell
npm run dev
```

Connect MetaMask on Sepolia. In the RoyaliX dashboard, create an 80/20 royalty,
add a small amount of Sepolia ETH, view the royalty and contract statistics,
then distribute the revenue. Each write requires wallet confirmation and
Sepolia ETH for the transaction value and gas.

`VITE_NETWORK` and `VITE_CHAIN_ID` in `.env.example` document the target
network; the current frontend enforces Sepolia through the wallet integration.
These values are not secrets.
