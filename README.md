# FreelanceChain - Secure Blockchain-Based Freelance Payment System

A professional, blockchain-integrated freelance payment platform built with React and Solidity smart contracts. FreelanceChain enables secure, transparent job posting, work submission, and payment release using Ethereum escrow contracts.

---

## 🎯 Project Overview

**FreelanceChain** is a decentralized freelance marketplace that eliminates intermediaries and provides complete transparency through blockchain technology. Clients can post jobs, deposit funds securely, and release payments upon work completion. Freelancers can browse available jobs, submit work, and receive instant payment directly to their wallets.

### Key Features

- **Wallet Integration**: Connect MetaMask to manage your account
- **Dual Role System**: Register as either a Client or Freelancer
- **Escrow Protection**: Funds held securely until work is approved
- **Instant Settlement**: Payments released directly on-chain
- **Transparent Workflow**: All transactions recorded on blockchain
- **Professional UI**: Clean, intuitive interface designed for trust and usability

---

## 🏗️ Architecture

### Smart Contracts (Solidity)

**UserRegistry.sol**
- Manages user registration and role assignment
- Supports two roles: Client and Freelancer
- Provides role verification functions

**FreelanceEscrow.sol**
- Handles job posting, fund deposits, and payment release
- Implements escrow logic for secure transactions
- Manages job lifecycle and status tracking

### Frontend (React + TypeScript)

- **Web3Context**: Manages blockchain connection and contract interaction
- **Dashboard**: Main application interface with role-based views
- **Components**: Modular UI components for registration, job posting, and job browsing
- **Styling**: Tailwind CSS with professional design tokens

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- MetaMask browser extension
- Ganache CLI or GUI (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freelance-payment-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Ganache**
   ```bash
   ganache-cli --host 127.0.0.1 --port 8545 --deterministic
   ```

4. **Deploy smart contracts**
   - Follow the [Ganache Deployment Guide](./GANACHE_DEPLOYMENT_GUIDE.md)
   - Update `.env.local` with contract addresses

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📋 Project Structure

```
freelance-payment-system/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── PostJobForm.tsx
│   │   │   ├── JobsList.tsx
│   │   │   └── MyJobsView.tsx
│   │   ├── contexts/
│   │   │   ├── Web3Context.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── NotFound.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── contracts/
│   ├── UserRegistry.sol
│   └── FreelanceEscrow.sol
├── GANACHE_DEPLOYMENT_GUIDE.md
├── README.md
└── package.json
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_USER_REGISTRY_ADDRESS=0x<UserRegistry_Address>
VITE_ESCROW_ADDRESS=0x<FreelanceEscrow_Address>
```

Replace with actual contract addresses after deployment.

### Ganache Network Settings

| Setting | Value |
|---------|-------|
| RPC URL | http://127.0.0.1:8545 |
| Chain ID | 1337 |
| Currency | ETH |

---

## 💼 Usage Workflow

### For Clients

1. **Connect Wallet**
   - Click "Connect MetaMask Wallet" on home page
   - Approve connection in MetaMask

2. **Register as Client**
   - Select "Register as Client" role
   - Approve transaction

3. **Post a Job**
   - Go to "Jobs" tab
   - Enter freelancer's wallet address
   - Describe the job and set payment amount
   - Click "Post Job"

4. **Deposit Funds**
   - View posted job
   - Click "Deposit Funds"
   - Approve transaction to lock funds in escrow

5. **Release Payment**
   - Once freelancer submits work
   - Review and click "Release Payment"
   - Payment sent directly to freelancer's wallet

### For Freelancers

1. **Connect Wallet**
   - Click "Connect MetaMask Wallet"
   - Approve connection

2. **Register as Freelancer**
   - Select "Register as Freelancer" role
   - Approve transaction

3. **Browse Jobs**
   - Go to "Jobs" tab
   - View available jobs posted by clients

4. **Submit Work**
   - Once funds are deposited
   - Click "Submit Work"
   - Approve transaction

5. **Receive Payment**
   - Wait for client to review
   - Receive payment in your wallet upon release

---

## 🎨 Design Philosophy

**Enterprise Minimalism with Blockchain Confidence**

The design balances professional fintech aesthetics with blockchain innovation:

- **Color Palette**: Deep Slate (trust), Vibrant Teal (innovation), Warm Amber (caution), Success Green (confirmation)
- **Typography**: Geist (display) + Inter (body) for clear hierarchy
- **Layout**: Asymmetric dashboard avoiding generic centered grids
- **Interactions**: Smooth micro-interactions and progressive disclosure
- **Accessibility**: Full keyboard navigation and WCAG compliance

---

## 🔐 Security Considerations

### Smart Contracts

- Role-based access control (Client/Freelancer)
- Escrow protection for fund security
- Exact amount matching for deposits
- Sequential workflow enforcement

### Frontend

- MetaMask wallet integration for secure authentication
- Environment variables for contract addresses
- Error handling and user feedback
- Transaction confirmation UI

### Development

⚠️ **Important**: This is a development implementation. For production:

- Conduct security audits
- Use testnet before mainnet
- Implement additional security measures
- Consider multi-sig wallets
- Add rate limiting and DOS protection

---

## 📚 Smart Contract Reference

### UserRegistry Functions

```solidity
// Register as a client
registerClient()

// Register as a freelancer
registerFreelancer()

// Check if address is a client
isClient(address _user) → bool

// Check if address is a freelancer
isFreelancer(address _user) → bool
```

### FreelanceEscrow Functions

```solidity
// Post a new job
postJob(address _freelancer, string _description, uint256 _amount)

// Deposit funds for a job
depositFunds(uint256 _jobId) payable

// Submit work as freelancer
submitWork(uint256 _jobId)

// Release payment to freelancer
releasePayment(uint256 _jobId)

// Cancel job and refund funds
cancelJob(uint256 _jobId)

// Get job details
getJob(uint256 _jobId) → (address, address, uint256, string, bool, bool, bool)
```

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run check
```

### Adding New Features

1. Create components in `client/src/components/`
2. Add pages in `client/src/pages/`
3. Update Web3Context for new contract interactions
4. Update Dashboard routing as needed
5. Test with Ganache before deployment

---

## 🐛 Troubleshooting

### Common Issues

**MetaMask not connecting**
- Ensure MetaMask is installed
- Check Ganache is running on 127.0.0.1:8545
- Verify network is added to MetaMask

**Contract addresses not working**
- Verify addresses in `.env.local`
- Ensure contracts are deployed
- Check addresses match Remix deployment output

**Transactions failing**
- Verify user is registered with correct role
- Check job ID exists
- Ensure sufficient funds (Ganache provides unlimited)

**UI not loading**
- Check browser console for errors
- Verify all dependencies installed: `npm install`
- Restart dev server: `npm run dev`

---

## 📖 Additional Resources

- [Ganache Deployment Guide](./GANACHE_DEPLOYMENT_GUIDE.md)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethereum Development Guide](https://ethereum.org/en/developers/)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📧 Support

For issues, questions, or suggestions:

1. Check the [Ganache Deployment Guide](./GANACHE_DEPLOYMENT_GUIDE.md)
2. Review the troubleshooting section above
3. Check browser console for error messages
4. Review smart contract code for business logic

---

**Built with ❤️ for secure, transparent freelance payments on blockchain**

**Version**: 1.0.0  
**Last Updated**: April 2026
