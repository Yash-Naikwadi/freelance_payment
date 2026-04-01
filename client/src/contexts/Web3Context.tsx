import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';

// Declare window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract ABIs
const USER_REGISTRY_ABI = [
  {
    inputs: [],
    name: 'registerClient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'registerFreelancer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'isClient',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'isFreelancer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const FREELANCE_ESCROW_ABI = [
  {
    inputs: [{ internalType: 'address', name: '_userRegistryAddress', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'nextJobId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_freelancer', type: 'address' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'postJob',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_jobId', type: 'uint256' }],
    name: 'depositFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_jobId', type: 'uint256' }],
    name: 'submitWork',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_jobId', type: 'uint256' }],
    name: 'releasePayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_jobId', type: 'uint256' }],
    name: 'cancelJob',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_jobId', type: 'uint256' }],
    name: 'getJob',
    outputs: [
      { internalType: 'address', name: 'client', type: 'address' },
      { internalType: 'address', name: 'freelancer', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'bool', name: 'fundsDeposited', type: 'bool' },
      { internalType: 'bool', name: 'workSubmitted', type: 'bool' },
      { internalType: 'bool', name: 'paymentReleased', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

interface Web3ContextType {
  provider: BrowserProvider | null;
  account: string | null;
  isConnected: boolean;
  chainId: number | null;
  error: string | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  registerAsClient: () => Promise<boolean>;
  registerAsFreelancer: () => Promise<boolean>;
  postJob: (freelancerAddress: string, description: string, amountInEther: string) => Promise<boolean>;
  depositFunds: (jobId: number, amountInEther: string) => Promise<boolean>;
  submitWork: (jobId: number) => Promise<boolean>;
  releasePayment: (jobId: number) => Promise<boolean>;
  cancelJob: (jobId: number) => Promise<boolean>;
  getJob: (jobId: number) => Promise<any>;
  getNextJobId: () => Promise<number | null>;
  isClient: (address: string) => Promise<boolean>;
  isFreelancer: (address: string) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userRegistryContract, setUserRegistryContract] = useState<Contract | null>(null);
  const [escrowContract, setEscrowContract] = useState<Contract | null>(null);

  const USER_REGISTRY_ADDRESS = import.meta.env.VITE_USER_REGISTRY_ADDRESS || '';
  const ESCROW_ADDRESS = import.meta.env.VITE_ESCROW_ADDRESS || '';

  const connectWallet = useCallback(async () => {
    try {
      setError(null);
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
        return false;
      }

      const newProvider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await newProvider.getSigner();
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdNum = parseInt(chainIdHex, 16);

      setProvider(newProvider);
      setAccount(accounts[0]);
      setChainId(chainIdNum);
      setIsConnected(true);

      // Initialize contracts
      if (USER_REGISTRY_ADDRESS && ESCROW_ADDRESS) {
        const userReg = new Contract(USER_REGISTRY_ADDRESS, USER_REGISTRY_ABI, signer);
        const escrow = new Contract(ESCROW_ADDRESS, FREELANCE_ESCROW_ABI, signer);
        setUserRegistryContract(userReg);
        setEscrowContract(escrow);
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Connection error:', err);
      return false;
    }
  }, [USER_REGISTRY_ADDRESS, ESCROW_ADDRESS]);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setAccount(null);
    setUserRegistryContract(null);
    setEscrowContract(null);
    setIsConnected(false);
    setError(null);
  }, []);

  const registerAsClient = useCallback(async () => {
    try {
      setError(null);
      if (!userRegistryContract) throw new Error('UserRegistry contract not initialized');
      const tx = await userRegistryContract.registerClient();
      await tx.wait();
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      console.error('Registration error:', err);
      return false;
    }
  }, [userRegistryContract]);

  const registerAsFreelancer = useCallback(async () => {
    try {
      setError(null);
      if (!userRegistryContract) throw new Error('UserRegistry contract not initialized');
      const tx = await userRegistryContract.registerFreelancer();
      await tx.wait();
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      console.error('Registration error:', err);
      return false;
    }
  }, [userRegistryContract]);

  const postJob = useCallback(
    async (freelancerAddress: string, description: string, amountInEther: string) => {
      try {
        setError(null);
        if (!escrowContract) throw new Error('Escrow contract not initialized');
        const amountInWei = parseEther(amountInEther);
        const tx = await escrowContract.postJob(freelancerAddress, description, amountInWei);
        await tx.wait();
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to post job');
        console.error('Post job error:', err);
        return false;
      }
    },
    [escrowContract]
  );

  const depositFunds = useCallback(
    async (jobId: number, amountInEther: string) => {
      try {
        setError(null);
        if (!escrowContract) throw new Error('Escrow contract not initialized');
        const amountInWei = parseEther(amountInEther);
        const tx = await escrowContract.depositFunds(jobId, { value: amountInWei });
        await tx.wait();
        return true;
      } catch (err: any) {
        setError(err.message || 'Deposit failed');
        console.error('Deposit error:', err);
        return false;
      }
    },
    [escrowContract]
  );

  const submitWork = useCallback(
    async (jobId: number) => {
      try {
        setError(null);
        if (!escrowContract) throw new Error('Escrow contract not initialized');
        const tx = await escrowContract.submitWork(jobId);
        await tx.wait();
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to submit work');
        console.error('Submit work error:', err);
        return false;
      }
    },
    [escrowContract]
  );

  const releasePayment = useCallback(
    async (jobId: number) => {
      try {
        setError(null);
        if (!escrowContract) throw new Error('Escrow contract not initialized');
        const tx = await escrowContract.releasePayment(jobId);
        await tx.wait();
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to release payment');
        console.error('Release payment error:', err);
        return false;
      }
    },
    [escrowContract]
  );

  const cancelJob = useCallback(
    async (jobId: number) => {
      try {
        setError(null);
        if (!escrowContract) throw new Error('Escrow contract not initialized');
        const tx = await escrowContract.cancelJob(jobId);
        await tx.wait();
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to cancel job');
        console.error('Cancel job error:', err);
        return false;
      }
    },
    [escrowContract]
  );

  const getJob = useCallback(
    async (jobId: number) => {
      try {
        if (!escrowContract) throw new Error('Escrow contract not initialized');
        const job = await escrowContract.getJob(jobId);
        return {
          client: job[0],
          freelancer: job[1],
          amount: formatEther(job[2]),
          description: job[3],
          fundsDeposited: job[4],
          workSubmitted: job[5],
          paymentReleased: job[6],
        };
      } catch (err: any) {
        console.error('Get job error:', err);
        return null;
      }
    },
    [escrowContract]
  );

  const getNextJobId = useCallback(async () => {
    try {
      if (!escrowContract) throw new Error('Escrow contract not initialized');
      const nextId = await escrowContract.nextJobId();
      return Number(nextId);
    } catch (err: any) {
      console.error('Get next job ID error:', err);
      return null;
    }
  }, [escrowContract]);

  const isClient = useCallback(
    async (address: string) => {
      try {
        if (!userRegistryContract) throw new Error('UserRegistry contract not initialized');
        return await userRegistryContract.isClient(address);
      } catch (err: any) {
        console.error('Is client check error:', err);
        return false;
      }
    },
    [userRegistryContract]
  );

  const isFreelancer = useCallback(
    async (address: string) => {
      try {
        if (!userRegistryContract) throw new Error('UserRegistry contract not initialized');
        return await userRegistryContract.isFreelancer(address);
      } catch (err: any) {
        console.error('Is freelancer check error:', err);
        return false;
      }
    },
    [userRegistryContract]
  );

  const value: Web3ContextType = {
    provider,
    account,
    isConnected,
    chainId,
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
    getJob,
    getNextJobId,
    isClient,
    isFreelancer,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
