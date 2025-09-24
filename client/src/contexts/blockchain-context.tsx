import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { blockchainService, SourceData } from '@/services/blockchainService';

interface BlockchainContextType {
  isWalletConnected: boolean;
  currentAccount: string | null;
  networkInfo: { chainId: string; networkName: string; } | null;
  verifiedSources: SourceData[];
  contractInfo: { owner: string; totalSources: number; deployedAt: number; } | null;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  refreshData: () => Promise<void>;
  addVerifiedSource: (domain: string, name: string, trustScore: number, category: string) => Promise<boolean>;
  removeVerifiedSource: (domain: string) => Promise<boolean>;
  updateTrustScore: (domain: string, newTrustScore: number) => Promise<boolean>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}

interface BlockchainProviderProps {
  children: ReactNode;
}

export function BlockchainProvider({ children }: BlockchainProviderProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{ chainId: string; networkName: string; } | null>(null);
  const [verifiedSources, setVerifiedSources] = useState<SourceData[]>([]);
  const [contractInfo, setContractInfo] = useState<{ owner: string; totalSources: number; deployedAt: number; } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize blockchain data on component mount
  useEffect(() => {
    initializeBlockchain();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const initializeBlockchain = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check wallet connection
      const connected = await blockchainService.isWalletConnected();
      setIsWalletConnected(connected);

      if (connected) {
        const account = await blockchainService.getCurrentAccount();
        setCurrentAccount(account);
      }

      // Get network info
      const network = await blockchainService.getNetworkInfo();
      setNetworkInfo(network);

      // Load verified sources and contract info
      await loadBlockchainData();
    } catch (err) {
      console.error('Error initializing blockchain:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize blockchain');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlockchainData = async () => {
    try {
      // Load verified sources
      const sources = await blockchainService.getAllVerifiedSources();
      setVerifiedSources(sources);

      // Load contract info
      const info = await blockchainService.getContractInfo();
      setContractInfo(info);
    } catch (err) {
      console.error('Error loading blockchain data:', err);
      // Don't set error here as this might be expected if contract is not deployed
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsWalletConnected(false);
      setCurrentAccount(null);
    } else {
      setIsWalletConnected(true);
      setCurrentAccount(accounts[0]);
    }
  };

  const handleChainChanged = async (chainId: string) => {
    // Reload the page to reset the dapp state
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      setError(null);
      const accounts = await blockchainService.connectWallet();
      
      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setCurrentAccount(accounts[0]);
        
        // Refresh network info and data
        const network = await blockchainService.getNetworkInfo();
        setNetworkInfo(network);
        
        await loadBlockchainData();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refreshData = async () => {
    await loadBlockchainData();
  };

  const addVerifiedSource = async (
    domain: string,
    name: string,
    trustScore: number,
    category: string
  ): Promise<boolean> => {
    try {
      const success = await blockchainService.addVerifiedSource(domain, name, trustScore, category);
      if (success) {
        await loadBlockchainData(); // Refresh data
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add verified source';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeVerifiedSource = async (domain: string): Promise<boolean> => {
    try {
      const success = await blockchainService.removeVerifiedSource(domain);
      if (success) {
        await loadBlockchainData(); // Refresh data
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove verified source';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTrustScore = async (domain: string, newTrustScore: number): Promise<boolean> => {
    try {
      const success = await blockchainService.updateTrustScore(domain, newTrustScore);
      if (success) {
        await loadBlockchainData(); // Refresh data
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update trust score';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value: BlockchainContextType = {
    isWalletConnected,
    currentAccount,
    networkInfo,
    verifiedSources,
    contractInfo,
    isLoading,
    error,
    connectWallet,
    refreshData,
    addVerifiedSource,
    removeVerifiedSource,
    updateTrustScore,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}