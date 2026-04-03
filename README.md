# Freelance Payment System

A blockchain-based freelance payment platform using React and Solidity smart contracts. Clients post jobs and deposit funds into escrow; freelancers submit work and receive payment on approval.

---

## Tech Stack

- **Frontend**: React 19 + JavaScript, Vite, Tailwind CSS, ethers.js v6
- **Smart Contracts**: Solidity 0.8.0+, deployed via Hardhat or Remix
- **Local Blockchain**: Ganache

---

## Smart Contracts

**`UserRegistry.sol`** — Handles user registration with two roles: Client and Freelancer.

**`FreelanceEscrow.sol`** — Manages job lifecycle: posting, fund deposit, work submission, and payment release. Requires `UserRegistry` address on deployment.

---

## Setup

### Prerequisites
- Node.js v18+
- MetaMask browser extension
- Ganache (CLI or GUI)

### Install & Run

```bash
# Install frontend dependencies
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### Deploy Contracts

**Option A — Remix (recommended):**
1. Go to https://remix.ethereum.org
2. Paste both contract files
3. Deploy `UserRegistry` first, then `FreelanceEscrow` with the `UserRegistry` address as the constructor argument
4. Copy both deployed addresses

**Option B — Hardhat:**
```bash
cd blockchain
npm install
# Add your Ganache private key to hardhat.config.js
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache
```

### Configure Environment

Create `.env` in the `client/` directory:

```env
VITE_USER_REGISTRY_ADDRESS=0x<UserRegistry_Address>
VITE_ESCROW_ADDRESS=0x<FreelanceEscrow_Address>
```

### MetaMask Network Settings

| Setting | Value |
|---------|-------|
| RPC URL | http://127.0.0.1:7545 |
| Chain ID | 1337 |
| Currency | ETH |

---

## Usage

**Clients:** Connect wallet → Register as Client → Post Job (enter freelancer address, description, amount) → Deposit Funds → Release Payment after work is submitted.

**Freelancers:** Connect wallet → Register as Freelancer → View assigned jobs → Submit Work once funds are deposited → Receive payment when client releases it.

---

## Project Structure

```
├── blockchain/
│   ├── contracts/
│   │   ├── UserRegistry.sol
│   │   └── FreelanceEscrow.sol
│   ├── scripts/deploy.js
│   └── hardhat.config.js
└── client/
    └── src/
        ├── contexts/Web3Context.jsx   # Wallet + contract logic
        ├── pages/
        │   ├── Home.jsx
        │   └── Dashboard.jsx
        └── components/
            ├── RegisterForm.jsx
            ├── PostJobForm.jsx
            └── JobsList.jsx
```

---

## Troubleshooting

- **MetaMask not connecting** — Ensure Ganache is running and the network is added to MetaMask
- **Contract errors** — Double-check addresses in `.env` and that both contracts are deployed
- **Transaction failing** — Confirm the connected wallet is registered with the correct role

---

> ⚠️ This is a development build. Do not deploy to mainnet without a security audit.
