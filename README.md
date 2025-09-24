# Varta.AI - Multilingual News Aggregator

## Overview
A MERN-based multilingual news aggregator with AI-powered bias detection and translation capabilities. The application features a modern authentication system and provides real-time news articles with sentiment analysis, political bias detection, and multi-language translation features.

## Recent Changes

### January 28, 2025 - Blockchain Verified Sources Implementation
✓ Integrated Polygon Mumbai Testnet for blockchain-verified news sources
✓ Created VerifiedSources smart contract with trust scoring system (1-100)
✓ Added blockchain service with Web3.js and ethers.js integration
✓ Implemented verification badges on news article cards
✓ Built comprehensive blockchain management page (/blockchain route)
✓ Added MetaMask wallet connection and network switching
✓ Created verification badge component with trust score display
✓ Integrated blockchain provider in app context for state management
✓ Added "Verified Sources" navigation to hamburger menu
✓ Designed smart contract with gas-optimized operations

### January 28, 2025 - Complete Rebrand to Varta.AI
✓ Replaced all instances of "NewsLens" with "Varta.AI" throughout the entire project
✓ Updated authentication localStorage keys from 'newsLens_user' to 'vartaAI_user'  
✓ Updated logo abbreviation from "NL" to "V.AI" in login and signup pages
✓ Added comprehensive HTML meta tags and title with Varta.AI branding
✓ Updated OpenRouter AI system prompt to identify as Varta.AI
✓ Updated all UI headers, welcome messages, and branding elements
✓ Maintained "Analyze. Summarize. Detect Bias." tagline throughout rebrand

## Recent Changes
- **January 25, 2025**: Implemented next-generation authentication system with futuristic design
  - Removed entry screen - application opens directly to login page (/login route)
  - Completely redesigned login and signup screens with dark theme and glassmorphism effects
  - Added animated background elements with floating orbs and pulsing gradients
  - Implemented backdrop blur effects, translucent forms, and purple/blue gradient color scheme
  - Enhanced typography with gradient text effects and uppercase labels with letter spacing
  - Added hover animations, transform effects, and smooth transitions throughout
  - Created custom fade-in animations and interactive button states with loading spinners
  - Updated form fields with larger sizes, rounded corners, and focus state transitions
  - Added user authentication with backend API endpoints and secure session management
  - Built responsive design optimized for modern devices and browsers

- **January 25, 2025**: Enhanced platform with blogs section and article copy functionality
  - Created comprehensive "Blogs & Insights" section (/blogs route) with clean blue/white design
  - Added blog listing page with search, category filtering, and trending sidebar
  - Implemented individual blog post pages with full content display
  - Added copy functionality to news articles - copies entire article with metadata
  - Enhanced hamburger menu with advanced chat and community features
  - Integrated full-featured AI chatbot for news analysis (/chat route)
  - Added community discussion forum with realistic discussions (/community route)
  - Improved responsive design across all sections

- **January 23, 2025**: Implemented comprehensive multilingual UI support
  - Extended language support to 7 languages: English, Hindi, Marathi, Tamil, Kannada, Telugu, Malayalam
  - Added complete translations for all UI elements in all supported languages
  - Created language context provider with localStorage persistence
  - Implemented UI language switcher in header with native script display
  - Removed previous article language filtering to separate UI language from content language
  - Updated theme system with light, dark, and creative modes
  - Enhanced all components with theme-aware styling and smooth animations

## Project Architecture
### Frontend (React + TypeScript)
- **Theme System**: Context-based theme management with light, dark, and creative modes
- **UI Components**: Enhanced shadcn/ui components with theme integration
- **Animations**: Custom CSS animations with fade-in, hover-lift, and floating effects
- **Styling**: Tailwind CSS with custom utility classes and glass morphism effects

### Backend (Express + TypeScript)
- REST API for news aggregation and processing
- AI-powered services for bias detection and article generation
- Multi-language support with translation capabilities

### Database
- Sample news data with bias analysis and sentiment detection
- Article metadata including political bias, emotional tone, and categories

## Key Features
1. **Blockchain Verification**: Smart contract-based news source verification on Polygon Mumbai
2. **Trust Scoring**: Dynamic trust scores (1-100) for verified sources with visual badges
3. **Web3 Integration**: MetaMask wallet connection and blockchain state management
4. **Multi-theme Support**: Light, dark, and creative visual modes
5. **Advanced Animations**: Smooth transitions and interactive elements
6. **News Filtering**: Category, bias type, and sentiment filtering
7. **Real-time Updates**: Live news feed with refresh capabilities
8. **Translation Support**: Multi-language article translation
9. **AI-Powered Chatbot**: Comprehensive news analysis and bias detection
10. **Community Forum**: Real-time chat-style discussions for news topics
11. **Responsive Design**: Mobile-first responsive layout with hamburger navigation

## User Preferences
- Prefers enhanced UI/UX with modern design patterns
- Values smooth animations and interactive feedback
- Appreciates creative and visually appealing interfaces
- Wants seamless theme switching capabilities

## Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **UI Library**: shadcn/ui with Radix UI primitives
- **State Management**: TanStack Query for server state
- **Styling**: CSS custom properties with theme variables

## Current Status
The application is fully functional with enhanced theming system. All core features work with sample data, though external API integrations require proper API keys for full functionality.