import { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldX, Info } from 'lucide-react';
import { blockchainService, VerifiedSourceInfo } from '@/services/blockchainService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface VerificationBadgeProps {
  sourceUrl: string;
  className?: string;
}

export function VerificationBadge({ sourceUrl, className = "" }: VerificationBadgeProps) {
  const [verificationInfo, setVerificationInfo] = useState<VerifiedSourceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      if (!sourceUrl) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const info = await blockchainService.isSourceVerified(sourceUrl);
        setVerificationInfo(info);
      } catch (err) {
        console.error('Error checking verification:', err);
        setError('Failed to check verification');
        setVerificationInfo({ verified: false, trustScore: 0, name: '', category: '' });
      } finally {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [sourceUrl]);

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <Shield className="w-4 h-4 text-gray-400 animate-pulse" />
        <span className="text-xs text-gray-500">Checking...</span>
      </div>
    );
  }

  if (error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center gap-1 ${className}`}>
              <ShieldX className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-600">Error</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Unable to verify source: {error}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!verificationInfo?.verified) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center gap-1 ${className}`}>
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Unverified</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Source not verified on blockchain</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 90) return "Highly Trusted";
    if (score >= 80) return "Trusted";
    if (score >= 70) return "Moderately Trusted";
    return "Low Trust";
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-2 ${className}`}>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Verified</span>
            </div>
            
            <Badge 
              variant="outline" 
              className={`text-xs px-2 py-0.5 ${getTrustScoreColor(verificationInfo.trustScore)}`}
            >
              {verificationInfo.trustScore}/100
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-700">Blockchain Verified Source</span>
            </div>
            
            {verificationInfo.name && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Source:</span>
                <span className="text-sm">{verificationInfo.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Trust Score:</span>
              <span className="text-sm font-bold">{verificationInfo.trustScore}/100</span>
              <span className="text-xs text-gray-600">({getTrustScoreLabel(verificationInfo.trustScore)})</span>
            </div>
            
            {verificationInfo.category && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Category:</span>
                <span className="text-sm capitalize flex items-center gap-1">
                  {getCategoryIcon(verificationInfo.category)}
                  {verificationInfo.category}
                </span>
              </div>
            )}
            
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Info className="w-3 h-3" />
                <span>Verified on Polygon Mumbai Testnet</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}