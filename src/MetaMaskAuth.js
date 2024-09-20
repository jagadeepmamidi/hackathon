import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Wallet, UserCheck, Key } from 'lucide-react';

const contractABI = [
  {
    "inputs": [],
    "name": "authenticate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isAuthenticated",
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "UserAuthenticated",
    "type": "event"
  }
];
const contractAddress = "0x1234567890123456789012345678901234567890";

function MetaMaskAuth() {
  const [account, setAccount] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    const provider = await detectEthereumProvider();
    if (provider) {
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        checkAuthentication(accounts[0]);
      }
    }
  }

  async function connectWallet() {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        checkAuthentication(accounts[0]);
      } else {
        toast.error("Please install MetaMask!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  }

  async function checkAuthentication(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const authenticated = await contract.isAuthenticated(address);
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error(error);
      toast.error("Failed to check authentication status");
    }
  }

  async function authenticate() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.authenticate();
      await tx.wait();
      setIsAuthenticated(true);
      toast.success("Successfully authenticated!");
    } catch (error) {
      console.error(error);
      toast.error("Authentication failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">MetaMask Authentication</h2>
        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 flex items-center justify-center"
          >
            <Wallet className="mr-2" size={20} />
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">
              Connected Account:
              <span className="font-mono text-sm block mt-1 bg-gray-100 p-2 rounded">
                {account}
              </span>
            </p>
            {isAuthenticated ? (
              <div className="bg-green-100 border-l-4 border-green-500 p-4 flex items-center">
                <UserCheck className="text-green-500 mr-2" size={24} />
                <p className="text-green-700">You are authenticated!</p>
              </div>
            ) : (
              <button
                onClick={authenticate}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 flex items-center justify-center"
              >
                <Key className="mr-2" size={20} />
                Authenticate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MetaMaskAuth;