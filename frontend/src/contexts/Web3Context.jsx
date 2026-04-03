import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

// Simple contract ABIs
const USER_REGISTRY_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum UserRegistry.UserRole",
          "name": "role",
          "type": "uint8"
        }
      ],
      "name": "UserRegistered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "isClient",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "isFreelancer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
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
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userRoles",
      "outputs": [
        {
          "internalType": "enum UserRegistry.UserRole",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const ESCROW_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userRegistryAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundsDeposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "client",
          "type": "address"
        }
      ],
      "name": "JobCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "JobPosted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PaymentReleased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        }
      ],
      "name": "WorkSubmitted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        }
      ],
      "name": "cancelJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        }
      ],
      "name": "depositFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        }
      ],
      "name": "getJob",
      "outputs": [
        {
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "fundsDeposited",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "workSubmitted",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "paymentReleased",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "cancelled",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "jobs",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "client",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "freelancer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "fundsDeposited",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "workSubmitted",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "paymentReleased",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "cancelled",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextJobId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_freelancer",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "postJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        }
      ],
      "name": "releasePayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        }
      ],
      "name": "submitWork",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "userRegistry",
      "outputs": [
        {
          "internalType": "contract UserRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userRegistry, setUserRegistry] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    try {
      setError(null);
      if (!window.ethereum) {
        setError("MetaMask is not installed");
        return false;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);

      // Initialize contracts
      const userRegistryAddr = import.meta.env.VITE_USER_REGISTRY_ADDRESS;
      const escrowAddr = import.meta.env.VITE_ESCROW_ADDRESS;

      if (userRegistryAddr && escrowAddr) {
        const userReg = new ethers.Contract(userRegistryAddr, USER_REGISTRY_ABI, signer);
        const escrowContract = new ethers.Contract(escrowAddr, ESCROW_ABI, signer);
        
        setUserRegistry(userReg);
        setEscrow(escrowContract);

        // Check user role
        const isClientUser = await userReg.isClient(accounts[0]);
        const isFreelancerUser = await userReg.isFreelancer(accounts[0]);
        setIsClient(isClientUser);
        setIsFreelancer(isFreelancerUser);
      }

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsClient(false);
    setIsFreelancer(false);
  };

  // Register as client
  const registerAsClient = async () => {
    try {
      setError(null);
      if (!userRegistry) {
        setError("Contracts not initialized");
        return false;
      }

      const tx = await userRegistry.registerClient();
      await tx.wait();
      setIsClient(true);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Register as freelancer
  const registerAsFreelancer = async () => {
    try {
      setError(null);
      if (!userRegistry) {
        setError("Contracts not initialized");
        return false;
      }

      const tx = await userRegistry.registerFreelancer();
      await tx.wait();
      setIsFreelancer(true);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Post job
  const postJob = async (freelancerAddress, description, amount) => {
    try {
      setError(null);
      if (!escrow) {
        setError("Escrow contract not initialized");
        return false;
      }

      const amountInWei = ethers.parseEther(amount);
      const tx = await escrow.postJob(freelancerAddress, description, amountInWei);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Deposit funds
  const depositFunds = async (jobId, amount) => {
    try {
      setError(null);
      if (!escrow) {
        setError("Escrow contract not initialized");
        return false;
      }

      const amountInWei = ethers.parseEther(amount);
      const tx = await escrow.depositFunds(jobId, { value: amountInWei });
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Submit work
  const submitWork = async (jobId) => {
    try {
      setError(null);
      if (!escrow) {
        setError("Escrow contract not initialized");
        return false;
      }

      const tx = await escrow.submitWork(jobId);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Release payment
  const releasePayment = async (jobId) => {
    try {
      setError(null);
      if (!escrow) {
        setError("Escrow contract not initialized");
        return false;
      }

      const tx = await escrow.releasePayment(jobId);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Cancel job
  const cancelJob = async (jobId) => {
    try {
      setError(null);
      if (!escrow) {
        setError("Escrow contract not initialized");
        return false;
      }

      const tx = await escrow.cancelJob(jobId);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Get next job ID
  const getNextJobId = async () => {
    try {
      if (!escrow) return 0;
      const nextId = await escrow.nextJobId();
      return Number(nextId);
    } catch (err) {
      console.error(err);
      return 0;
    }
  };

  // Get job details
  const getJob = async (jobId) => {
    try {
      if (!escrow) return null;
      const job = await escrow.getJob(jobId);
      return {
        client: job[0],
        freelancer: job[1],
        amount: ethers.formatEther(job[2]),
        description: job[3],
        fundsDeposited: job[4],
        workSubmitted: job[5],
        paymentReleased: job[6],
        cancelled: job[7]
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const value = {
    account,
    provider,
    signer,
    isClient,
    isFreelancer,
    error,
    connectWallet,
    disconnectWallet,
    registerAsClient,
    registerAsFreelancer,
    postJob,
    depositFunds,
    submitWork,
    releasePayment,
    cancelJob,
    getNextJobId,
    getJob
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
}
