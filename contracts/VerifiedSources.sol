// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VerifiedSources
 * @dev Smart contract to manage verified news source domains on Polygon Mumbai Testnet
 * @author Varta.AI Team
 */
contract VerifiedSources {
    address public owner;
    uint256 public totalVerifiedSources;
    
    struct SourceInfo {
        string domain;
        string name;
        uint256 verifiedAt;
        bool isActive;
        uint256 trustScore; // Scale of 1-100
        string category; // "newspaper", "broadcast", "digital", "agency"
    }
    
    // Mapping from domain hash to source info
    mapping(bytes32 => SourceInfo) public verifiedSources;
    
    // Array to store all verified domain hashes for enumeration
    bytes32[] public verifiedDomains;
    
    // Events
    event SourceVerified(
        bytes32 indexed domainHash,
        string domain,
        string name,
        uint256 trustScore,
        string category
    );
    
    event SourceRemoved(bytes32 indexed domainHash, string domain);
    event SourceUpdated(bytes32 indexed domainHash, string domain, uint256 newTrustScore);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier validDomain(string memory _domain) {
        require(bytes(_domain).length > 0, "Domain cannot be empty");
        require(bytes(_domain).length <= 100, "Domain too long");
        _;
    }
    
    modifier validTrustScore(uint256 _trustScore) {
        require(_trustScore >= 1 && _trustScore <= 100, "Trust score must be between 1-100");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        totalVerifiedSources = 0;
        
        // Initialize with some trusted news sources
        _addInitialSources();
    }
    
    /**
     * @dev Add a new verified source
     */
    function addVerifiedSource(
        string memory _domain,
        string memory _name,
        uint256 _trustScore,
        string memory _category
    ) 
        external 
        onlyOwner 
        validDomain(_domain) 
        validTrustScore(_trustScore) 
    {
        bytes32 domainHash = keccak256(abi.encodePacked(_domain));
        
        require(!verifiedSources[domainHash].isActive, "Source already verified");
        
        verifiedSources[domainHash] = SourceInfo({
            domain: _domain,
            name: _name,
            verifiedAt: block.timestamp,
            isActive: true,
            trustScore: _trustScore,
            category: _category
        });
        
        verifiedDomains.push(domainHash);
        totalVerifiedSources++;
        
        emit SourceVerified(domainHash, _domain, _name, _trustScore, _category);
    }
    
    /**
     * @dev Remove a verified source
     */
    function removeVerifiedSource(string memory _domain) 
        external 
        onlyOwner 
        validDomain(_domain) 
    {
        bytes32 domainHash = keccak256(abi.encodePacked(_domain));
        require(verifiedSources[domainHash].isActive, "Source not found or already inactive");
        
        verifiedSources[domainHash].isActive = false;
        totalVerifiedSources--;
        
        emit SourceRemoved(domainHash, _domain);
    }
    
    /**
     * @dev Update trust score of a verified source
     */
    function updateTrustScore(string memory _domain, uint256 _newTrustScore) 
        external 
        onlyOwner 
        validDomain(_domain) 
        validTrustScore(_newTrustScore) 
    {
        bytes32 domainHash = keccak256(abi.encodePacked(_domain));
        require(verifiedSources[domainHash].isActive, "Source not found");
        
        verifiedSources[domainHash].trustScore = _newTrustScore;
        
        emit SourceUpdated(domainHash, _domain, _newTrustScore);
    }
    
    /**
     * @dev Check if a domain is verified
     */
    function isSourceVerified(string memory _domain) 
        external 
        view 
        returns (bool verified, uint256 trustScore, string memory name, string memory category) 
    {
        bytes32 domainHash = keccak256(abi.encodePacked(_domain));
        SourceInfo memory source = verifiedSources[domainHash];
        
        return (
            source.isActive,
            source.trustScore,
            source.name,
            source.category
        );
    }
    
    /**
     * @dev Get all verified sources (for frontend display)
     */
    function getAllVerifiedSources() 
        external 
        view 
        returns (
            string[] memory domains,
            string[] memory names,
            uint256[] memory trustScores,
            string[] memory categories
        ) 
    {
        uint256 activeCount = 0;
        
        // First pass: count active sources
        for (uint256 i = 0; i < verifiedDomains.length; i++) {
            if (verifiedSources[verifiedDomains[i]].isActive) {
                activeCount++;
            }
        }
        
        // Initialize arrays
        domains = new string[](activeCount);
        names = new string[](activeCount);
        trustScores = new uint256[](activeCount);
        categories = new string[](activeCount);
        
        // Second pass: populate arrays
        uint256 index = 0;
        for (uint256 i = 0; i < verifiedDomains.length; i++) {
            SourceInfo memory source = verifiedSources[verifiedDomains[i]];
            if (source.isActive) {
                domains[index] = source.domain;
                names[index] = source.name;
                trustScores[index] = source.trustScore;
                categories[index] = source.category;
                index++;
            }
        }
    }
    
    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
    
    /**
     * @dev Initialize contract with trusted news sources
     */
    function _addInitialSources() private {
        // Major international news sources
        _addSource("reuters.com", "Reuters", 95, "agency");
        _addSource("apnews.com", "Associated Press", 95, "agency");
        _addSource("bbc.com", "BBC News", 90, "broadcast");
        _addSource("cnn.com", "CNN", 85, "broadcast");
        _addSource("nytimes.com", "The New York Times", 90, "newspaper");
        _addSource("washingtonpost.com", "The Washington Post", 90, "newspaper");
        _addSource("theguardian.com", "The Guardian", 88, "newspaper");
        _addSource("wsj.com", "The Wall Street Journal", 92, "newspaper");
        
        // Indian news sources
        _addSource("thehindu.com", "The Hindu", 88, "newspaper");
        _addSource("indianexpress.com", "The Indian Express", 85, "newspaper");
        _addSource("timesofindia.com", "Times of India", 80, "newspaper");
        _addSource("ndtv.com", "NDTV", 82, "broadcast");
        _addSource("hindustantimes.com", "Hindustan Times", 83, "newspaper");
        _addSource("scroll.in", "Scroll.in", 85, "digital");
        _addSource("thewire.in", "The Wire", 80, "digital");
        
        // Tech and business sources
        _addSource("techcrunch.com", "TechCrunch", 85, "digital");
        _addSource("bloomberg.com", "Bloomberg", 92, "agency");
        _addSource("forbes.com", "Forbes", 85, "newspaper");
        _addSource("economictimes.com", "Economic Times", 82, "newspaper");
    }
    
    /**
     * @dev Internal function to add sources during initialization
     */
    function _addSource(
        string memory _domain,
        string memory _name,
        uint256 _trustScore,
        string memory _category
    ) private {
        bytes32 domainHash = keccak256(abi.encodePacked(_domain));
        
        verifiedSources[domainHash] = SourceInfo({
            domain: _domain,
            name: _name,
            verifiedAt: block.timestamp,
            isActive: true,
            trustScore: _trustScore,
            category: _category
        });
        
        verifiedDomains.push(domainHash);
        totalVerifiedSources++;
    }
    
    /**
     * @dev Get contract info
     */
    function getContractInfo() 
        external 
        view 
        returns (
            address contractOwner,
            uint256 totalSources,
            uint256 deployedAt
        ) 
    {
        return (owner, totalVerifiedSources, block.timestamp);
    }
}