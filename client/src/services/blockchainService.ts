import { ethers } from 'ethers';
import Web3 from 'web3';

// Contract ABI for VerifiedSources
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "domainHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "domain",
        "type": "string"
      }
    ],
    "name": "SourceRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "domainHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "domain",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newTrustScore",
        "type": "uint256"
      }
    ],
    "name": "SourceUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "domainHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "domain",
        "type": "string"
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
        "name": "trustScore",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "category",
        "type": "string"
      }
    ],
    "name": "SourceVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_domain",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_trustScore",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_category",
        "type": "string"
      }
    ],
    "name": "addVerifiedSource",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllVerifiedSources",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "domains",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "names",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "trustScores",
        "type": "uint256[]"
      },
      {
        "internalType": "string[]",
        "name": "categories",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "contractOwner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "totalSources",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deployedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_domain",
        "type": "string"
      }
    ],
    "name": "isSourceVerified",
    "outputs": [
      {
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "trustScore",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_domain",
        "type": "string"
      }
    ],
    "name": "removeVerifiedSource",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalVerifiedSources",
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
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_domain",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_newTrustScore",
        "type": "uint256"
      }
    ],
    "name": "updateTrustScore",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "name": "verifiedDomains",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "verifiedSources",
    "outputs": [
      {
        "internalType": "string",
        "name": "domain",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "verifiedAt",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "trustScore",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Polygon Mumbai Testnet configuration
const POLYGON_MUMBAI_CONFIG = {
  chainId: '0x13881', // 80001 in hex
  chainName: 'Polygon Mumbai Testnet',
  rpcUrls: ['https://rpc-mumbai.maticvigil.com/', 'https://polygon-mumbai.g.alchemy.com/v2/demo'],
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
};

// Contract address (will be updated after deployment)
const CONTRACT_ADDRESS = import.meta.env.VITE_VERIFIED_SOURCES_CONTRACT_ADDRESS || '';

export interface VerifiedSourceInfo {
  verified: boolean;
  trustScore: number;
  name: string;
  category: string;
}

export interface SourceData {
  domain: string;
  name: string;
  trustScore: number;
  category: string;
}

class BlockchainService {
  private web3: Web3 | null = null;
  private ethersProvider: ethers.BrowserProvider | null = null;
  private contract: any = null;
  private isInitialized = false;

  constructor() {
    this.initializeConnection();
  }

  /**
   * Initialize blockchain connection
   */
  private async initializeConnection() {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Initialize with ethers for better TypeScript support
        this.ethersProvider = new ethers.BrowserProvider(window.ethereum);
        
        // Also initialize Web3 as fallback
        this.web3 = new Web3(window.ethereum);
        
        // Switch to Polygon Mumbai if not already connected
        await this.switchToPolygonMumbai();
        
        // Initialize contract
        if (CONTRACT_ADDRESS) {
          this.contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            this.ethersProvider
          );
        }
        
        this.isInitialized = true;
      } else {
        console.warn('MetaMask not detected. Please install MetaMask to use blockchain verification features.');
      }
    } catch (error) {
      console.error('Error initializing blockchain connection:', error);
    }
  }

  /**
   * Switch to Polygon Mumbai Testnet
   */
  private async switchToPolygonMumbai() {
    if (!window.ethereum) return;

    try {
      // Try to switch to Polygon Mumbai
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_MUMBAI_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // If the chain is not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_MUMBAI_CONFIG],
          });
        } catch (addError) {
          console.error('Failed to add Polygon Mumbai network:', addError);
          throw addError;
        }
      } else {
        console.error('Failed to switch to Polygon Mumbai network:', switchError);
        throw switchError;
      }
    }
  }

  /**
   * Connect wallet
   */
  async connectWallet(): Promise<string[]> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Switch to Polygon Mumbai
      await this.switchToPolygonMumbai();

      // Re-initialize connection after wallet connection
      await this.initializeConnection();

      return accounts;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  /**
   * Check if a news source domain is verified on the blockchain
   */
  async isSourceVerified(sourceUrl: string): Promise<VerifiedSourceInfo> {
    if (!this.isInitialized || !this.contract) {
      // Return default values if blockchain is not initialized
      return {
        verified: false,
        trustScore: 0,
        name: '',
        category: ''
      };
    }

    try {
      // Extract domain from URL
      const domain = this.extractDomain(sourceUrl);
      
      // Call smart contract
      const result = await this.contract.isSourceVerified(domain);
      
      return {
        verified: result[0],
        trustScore: Number(result[1]),
        name: result[2],
        category: result[3]
      };
    } catch (error) {
      console.error('Error checking source verification:', error);
      return {
        verified: false,
        trustScore: 0,
        name: '',
        category: ''
      };
    }
  }

  /**
   * Get all verified sources from blockchain
   */
  async getAllVerifiedSources(): Promise<SourceData[]> {
    if (!this.isInitialized || !this.contract) {
      return [];
    }

    try {
      const result = await this.contract.getAllVerifiedSources();
      const [domains, names, trustScores, categories] = result;

      return domains.map((domain: string, index: number) => ({
        domain,
        name: names[index],
        trustScore: Number(trustScores[index]),
        category: categories[index]
      }));
    } catch (error) {
      console.error('Error fetching verified sources:', error);
      return [];
    }
  }

  /**
   * Get contract information
   */
  async getContractInfo(): Promise<{
    owner: string;
    totalSources: number;
    deployedAt: number;
  } | null> {
    if (!this.isInitialized || !this.contract) {
      return null;
    }

    try {
      const result = await this.contract.getContractInfo();
      
      return {
        owner: result[0],
        totalSources: Number(result[1]),
        deployedAt: Number(result[2])
      };
    } catch (error) {
      console.error('Error fetching contract info:', error);
      return null;
    }
  }

  /**
   * Add a new verified source (owner only)
   */
  async addVerifiedSource(
    domain: string,
    name: string,
    trustScore: number,
    category: string
  ): Promise<boolean> {
    if (!this.isInitialized || !this.ethersProvider || !this.contract) {
      throw new Error('Blockchain not initialized');
    }

    try {
      const signer = await this.ethersProvider.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      
      const tx = await contractWithSigner.addVerifiedSource(
        domain,
        name,
        trustScore,
        category
      );
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error adding verified source:', error);
      throw error;
    }
  }

  /**
   * Remove a verified source (owner only)
   */
  async removeVerifiedSource(domain: string): Promise<boolean> {
    if (!this.isInitialized || !this.ethersProvider || !this.contract) {
      throw new Error('Blockchain not initialized');
    }

    try {
      const signer = await this.ethersProvider.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      
      const tx = await contractWithSigner.removeVerifiedSource(domain);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error removing verified source:', error);
      throw error;
    }
  }

  /**
   * Update trust score of a verified source (owner only)
   */
  async updateTrustScore(domain: string, newTrustScore: number): Promise<boolean> {
    if (!this.isInitialized || !this.ethersProvider || !this.contract) {
      throw new Error('Blockchain not initialized');
    }

    try {
      const signer = await this.ethersProvider.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      
      const tx = await contractWithSigner.updateTrustScore(domain, newTrustScore);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error updating trust score:', error);
      throw error;
    }
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      // Handle URLs without protocol
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      const domain = new URL(url).hostname;
      
      // Remove 'www.' prefix if present
      return domain.startsWith('www.') ? domain.substring(4) : domain;
    } catch (error) {
      // If URL parsing fails, return the input string (might be a domain already)
      return url.replace(/^www\./, '');
    }
  }

  /**
   * Check if wallet is connected
   */
  async isWalletConnected(): Promise<boolean> {
    if (!window.ethereum) return false;

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      return accounts.length > 0;
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  }

  /**
   * Get current account
   */
  async getCurrentAccount(): Promise<string | null> {
    if (!window.ethereum) return null;

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      return accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      console.error('Error getting current account:', error);
      return null;
    }
  }

  /**
   * Get network info
   */
  async getNetworkInfo(): Promise<{
    chainId: string;
    networkName: string;
  } | null> {
    if (!window.ethereum) return null;

    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      let networkName = 'Unknown Network';
      if (chainId === POLYGON_MUMBAI_CONFIG.chainId) {
        networkName = 'Polygon Mumbai Testnet';
      }

      return { chainId, networkName };
    } catch (error) {
      console.error('Error getting network info:', error);
      return null;
    }
  }
}

// Global instance
export const blockchainService = new BlockchainService();

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}