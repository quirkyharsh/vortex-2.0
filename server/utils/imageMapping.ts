// Category-based image mapping for news articles
// Each category has multiple relevant images that can be randomly selected

interface CategoryImages {
  [key: string]: string[];
}

const categoryImages: CategoryImages = {
  general: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400", // News stand
    "https://images.unsplash.com/photo-1586880244386-8b3e34d8b844?w=400", // People reading
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400", // Community
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400", // Discussion
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", // Yoga/lifestyle
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400", // Solar panels
  ],
  
  politics: [
    "https://images.unsplash.com/photo-1586880244386-8b3e34d8b844?w=400", // Parliament/Government
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400", // Voting
    "https://images.unsplash.com/photo-1569504275102-9ba3e7e4e3d5?w=400", // Capitol building
    "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400", // Political rally
    "https://images.unsplash.com/photo-1495650962430-d3d9c7e2f453?w=400", // Government building
  ],
  
  technology: [
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400", // AI/Technology
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400", // AI/Robotics
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400", // Satellites/Space tech
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400", // Computers
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400", // Transportation tech
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400", // Data/Tech
  ],
  
  health: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400", // Healthcare
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400", // Medical equipment
    "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400", // Hospital
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400", // Telemedicine
    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400", // Medical research
    "https://images.unsplash.com/photo-1559757175-0eb30cd8ebb6?w=400", // Healthcare tech
  ],
  
  finance: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400", // Stock market
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400", // Banking
    "https://images.unsplash.com/photo-1569025690938-a000c1d17d98?w=400", // Finance charts
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400", // Money/economy
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400", // Business growth
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400", // Financial analytics
  ],
  
  sports: [
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", // Cricket
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", // Women's cricket
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400", // Stadium
    "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=400", // Sports team
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400", // Sports action
    "https://images.unsplash.com/photo-1593766827228-8737b4534aa5?w=400", // Trophy/victory
  ]
};

/**
 * Get a random image URL for a specific news category
 * @param category - The news category (general, politics, technology, health, finance, sports)
 * @returns A random image URL appropriate for the category
 */
export function getCategoryImage(category: string): string {
  const normalizedCategory = category.toLowerCase();
  const images = categoryImages[normalizedCategory];
  
  if (!images || images.length === 0) {
    // Fallback to general category if category not found
    const generalImages = categoryImages.general;
    return generalImages[Math.floor(Math.random() * generalImages.length)];
  }
  
  // Return a random image from the category
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Get an image URL that matches article content or falls back to category image
 * @param category - The news category
 * @param title - Article title for content-based matching
 * @param content - Article content for content-based matching
 * @returns An appropriate image URL
 */
export function getArticleImage(category: string, title: string, content?: string): string {
  const normalizedCategory = category.toLowerCase();
  
  // Content-based image selection for specific keywords
  const contentText = `${title} ${content || ''}`.toLowerCase();
  
  // Special keyword matching for more specific images
  if (contentText.includes('space') || contentText.includes('isro') || contentText.includes('satellite')) {
    return "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400";
  }
  
  if (contentText.includes('ai') || contentText.includes('artificial intelligence')) {
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400";
  }
  
  if (contentText.includes('cricket') && contentText.includes('women')) {
    return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400";
  }
  
  if (contentText.includes('yoga') || contentText.includes('योग')) {
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
  }
  
  if (contentText.includes('solar') || contentText.includes('सौर')) {
    return "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400";
  }
  
  if (contentText.includes('train') || contentText.includes('railway') || contentText.includes('रेलवे')) {
    return "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400";
  }
  
  if (contentText.includes('telemedicine') || contentText.includes('digital health')) {
    return "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400";
  }
  
  if (contentText.includes('parliament') || contentText.includes('supreme court')) {
    return "https://images.unsplash.com/photo-1586880244386-8b3e34d8b844?w=400";
  }
  
  // Fall back to category-based selection
  return getCategoryImage(normalizedCategory);
}

export default {
  getCategoryImage,
  getArticleImage
};