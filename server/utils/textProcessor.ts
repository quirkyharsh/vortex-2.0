/**
 * Text processing utilities for content analysis
 */

const ENGLISH_STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 
  'with', 'by', 'this', 'that', 'is', 'are', 'was', 'were', 'be', 'been', 
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 
  'should', 'it', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 
  'who', 'how', 'why', 'can', 'may', 'might', 'must', 'shall', 'from', 'up', 
  'out', 'down', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
]);

/**
 * Clean and tokenize text for analysis
 */
export function preprocessText(text: string): string[] {
  const tokens = text.toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0);
  
  return tokens.filter(token => 
    !ENGLISH_STOPWORDS.has(token) && 
    token.length > 2 && 
    /^[a-zA-Z\u0900-\u097F]+$/.test(token)
  );
}

/**
 * Calculate term frequency for a document
 */
export function calculateTermFrequency(tokens: string[]): Map<string, number> {
  const termFreq = new Map<string, number>();
  tokens.forEach(token => {
    termFreq.set(token, (termFreq.get(token) || 0) + 1);
  });
  return termFreq;
}

/**
 * Build vocabulary from multiple documents
 */
export function buildVocabulary(documents: string[][]): string[] {
  const allTerms = new Set<string>();
  documents.forEach(doc => {
    doc.forEach(term => allTerms.add(term));
  });
  return Array.from(allTerms).sort();
}