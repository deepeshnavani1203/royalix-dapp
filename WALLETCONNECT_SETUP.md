# WalletConnect/Reown Integration Guide

## Step-by-Step Setup

### 1. Create Reown Project
- Go to https://cloud.reown.com
- Sign up or login
- Click "Create Project"
- Enter project name: "RoyaliX"
- Choose project type: "Web3 Wallet"
- You'll get a **Project ID** (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### 2. Copy Your Project ID
- Copy the Project ID from Reown dashboard

### 3. Update .env File
```env
VITE_CONTRACT_ADDRESS=0x2dcaa29e5866feb1a91625a59d31ed2eba0da61a
VITE_REOWN_PROJECT_ID=YOUR_PROJECT_ID_HERE
```
Replace `YOUR_PROJECT_ID_HERE` with your actual Project ID

### 4. Install WalletConnect Dependencies
```bash
npm install @reown/appkit @reown/appkit-adapter-ethers ethers viem
```

### 5. Update walletService.js (WalletConnect Support)
After creating the Reown project, we'll add WalletConnect support

### 6. Update Dashboard Header
Will show connected wallet info properly

---

## Current Status

✅ MetaMask: **READY** - Works without additional setup  
⏳ WalletConnect: **Requires Project ID** - Follow steps 1-3 above

---

## Testing

1. Start the app: `npm run dev`
2. Login with email/password
3. Click "Connect MetaMask"
4. Approve connection in MetaMask
5. You'll see the dashboard

---

## Troubleshooting

### MetaMask not detected?
- Install MetaMask extension: https://metamask.io

### Connection rejected?
- Make sure you're on Sepolia network in MetaMask
- MetaMask should auto-switch, if not, add Sepolia manually

### Wrong network error?
- Check that your MetaMask is set to Sepolia
- The app will show: "Switch to Sepolia" button if needed

---

## Next Steps

Once you have Reown Project ID:
1. Update .env file
2. We'll update walletService.js to support WalletConnect
3. Test WalletConnect connection
