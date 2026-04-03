import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

// Simple contract ABIs
const USER_REGISTRY_ABI = [
  "function registerClient() public",
  "function registerFreelancer() public",
  "function isClient(address _user) public view returns (bool)",
  "function isFreelancer(address _user) public view returns (bool)"
];

const ESCROW_ABI = [
  "function postJob(address _freelancer, string _description, uint256 _amount) public",
  "function depositFunds(uint256 _jobId) public payable",
  "function submitWork(uint256 _jobId) public",
  "function releasePayment(uint256 _jobId) public",
  "function getJob(uint256 _jobId) public view returns (address, address, uint256, string, bool, bool, bool)",
  "function nextJobId() public view returns (uint256)"
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
        paymentReleased: job[6]
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
    getNextJobId,
    getJob
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
}
