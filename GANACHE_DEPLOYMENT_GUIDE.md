# FreelanceChain - Ganache Deployment & Setup Guide

This guide will help you deploy the FreelanceChain smart contracts to Ganache and connect them to the frontend application.

---

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
2. **Ganache CLI** or **Ganache GUI**
   - Install via npm: `npm install -g ganache-cli`
   - Or download GUI from: https://www.trufflesuite.com/ganache
3. **MetaMask** browser extension
4. **Remix IDE** (https://remix.ethereum.org) - For contract deployment

---

## Step 1: Start Ganache

### Option A: Using Ganache CLI

```bash
ganache-cli --host 127.0.0.1 --port 8545 --deterministic
```

**Important flags:**
- `--host 127.0.0.1`: Binds to localhost
- `--port 8545`: Uses standard Ethereum RPC port
- `--deterministic`: Generates the same accounts each time (useful for testing)

### Option B: Using Ganache GUI

1. Open Ganache GUI
2. Click "New Workspace"
3. Set RPC Server to `127.0.0.1:8545`
4. Click "Start"

**Expected output:**
```
Ganache v7.x.x started successfully
Listening on 127.0.0.1:8545
```

---

## Step 2: Configure MetaMask

### Add Ganache Network to MetaMask

1. Open MetaMask
2. Click the network dropdown (top-left)
3. Click "Add Network" or "Add a custom network"
4. Fill in the following details:

   | Field | Value |
   |-------|-------|
   | Network Name | Ganache |
   | RPC URL | http://127.0.0.1:8545 |
   | Chain ID | 1337 |
   | Currency Symbol | ETH |
   | Block Explorer URL | (leave blank) |

5. Click "Save"

### Import Ganache Accounts

1. In Ganache CLI/GUI, you'll see 10 accounts with private keys
2. Copy the first account's private key
3. In MetaMask:
   - Click the account icon (top-right)
   - Select "Import Account"
   - Paste the private key
   - Click "Import"
4. Repeat for additional accounts as needed

**Example Ganache Output:**
```
Available Accounts
==================
(0) 0x1234567890123456789012345678901234567890
(1) 0x0987654321098765432109876543210987654321
...

Private Keys
==================
(0) 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
(1) 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
...
```

---

## Step 3: Deploy Smart Contracts

### Using Remix IDE (Recommended for Beginners)

1. Go to https://remix.ethereum.org
2. Create two new files:
   - `UserRegistry.sol`
   - `FreelanceEscrow.sol`
3. Copy the contract code from your `contracts/` directory into these files
4. In the Solidity Compiler tab:
   - Select compiler version `0.8.0` or higher
   - Click "Compile UserRegistry.sol"
   - Click "Compile FreelanceEscrow.sol"
5. In the Deploy & Run Transactions tab:
   - Set Environment to "Injected Provider - MetaMask"
   - Ensure MetaMask is connected to Ganache network
   - Make sure you're using Account (0) from Ganache
6. Deploy contracts in order:
   - **First**: Deploy `UserRegistry.sol`
     - Click "Deploy"
     - Copy the deployed contract address
   - **Second**: Deploy `FreelanceEscrow.sol`
     - In the constructor field, paste the UserRegistry address
     - Click "Deploy"
     - Copy the deployed contract address

### Using Hardhat (Advanced)

If you prefer command-line deployment:

```bash
# Install Hardhat
npm install --save-dev hardhat

# Create hardhat.config.js with Ganache network
# Deploy using: npx hardhat run scripts/deploy.js --network ganache
```

---

## Step 4: Update Environment Variables

After deploying the contracts, update your frontend configuration:

1. Open the FreelanceChain frontend project
2. Create a `.env.local` file in the project root:

```env
VITE_USER_REGISTRY_ADDRESS=0x<UserRegistry_Address>
VITE_ESCROW_ADDRESS=0x<FreelanceEscrow_Address>
```

**Example:**
```env
VITE_USER_REGISTRY_ADDRESS=0x5FbDB2315678afccb333f8a9c45b65d30061dde69
VITE_ESCROW_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

3. Save the file
4. Restart the development server:
   ```bash
   npm run dev
   ```

---

## Step 5: Test the Application

### Workflow Test

1. **Connect Wallet**
   - Visit http://localhost:3000
   - Click "Connect MetaMask Wallet"
   - Approve the connection in MetaMask
   - You should see your wallet address in the top-right

2. **Register as Client**
   - Choose "Register as Client"
   - Approve the transaction in MetaMask
   - Wait for confirmation

3. **Post a Job**
   - Go to "Jobs" tab
   - Enter a freelancer's wallet address (use Account 1 from Ganache)
   - Enter job description and amount (e.g., 0.5 ETH)
   - Click "Post Job"
   - Approve transaction

4. **Switch to Freelancer Account**
   - In MetaMask, switch to Account 1
   - Refresh the page
   - Register as Freelancer

5. **Deposit Funds (as Client)**
   - Switch back to Account 0
   - Go to Jobs tab
   - Click "Deposit Funds"
   - Approve transaction

6. **Submit Work (as Freelancer)**
   - Switch to Account 1
   - Go to Jobs tab
   - Click "Submit Work"
   - Approve transaction

7. **Release Payment (as Client)**
   - Switch back to Account 0
   - Go to Jobs tab
   - Click "Release Payment"
   - Approve transaction
   - Verify payment was received in Account 1

---

## Troubleshooting

### MetaMask Connection Issues

**Problem**: "MetaMask is not installed"
- **Solution**: Install MetaMask extension from https://metamask.io

**Problem**: "Wrong network"
- **Solution**: 
  1. Check Ganache is running on `127.0.0.1:8545`
  2. Verify MetaMask is set to Ganache network
  3. Ensure Chain ID is `1337`

### Contract Deployment Issues

**Problem**: "Contract address not found"
- **Solution**:
  1. Verify contracts compiled without errors in Remix
  2. Check MetaMask is connected to correct account
  3. Ensure sufficient gas (Ganache provides unlimited gas)

**Problem**: "Invalid contract address in .env"
- **Solution**:
  1. Copy address from Remix deployment output (not the transaction hash)
  2. Ensure address starts with `0x` and is 42 characters long
  3. Restart dev server after updating .env

### Transaction Failures

**Problem**: "Transaction reverted"
- **Solution**:
  1. Check contract requirements (e.g., must register before posting job)
  2. Verify you're using the correct account
  3. Check job ID exists (start from ID 1)

**Problem**: "Insufficient funds"
- **Solution**: Ganache provides unlimited funds; check account is properly imported

---

## Contract Interaction Reference

### UserRegistry Contract

**Functions:**
- `registerClient()` - Register sender as a client
- `registerFreelancer()` - Register sender as a freelancer
- `isClient(address)` - Check if address is a client
- `isFreelancer(address)` - Check if address is a freelancer

### FreelanceEscrow Contract

**Functions:**
- `postJob(address _freelancer, string _description, uint256 _amount)` - Post a new job
- `depositFunds(uint256 _jobId)` - Deposit funds for a job (payable)
- `submitWork(uint256 _jobId)` - Submit work as freelancer
- `releasePayment(uint256 _jobId)` - Release payment to freelancer
- `cancelJob(uint256 _jobId)` - Cancel job and refund funds
- `getJob(uint256 _jobId)` - Get job details
- `nextJobId` - Get the next available job ID

---

## Advanced: Resetting Ganache

If you need to reset Ganache and start fresh:

1. Stop Ganache (Ctrl+C)
2. Delete the Ganache data directory (if using CLI)
3. Restart Ganache with `--deterministic` flag
4. Re-import accounts to MetaMask
5. Redeploy contracts
6. Update .env with new contract addresses

---

## Security Notes

⚠️ **Important**: This setup is for **development and testing only**.

- Never use real funds on Ganache
- Private keys shown in Ganache are for testing only
- Always use proper security practices for production deployments
- Never commit `.env` files with real contract addresses to version control

---

## Next Steps

After successful deployment:

1. Explore the FreelanceChain dashboard
2. Test all workflow scenarios
3. Review smart contract code for security
4. Consider deploying to testnet (Sepolia, Goerli) for further testing
5. Plan mainnet deployment strategy

---

## Support

For issues or questions:

1. Check Ganache logs for transaction details
2. Verify MetaMask is on correct network
3. Ensure contract addresses are correct in .env
4. Review contract ABIs in Web3Context.tsx
5. Check browser console for JavaScript errors

---

**Happy testing! 🚀**
