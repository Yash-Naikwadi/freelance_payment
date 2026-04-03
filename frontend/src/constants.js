// Contract ABIs and constants
export const USER_REGISTRY_ABI = [
  {
    "inputs": [],
    "name": "registerClient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registerFreelancer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "isClient",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "isFreelancer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "userRoles",
    "outputs": [{ "internalType": "enum UserRegistry.UserRole", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "enum UserRegistry.UserRole", "name": "role", "type": "uint8" }
    ],
    "name": "UserRegistered",
    "type": "event"
  }
];

export const FREELANCE_ESCROW_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_userRegistryAddress", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "nextJobId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_freelancer", "type": "address" }, { "internalType": "string", "name": "_description", "type": "string" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "postJob",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "depositFunds",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "submitWork",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "releasePayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "cancelJob",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "getJob",
    "outputs": [
      { "internalType": "address", "name": "client", "type": "address" },
      { "internalType": "address", "name": "freelancer", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "bool", "name": "fundsDeposited", "type": "bool" },
      { "internalType": "bool", "name": "workSubmitted", "type": "bool" },
      { "internalType": "bool", "name": "paymentReleased", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "jobs",
    "outputs": [
      { "internalType": "address payable", "name": "client", "type": "address" },
      { "internalType": "address payable", "name": "freelancer", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "bool", "name": "fundsDeposited", "type": "bool" },
      { "internalType": "bool", "name": "workSubmitted", "type": "bool" },
      { "internalType": "bool", "name": "paymentReleased", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "jobId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "client", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "description", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "JobPosted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "jobId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "client", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "FundsDeposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "jobId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "freelancer", "type": "address" }
    ],
    "name": "WorkSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "jobId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "client", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "PaymentReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "jobId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "client", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "JobCancelled",
    "type": "event"
  }
];

// Contract addresses (these would be deployed contract addresses)
export const USER_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Local Ganache
export const FREELANCE_ESCROW_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Local Ganache