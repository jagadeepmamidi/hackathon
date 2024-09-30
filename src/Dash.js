import React, { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { BarChart, Users, DollarSign, ShoppingCart, Plus, Download, Upload } from 'lucide-react';
import { Buffer } from 'buffer';

// IPFS client setup
const INFURA_PROJECT_ID = '2ea6e886cc574f26b0168e1cb2aefedb';
const INFURA_PROJECT_SECRET = 'hZWNQWi92RzXsX6GqvdIqySQ2PlUvIo6mHCYSWOPUoW141N9i8k/qQ';  // Replace with your Infura secret
const INFURA_ENDPOINT = `https://holesky.infura.io/v3/${INFURA_PROJECT_ID}`;


const auth = 'Basic ' + Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_PROJECT_SECRET).toString('base64');

// Updated IPFS client setup
let ipfs;
try {
  ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    }
  });
} catch (error) {
  console.error('IPFS client creation failed:', error);
}


// Smart contract ABI and address (you'll need to replace these with your actual contract details)
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
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
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "provider",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "ServiceListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "provider",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      }
    ],
    "name": "ServicePurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "UserAuthenticated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "authenticatedUsers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "serviceCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "services",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "provider",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isPurchased",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "listService",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "purchaseService",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
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
        "name": "_user",
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
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getService",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "provider",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isPurchased",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "internalType": "struct Marketplace.Service",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
const contractAddress = "0xff7DDb0D0CD05F08a299ae10d5a3ceC3F04fE10d";

const Dashboard = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const setupProvider = async () => {
      try {
        const response = await fetch(INFURA_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 1
          })
        });

        const data = await response.json();
        console.log("Connected to Infura:", data);

        // Set up provider
        const provider = new ethers.JsonRpcProvider(INFURA_ENDPOINT);
        setProvider(provider);
      } catch (error) {
        console.error('Provider setup error:', error);
        showNotification('Error setting up Ethereum provider', 'error');
      }
    };

    setupProvider();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const addNewItem = async () => {
    try {
      if (!ipfs) {
        throw new Error('IPFS is not configured correctly.');
      }

      if (!provider) {
        throw new Error('Ethereum provider is not available.');
      }

      if (!name || !description || !price || !file) {
        throw new Error('Please fill in all fields and select a file.');
      }

      // Read file contents
      const fileBuffer = await readFileAsArrayBuffer(file);

      // Upload to IPFS
      const added = await ipfs.add(Buffer.from(fileBuffer));
      const ipfsHash = added.path;

      // Interact with contract
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.listService(name, description, ethers.parseEther(price.toString()), ipfsHash);
      await tx.wait();

      showNotification('Item added successfully!', 'success');
      setName('');
      setDescription('');
      setPrice('');
      setFile(null);
    } catch (error) {
      console.error('Error adding item:', error);
      showNotification(`Failed to add item: ${error.message}`, 'error');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {notification && (
        <div className={`p-4 mb-4 rounded ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {notification.message}
        </div>
      )}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryBox icon={<BarChart />} title="Total Sales" value="0" />
        <SummaryBox icon={<Users />} title="Total Users" value="1" />
        <SummaryBox icon={<DollarSign />} title="Revenue" value="$2" />
        <SummaryBox icon={<ShoppingCart />} title="Orders" value="3" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price (in ETH)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={addNewItem}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <ActionButton icon={<Download />}>Download Report</ActionButton>
        <ActionButton icon={<Upload />}>Upload Data</ActionButton>
      </div>
    </div>
  );
};

const SummaryBox = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="text-blue-500">{icon}</div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
};

const ActionButton = ({ icon, children }) => {
  return (
    <button className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
      {icon}
      <span className="ml-2">{children}</span>
    </button>
  );
};

export default Dashboard;