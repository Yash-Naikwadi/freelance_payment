# Smart Contracts Setup & Deployment

This document provides detailed instructions for deploying the FreelanceChain smart contracts to Ganache.

---

## Contract Overview

### UserRegistry.sol

**Purpose**: Manages user registration and role assignment

**Key Features**:
- Two-role system: Client and Freelancer
- One-time registration per address
- Role verification functions

**Deployment**: No constructor parameters

### FreelanceEscrow.sol

**Purpose**: Handles job posting, fund deposits, and payment release

**Key Features**:
- Job lifecycle management
- Escrow protection for funds
- Event logging for all transactions

**Deployment**: Requires UserRegistry contract address as constructor parameter

---

## Deployment Methods

### Method 1: Remix IDE (Recommended for Beginners)

#### Step 1: Prepare Contracts

1. Go to https://remix.ethereum.org
2. Create two new files:
   - Click "Create New File"
   - Name it `UserRegistry.sol`
   - Paste the contract code

3. Repeat for `FreelanceEscrow.sol`

#### Step 2: Compile Contracts

1. Click the "Solidity Compiler" tab (left sidebar)
2. Select compiler version `0.8.0` or higher
3. For each contract:
   - Select the contract file
   - Click "Compile [ContractName]"
   - Verify no errors appear

#### Step 3: Deploy UserRegistry

1. Click "Deploy & Run Transactions" tab
2. Set Environment to "Injected Provider - MetaMask"
3. Ensure MetaMask is:
   - Connected to Ganache network
   - Using Account 0
4. Select "UserRegistry" from dropdown
5. Click "Deploy"
6. Approve transaction in MetaMask
7. **Copy the deployed contract address** (shown in Remix output)

**Example Output**:
```
UserRegistry at 0x5FbDB2315678afccb333f8a9c45b65d30061dde69 (0x5FbDB2315678afccb333f8a9c45b65d30061dde69)
```

#### Step 4: Deploy FreelanceEscrow

1. Select "FreelanceEscrow" from dropdown
2. In the constructor parameter field, enter the UserRegistry address:
   ```
   0x5FbDB2315678afccb333f8a9c45b65d30061dde69
   ```
3. Click "Deploy"
4. Approve transaction in MetaMask
5. **Copy the deployed contract address**

**Example Output**:
```
FreelanceEscrow at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 (0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512)
```

---

### Method 2: Hardhat (Advanced)

#### Step 1: Setup Hardhat Project

```bash
# Install Hardhat
npm install --save-dev hardhat@2.22.0 @nomiclabs/hardhat-ethers@2.2.3 ethers@5.7.2

# Initialize Hardhat project
npx hardhat

# Install 
npm install --save-dev @nomicfoundation/hardhat-ethers ethers
```

#### Step 2: Create Deployment Script

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy UserRegistry
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy();
  await userRegistry.deployed();
  console.log("UserRegistry deployed to:", userRegistry.address);

  // Deploy FreelanceEscrow
  const FreelanceEscrow = await hre.ethers.getContractFactory("FreelanceEscrow");
  const freelanceEscrow = await FreelanceEscrow.deploy(userRegistry.address);
  await freelanceEscrow.deployed();
  console.log("FreelanceEscrow deployed to:", freelanceEscrow.address);

  // Save addresses
  const addresses = {
    userRegistry: userRegistry.address,
    freelanceEscrow: freelanceEscrow.address,
  };
  console.log("\n=== Deployment Addresses ===");
  console.log(JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

#### Step 3: Configure Hardhat

Update `hardhat.config.js`:

```javascript
module.exports = {
  solidity: "0.8.0",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        // Add more private keys from Ganache
      ],
    },
  },
};
```

#### Step 4: Deploy

```bash
Remove-Item -Recurse -Force artifacts, cache
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache
```

---

## Verification

### Check Deployment in Remix

1. In Remix, go to "Deploy & Run Transactions"
2. Under "Deployed Contracts", you should see:
   - UserRegistry instance
   - FreelanceEscrow instance
3. Click to expand and verify functions are accessible

### Test Contract Functions

#### Test UserRegistry

1. Expand UserRegistry in Remix
2. Click `registerClient()`
3. Approve transaction in MetaMask
4. Call `isClient(0x...)` with your address
5. Should return `true`

#### Test FreelanceEscrow

1. Expand FreelanceEscrow in Remix
2. Call `nextJobId()` - should return `1`
3. Verify constructor parameter:
   - Call `userRegistry()`
   - Should return UserRegistry address

---

## Contract Addresses Configuration

### Update Frontend

After deployment, update your frontend configuration:

1. Create `.env.local` in project root:

```env
VITE_USER_REGISTRY_ADDRESS=0x5FbDB2315678afccb333f8a9c45b65d30061dde69
VITE_ESCROW_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

2. Restart development server:

```bash
npm run dev
```

3. Verify in browser:
   - Open DevTools Console
   - Should see no errors about missing contract addresses

---

## Contract Interaction Examples

### Using Remix Console

#### Register as Client

```javascript
// In Remix console
await userRegistry.registerClient()
```

#### Post a Job

```javascript
// Get freelancer address
const freelancerAddress = "0x0987654321098765432109876543210987654321"

// Post job with 1 ETH payment
await freelanceEscrow.postJob(
  freelancerAddress,
  "Build a website",
  ethers.utils.parseEther("1.0")
)
```

#### Deposit Funds

```javascript
// Deposit 1 ETH for job ID 1
await freelanceEscrow.depositFunds(1, {
  value: ethers.utils.parseEther("1.0")
})
```

---

## Troubleshooting

### Compilation Errors

**Error**: "ParserError: Source file requires different compiler version"

**Solution**:
- Update pragma in contract: `pragma solidity ^0.8.0;`
- Select matching compiler in Remix

### Deployment Errors

**Error**: "Error: VM Exception while processing transaction: revert"

**Solution**:
- Check MetaMask is connected to Ganache
- Verify account has sufficient balance
- Ensure correct parameters passed to constructor

### Contract Not Found

**Error**: "Contract address not found at 0x..."

**Solution**:
- Verify address in .env matches Remix deployment
- Ensure address starts with `0x` and is 42 characters
- Check contract was successfully deployed (no errors)

### Function Call Errors

**Error**: "Error: call revert exception"

**Solution**:
- Verify caller meets role requirements
- Check job ID exists
- Ensure funds are deposited before submitting work

---

## Network Configuration Reference

### Ganache Default Settings

| Parameter | Value |
|-----------|-------|
| Host | 127.0.0.1 |
| Port | 8545 |
| Chain ID | 1337 |
| Network ID | 5777 |
| Gas Limit | Unlimited |
| Gas Price | 2 Gwei |
| Accounts | 10 |
| Initial Balance | 100 ETH each |

### MetaMask Configuration

| Setting | Value |
|---------|-------|
| Network Name | Ganache |
| RPC URL | http://127.0.0.1:8545 |
| Chain ID | 1337 |
| Currency Symbol | ETH |

---

## Security Checklist

- [ ] Contracts compile without warnings
- [ ] Deployment addresses verified in Remix
- [ ] Contract addresses updated in .env
- [ ] Frontend connects successfully
- [ ] All functions callable without errors
- [ ] Role-based access control working
- [ ] Fund deposits and releases working
- [ ] Events emitted correctly

---

## Next Steps

1. ✅ Deploy contracts to Ganache
2. ✅ Update frontend configuration
3. ✅ Test all contract functions
4. ⏭️ Test complete workflow in frontend
5. ⏭️ Deploy to testnet (Sepolia/Goerli)
6. ⏭️ Conduct security audit
7. ⏭️ Plan mainnet deployment

---

## Additional Resources

- [Solidity Docs](https://docs.soliditylang.org/)
- [Remix IDE](https://remix.ethereum.org/)
- [Hardhat Docs](https://hardhat.org/docs)
- [Ganache Docs](https://www.trufflesuite.com/ganache)
- [ethers.js Docs](https://docs.ethers.org/)

---

**Happy deploying! 🚀**
