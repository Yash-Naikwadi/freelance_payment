import React, { createContext, useContext, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { USER_REGISTRY_ABI, FREELANCE_ESCROW_ABI, USER_REGISTRY_ADDRESS, FREELANCE_ESCROW_ADDRESS } from '../constants';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [userRegistryContract, setUserRegistryContract] = useState(null);
  const [escrowContract, setEscrowContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      setError(null);
      if (!window.ethereum) {
        setError('MetaMask is not installed');
        return false;
      }

      const newProvider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const newSigner = await newProvider.getSigner();
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdNum = parseInt(chainIdHex, 16);

      setProvider(newProvider);
      setSigner(newSigner);
      setAccount(accounts[0]);
      setChainId(chainIdNum);
      setIsConnected(true);

      // Initialize contracts
      if (USER_REGISTRY_ADDRESS && ESCROW_ADDRESS) {
        const userReg = new Contract(USER_REGISTRY_ADDRESS, USER_REGISTRY_ABI, newSigner);
        const escrow = new Contract(ESCROW_ADDRESS, FREELANCE_ESCROW_ABI, newSigner);
        setUserRegistryContract(userReg);
        setEscrowContract(escrow);
      }

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Connection error:', err);
      return false;
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setUserRegistryContract(null);
    setEscrowContract(null);
    setIsConnected(false);
    setError(null);
  };

  const registerAsClient = async () => {
    try {
      setError(null);
      if (!userRegistryContract) throw new Error('UserRegistry contract not initialized');
      const tx = await userRegistryContract.registerClient();
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
      return false;
    }
  };

  const registerAsFreelancer = async () => {
    try {
      setError(null);
      if (!userRegistryContract) throw new Error('UserRegistry contract not initialized');
      const tx = await userRegistryContract.registerFreelancer();
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
      return false;
    }
  };

  const postJob = async (freelancerAddress, description, amountInEther) => {
    try {
      setError(null);
      if (!escrowContract) throw new Error('Escrow contract not initialized');
      const amountInWei = BigInt(amountInEther * 1e18);
      const tx = await escrowContract.postJob(freelancerAddress, description, amountInWei);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Post job error:', err);
      return false;
    }
  };

  const depositFunds = async (jobId, amountInEther) => {
    try {
      setError(null);
      if (!escrowContract) throw new Error('Escrow contract not initialized');
      const amountInWei = BigInt(amountInEther * 1e18);
      const tx = await escrowContract.depositFunds(jobId, { value: amountInWei });
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Deposit error:', err);
      return false;
    }
  };

  const submitWork = async (jobId) => {
    try {
      setError(null);
      if (!escrowContract) throw new Error('Escrow contract not initialized');
      const tx = await escrowContract.submitWork(jobId);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Submit work error:', err);
      return false;
    }
  };

  const releasePayment = async (jobId) => {
    try {
      setError(null);
      if (!escrowContract) throw new Error('Escrow contract not initialized');
      const tx = await escrowContract.releasePayment(jobId);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Release payment error:', err);
      return false;
    }
  };

  const cancelJob = async (jobId) => {
    try {
      setError(null);
      if (!escrowContract) throw new Error('Escrow contract not initialized');
      const tx = await escrowContract.cancelJob(jobId);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Cancel job error:', err);
      return false;
    }
  };

  const getJob = async (jobId) => {
    try {
      if (!escrowContract) throw new Error('Escrow contract not initialized');
      const job = await escrowContract.getJob(jobId);
      return {
        client: job[0],
        freelancer: job[1],
        amount: job[2].toString(),
        description: job[3],
        fundsDeposited: job[4],
        workSubmitted: job[5],
        paymentReleased: job[6]
      };
    } catch (err) {
      console.error('Get job error:', err);
      return null;
    }
  };

  const getNextJobId = async () => {
    try {
      if (!escrowContract) throw new Error('Escrow contract not initialized');
      const nextId = await escrowContract.nextJobId();
      return nextId.toString();
    } catch (err) {
      console.error('Get next job ID error:', err);
      return null;
    }
  };

  const isClient = async (address) => {
    try {
      if (!userRegistryContract) throw new Error('UserRegistry contract not initialized');
      return await userRegistryContract.isClient(address);
    } catch (err) {
      console.error('Is client check error:', err);
      return false;
    }
  };

  const isFreelancer = async (address) => {
    try {
      if (!userRegistryContract) throw new Error('UserRegistry contract not initialized');
      return await userRegistryContract.isFreelancer(address);
    } catch (err) {
      console.error('Is freelancer check error:', err);
      return false;
    }
  };

  const value = {
    provider,
    signer,
    account,
    userRegistryContract,
    escrowContract,
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
    isFreelancer
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};