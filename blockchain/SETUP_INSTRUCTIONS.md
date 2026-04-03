# FreelanceChain - Setup & Deployment Instructions

## Quick Start

### 1. Install Dependencies
```bash
cd freelance-payment-system
pnpm install
```

### 2. Start Development Server
```bash
pnpm run dev
```
The app will be available at `http://localhost:3000`

### 3. Deploy Smart Contracts to Ganache

#### Step 1: Start Ganache
```bash
ganache-cli --host 127.0.0.1 --port 8545 --deterministic
```

#### Step 2: Deploy Contracts using Remix
1. Go to https://remix.ethereum.org
2. Create files:
   - `UserRegistry.sol` - Copy from `contracts/UserRegistry.sol`
   - `FreelanceEscrow.sol` - Copy from `contracts/FreelanceEscrow.sol`
3. Compile both contracts (Solidity 0.8.0+)
4. Deploy UserRegistry first
5. Deploy FreelanceEscrow with UserRegistry address as constructor parameter
6. Copy both deployed contract addresses

#### Step 3: Configure Environment
Create `.env.local` file in project root:
```env
VITE_USER_REGISTRY_ADDRESS=0x<UserRegistry_Address>
VITE_ESCROW_ADDRESS=0x<FreelanceEscrow_Address>
```

#### Step 4: Configure MetaMask
1. Add Ganache network to MetaMask:
   - Network Name: Ganache
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency: ETH

2. Import Ganache accounts (copy private keys from Ganache output)

### 4. Test the Application

1. **Connect Wallet**
   - Click "Connect MetaMask Wallet"
   - Approve connection

2. **Register**
   - Choose "Client" or "Freelancer" role

3. **Post Job (if Client)**
   - Go to "Post Job" tab
   - Enter freelancer address, description, amount

4. **Deposit Funds (if Client)**
   - Click "Deposit Funds" button
   - Approve transaction

5. **Submit Work (if Freelancer)**
   - Switch to freelancer account in MetaMask
   - Click "Submit Work"

6. **Release Payment (if Client)**
   - Switch back to client account
   - Click "Release Payment"

## Project Structure

```
freelance-payment-system/
├── client/src/
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   ├── contexts/
│   │   └── Web3Context.jsx     # Blockchain integration
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   └── Dashboard.jsx       # Main dashboard
│   ├── components/
│   │   ├── RegisterForm.jsx    # Role selection
│   │   ├── PostJobForm.jsx     # Create job
│   │   └── JobsList.jsx        # View jobs
│   └── styles/
│       ├── Home.css
│       ├── Dashboard.css
│       ├── RegisterForm.css
│       ├── PostJobForm.css
│       └── JobsList.css
├── contracts/
│   ├── UserRegistry.sol        # User registration
│   └── FreelanceEscrow.sol     # Job & payment escrow
└── package.json
```

## Available Scripts

```bash
# Development
pnpm run dev          # Start dev server

# Production
pnpm run build        # Build for production
pnpm run preview      # Preview production build

# Linting
pnpm run check        # TypeScript check
pnpm run format       # Format code
```

## Technology Stack

- **Frontend**: React 19 + JavaScript (no TypeScript)
- **Blockchain**: ethers.js v6
- **Styling**: Plain CSS
- **Build Tool**: Vite
- **Smart Contracts**: Solidity 0.8.0+

## Key Features

✅ MetaMask wallet integration  
✅ Dual role system (Client/Freelancer)  
✅ Job posting and management  
✅ Escrow-based payments  
✅ Real-time job status tracking  
✅ Simple, clean JavaScript code  
✅ Responsive design  

## Troubleshooting

### White Screen
- Check browser console for errors
- Ensure MetaMask is installed
- Verify Ganache is running

### Contract Not Found
- Check contract addresses in `.env.local`
- Verify contracts are deployed to Ganache
- Ensure addresses are correct (start with 0x)

### Transaction Fails
- Verify user is registered with correct role
- Check Ganache has sufficient gas
- Ensure job ID exists

### MetaMask Connection Issues
- Add Ganache network to MetaMask
- Use Chain ID: 1337
- RPC URL: http://127.0.0.1:7545

## Support

For detailed setup instructions, see:
- `GANACHE_DEPLOYMENT_GUIDE.md` - Ganache setup
- `SMART_CONTRACTS_SETUP.md` - Contract deployment
- `README.md` - Project overview

---

**Happy freelancing! 🚀**
