import { useState } from 'react';
import { useBlockchain } from '@/contexts/blockchain-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  ShieldCheck, 
  Wallet, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';

interface AddSourceForm {
  domain: string;
  name: string;
  trustScore: number;
  category: string;
}

export default function BlockchainPage() {
  const {
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
  } = useBlockchain();

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<AddSourceForm>({
    domain: '',
    name: '',
    trustScore: 85,
    category: 'newspaper'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleAddSource = async () => {
    if (!addForm.domain || !addForm.name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addVerifiedSource(addForm.domain, addForm.name, addForm.trustScore, addForm.category);
      
      toast({
        title: "Source Added",
        description: `${addForm.name} has been added to verified sources.`,
      });
      
      setShowAddForm(false);
      setAddForm({ domain: '', name: '', trustScore: 85, category: 'newspaper' });
    } catch (error) {
      toast({
        title: "Failed to Add Source",
        description: error instanceof Error ? error.message : "Failed to add verified source",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSource = async (domain: string) => {
    try {
      await removeVerifiedSource(domain);
      toast({
        title: "Source Removed",
        description: `${domain} has been removed from verified sources.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Remove Source",
        description: error instanceof Error ? error.message : "Failed to remove verified source",
        variant: "destructive",
      });
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'newspaper': return '📰';
      case 'broadcast': return '📺';
      case 'digital': return '💻';
      case 'agency': return '🏢';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Blockchain Verified Sources
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage verified news sources on Polygon Mumbai Testnet using smart contracts
          </p>
        </div>

        {/* Wallet Connection Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isWalletConnected ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Connect your wallet to manage verified sources on the blockchain
                  </p>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You need MetaMask or another Web3 wallet to interact with the blockchain
                    </AlertDescription>
                  </Alert>
                </div>
                <Button onClick={handleConnectWallet} className="ml-4">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">Wallet Connected</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Account:</strong>
                    <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                      {currentAccount}
                    </p>
                  </div>
                  {networkInfo && (
                    <div>
                      <strong>Network:</strong>
                      <p className="mt-1">{networkInfo.networkName}</p>
                      <p className="text-xs text-gray-500">Chain ID: {networkInfo.chainId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Information */}
        {contractInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Smart Contract Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Total Verified Sources:</strong>
                  <p className="text-2xl font-bold text-blue-600">{contractInfo.totalSources}</p>
                </div>
                <div>
                  <strong>Contract Owner:</strong>
                  <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                    {contractInfo.owner}
                  </p>
                </div>
                <div>
                  <strong>Deployed:</strong>
                  <p>{new Date(contractInfo.deployedAt * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Add New Source */}
        {isWalletConnected && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Verified Source
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? 'Cancel' : 'Add Source'}
                </Button>
              </CardTitle>
            </CardHeader>
            
            {showAddForm && (
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="domain">Domain *</Label>
                      <Input
                        id="domain"
                        placeholder="example.com"
                        value={addForm.domain}
                        onChange={(e) => setAddForm(prev => ({ ...prev, domain: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Source Name *</Label>
                      <Input
                        id="name"
                        placeholder="Example News"
                        value={addForm.name}
                        onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trustScore">Trust Score (1-100)</Label>
                      <Input
                        id="trustScore"
                        type="number"
                        min="1"
                        max="100"
                        value={addForm.trustScore}
                        onChange={(e) => setAddForm(prev => ({ ...prev, trustScore: parseInt(e.target.value) || 85 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={addForm.category}
                        onValueChange={(value) => setAddForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newspaper">📰 Newspaper</SelectItem>
                          <SelectItem value="broadcast">📺 Broadcast</SelectItem>
                          <SelectItem value="digital">💻 Digital</SelectItem>
                          <SelectItem value="agency">🏢 News Agency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAddSource} 
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding to Blockchain...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Verified Source
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Verified Sources List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Verified Sources ({verifiedSources.length})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>
              News sources verified on the Polygon Mumbai blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading verified sources...
              </div>
            ) : verifiedSources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No verified sources found</p>
                <p className="text-sm">Add some sources to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifiedSources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {getCategoryIcon(source.category)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {source.name}
                        </h3>
                        <p className="text-sm text-gray-500">{source.domain}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={getTrustScoreColor(source.trustScore)}
                          >
                            Trust Score: {source.trustScore}/100
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {source.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://${source.domain}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      
                      {isWalletConnected && currentAccount === contractInfo?.owner && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveSource(source.domain)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}