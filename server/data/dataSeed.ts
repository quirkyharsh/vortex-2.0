import { storage } from '../storage';
import { seedArticles } from './seedData';

export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Initializing database with seed data...');
    
    // Check if articles already exist
    const existingArticles = await storage.getArticles({ language: 'en' }, 10, 0);
    
    if (existingArticles.length > 0) {
      console.log(`Database already contains ${existingArticles.length} articles, skipping seed`);
      return;
    }
    
    // Insert seed articles
    for (const article of seedArticles) {
      await storage.createArticle(article);
    }
    
    console.log(`Successfully seeded database with ${seedArticles.length} articles`);
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}