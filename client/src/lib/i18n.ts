// Internationalization utilities
export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'kn' | 'te' | 'ml';

export interface Translations {
  // Header
  appTitle: string;
  appSubtitle: string;
  searchPlaceholder: string;
  
  // Navigation & Buttons
  settings: string;
  refresh: string;
  translate: string;
  close: string;
  loading: string;
  
  // Stats Bar
  totalArticles: string;
  todayArticles: string;
  translatedArticles: string;
  sortBy: string;
  latest: string;
  oldest: string;
  mostTranslated: string;
  
  // Filters
  filters: string;
  categories: string;
  biasTypes: string;
  sentiments: string;
  timeRange: string;
  clearFilters: string;
  
  // Categories
  politics: string;
  technology: string;
  sports: string;
  business: string;
  entertainment: string;
  health: string;
  science: string;
  education: string;
  
  // Bias Types
  left: string;
  right: string;
  center: string;
  neutral: string;
  
  // Sentiments
  positive: string;
  negative: string;
  
  // Time Ranges
  today: string;
  thisWeek: string;
  thisMonth: string;
  
  // Article Card
  readMore: string;
  biasScore: string;
  sentiment: string;
  
  // Translation Modal
  translationFor: string;
  originalLanguage: string;
  targetLanguage: string;
  translating: string;
  translationError: string;
  
  // Bulk Translation
  translateAll: string;
  translateAllArticles: string;
  bulkTranslating: string;
  bulkTranslationComplete: string;
  bulkTranslationError: string;
  
  // Error Messages
  errorLoadingArticles: string;
  noArticlesFound: string;
  
  // General
  of: string;
  articles: string;
}

const translations: Record<SupportedLanguage, Translations> = {
  en: {
    // Header
    appTitle: "Varta.AI",
    appSubtitle: "Multilingual Bias Detection",
    searchPlaceholder: "Search news articles...",
    
    // Navigation & Buttons
    settings: "Settings",
    refresh: "Refresh",
    translate: "Translate",
    close: "Close",
    loading: "Loading...",
    
    // Stats Bar
    totalArticles: "Total Articles",
    todayArticles: "Today's Articles",
    translatedArticles: "Translated Articles",
    sortBy: "Sort by",
    latest: "Latest",
    oldest: "Oldest",
    mostTranslated: "Most Translated",
    
    // Filters
    filters: "Filters",
    categories: "Categories",
    biasTypes: "Bias Types",
    sentiments: "Sentiments",
    timeRange: "Time Range",
    clearFilters: "Clear Filters",
    
    // Categories
    politics: "Politics",
    technology: "Technology",
    sports: "Sports",
    business: "Business",
    entertainment: "Entertainment",
    health: "Health",
    science: "Science",
    education: "Education",
    
    // Bias Types
    left: "Left",
    right: "Right",
    center: "Center",
    neutral: "Neutral",
    
    // Sentiments
    positive: "Positive",
    negative: "Negative",
    
    // Time Ranges
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    
    // Article Card
    readMore: "Read More",
    biasScore: "Bias Score",
    sentiment: "Sentiment",
    
    // Translation Modal
    translationFor: "Translation for",
    originalLanguage: "Original Language",
    targetLanguage: "Target Language",
    translating: "Translating...",
    translationError: "Translation Error",
    
    // Error Messages
    errorLoadingArticles: "Error loading articles",
    noArticlesFound: "No articles found",
    
    // Bulk Translation
    translateAll: "Translate All",
    translateAllArticles: "Translate All Articles",
    bulkTranslating: "Translating all articles...",
    bulkTranslationComplete: "All articles translated successfully",
    bulkTranslationError: "Error translating articles",
    
    // General
    of: "of",
    articles: "articles",
  },
  
  hi: {
    // Header
    appTitle: "न्यूज़लेंस",
    appSubtitle: "बहुभाषी पूर्वाग्रह संसूचन",
    searchPlaceholder: "समाचार लेख खोजें...",
    
    // Navigation & Buttons
    settings: "सेटिंग्स",
    refresh: "रीफ्रेश",
    translate: "अनुवाद",
    close: "बंद करें",
    loading: "लोड हो रहा है...",
    
    // Stats Bar
    totalArticles: "कुल लेख",
    todayArticles: "आज के लेख",
    translatedArticles: "अनुवादित लेख",
    sortBy: "क्रमबद्ध करें",
    latest: "नवीनतम",
    oldest: "पुराना",
    mostTranslated: "सबसे अधिक अनुवादित",
    
    // Filters
    filters: "फिल्टर",
    categories: "श्रेणियां",
    biasTypes: "पूर्वाग्रह प्रकार",
    sentiments: "भावनाएं",
    timeRange: "समय सीमा",
    clearFilters: "फिल्टर साफ़ करें",
    
    // Categories
    politics: "राजनीति",
    technology: "प्रौद्योगिकी",
    sports: "खेल",
    business: "व्यापार",
    entertainment: "मनोरंजन",
    health: "स्वास्थ्य",
    science: "विज्ञान",
    education: "शिक्षा",
    
    // Bias Types
    left: "वाम",
    right: "दक्षिण",
    center: "केंद्र",
    neutral: "तटस्थ",
    
    // Sentiments
    positive: "सकारात्मक",
    negative: "नकारात्मक",
    
    // Time Ranges
    today: "आज",
    thisWeek: "इस सप्ताह",
    thisMonth: "इस महीने",
    
    // Article Card
    readMore: "और पढ़ें",
    biasScore: "पूर्वाग्रह स्कोर",
    sentiment: "भावना",
    
    // Translation Modal
    translationFor: "के लिए अनुवाद",
    originalLanguage: "मूल भाषा",
    targetLanguage: "लक्ष्य भाषा",
    translating: "अनुवाद हो रहा है...",
    translationError: "अनुवाद त्रुटि",
    
    // Error Messages
    errorLoadingArticles: "लेख लोड करने में त्रुटि",
    noArticlesFound: "कोई लेख नहीं मिला",
    
    // Bulk Translation
    translateAll: "सभी अनुवाद करें",
    translateAllArticles: "सभी लेख अनुवाद करें",
    bulkTranslating: "सभी लेख अनुवाद कर रहे हैं...",
    bulkTranslationComplete: "सभी लेख सफलतापूर्वक अनुवादित",
    bulkTranslationError: "लेख अनुवादित करने में त्रुटि",
    
    // General
    of: "का",
    articles: "लेख",
  },
  
  mr: {
    // Header
    appTitle: "न्यूजलेन्स",
    appSubtitle: "बहुभाषिक पूर्वग्रह शोध",
    searchPlaceholder: "बातम्या शोधा...",
    
    // Navigation & Buttons
    settings: "सेटिंग्ज",
    refresh: "रिफ्रेश",
    translate: "भाषांतर",
    close: "बंद करा",
    loading: "लोड होत आहे...",
    
    // Stats Bar
    totalArticles: "एकूण लेख",
    todayArticles: "आजचे लेख",
    translatedArticles: "भाषांतरित लेख",
    sortBy: "क्रमवारी",
    latest: "नवीनतम",
    oldest: "जुने",
    mostTranslated: "सर्वाधिक भाषांतरित",
    
    // Filters
    filters: "फिल्टर",
    categories: "श्रेणी",
    biasTypes: "पूर्वग्रह प्रकार",
    sentiments: "भावना",
    timeRange: "कालावधी",
    clearFilters: "फिल्टर साफ करा",
    
    // Categories
    politics: "राजकारण",
    technology: "तंत्रज्ञान",
    sports: "खेळ",
    business: "व्यवसाय",
    entertainment: "मनोरंजन",
    health: "आरोग्य",
    science: "विज्ञान",
    education: "शिक्षण",
    
    // Bias Types
    left: "डावे",
    right: "उजवे",
    center: "मध्यम",
    neutral: "तटस्थ",
    
    // Sentiments
    positive: "सकारात्मक",
    negative: "नकारात्मक",
    
    // Time Ranges
    today: "आज",
    thisWeek: "या आठवड्यात",
    thisMonth: "या महिन्यात",
    
    // Article Card
    readMore: "अधिक वाचा",
    biasScore: "पूर्वग्रह स्कोअर",
    sentiment: "भावना",
    
    // Translation Modal
    translationFor: "साठी भाषांतर",
    originalLanguage: "मूळ भाषा",
    targetLanguage: "लक्ष्य भाषा",
    translating: "भाषांतर करत आहे...",
    translationError: "भाषांतर त्रुटी",
    
    // Error Messages
    errorLoadingArticles: "लेख लोड करताना त्रुटी",
    noArticlesFound: "कोणतेही लेख सापडले नाहीत",
    
    // Bulk Translation
    translateAll: "सर्व भाषांतर करा",
    translateAllArticles: "सर्व लेख भाषांतर करा",
    bulkTranslating: "सर्व लेख भाषांतर करत आहे...",
    bulkTranslationComplete: "सर्व लेख यशस्वीरित्या भाषांतरित",
    bulkTranslationError: "लेख भाषांतर करताना त्रुटी",
    
    // General
    of: "चे",
    articles: "लेख",
  },
  
  ta: {
    // Header
    appTitle: "செய்திலென்ஸ்",
    appSubtitle: "பன்மொழி சார்பு கணிப்பு",
    searchPlaceholder: "செய்திக் கட்டுரைகளைத் தேடு...",
    
    // Navigation & Buttons
    settings: "அமைப்புகள்",
    refresh: "புதுப்பிக்கவும்",
    translate: "மொழிபெயர்க்கவும்",
    close: "மூடு",
    loading: "ஏற்றுகிறது...",
    
    // Stats Bar
    totalArticles: "மொத்த கட்டுரைகள்",
    todayArticles: "இன்றைய கட்டுரைகள்",
    translatedArticles: "மொழிபெயர்க்கப்பட்ட கட்டுரைகள்",
    sortBy: "வரிசைப்படுத்து",
    latest: "சமீபத்தியது",
    oldest: "பழையது",
    mostTranslated: "அதிகம் மொழிபெயர்க்கப்பட்டது",
    
    // Filters
    filters: "வடிகட்டிகள்",
    categories: "வகைகள்",
    biasTypes: "சார்பு வகைகள்",
    sentiments: "உணர்வுகள்",
    timeRange: "கால வரம்பு",
    clearFilters: "வடிகட்டிகளை நீக்கு",
    
    // Categories
    politics: "அரசியல்",
    technology: "தொழில்நுட்பம்",
    sports: "விளையாட்டு",
    business: "வணிகம்",
    entertainment: "பொழுதுபோக்கு",
    health: "சுகாதாரம்",
    science: "அறிவியல்",
    education: "கல்வி",
    
    // Bias Types
    left: "இடது",
    right: "வலது",
    center: "மத்திய",
    neutral: "நடுநிலை",
    
    // Sentiments
    positive: "நேர்மறை",
    negative: "எதிர்மறை",
    
    // Time Ranges
    today: "இன்று",
    thisWeek: "இந்த வாரம்",
    thisMonth: "இந்த மாதம்",
    
    // Article Card
    readMore: "மேலும் படிக்க",
    biasScore: "சார்பு மதிப்பெண்",
    sentiment: "உணர்வு",
    
    // Translation Modal
    translationFor: "க்கான மொழிபெயர்ப்பு",
    originalLanguage: "அசல் மொழி",
    targetLanguage: "இலக்கு மொழி",
    translating: "மொழிபெயர்க்கிறது...",
    translationError: "மொழிபெயர்ப்பு பிழை",
    
    // Error Messages
    errorLoadingArticles: "கட்டுரைகளை ஏற்றுவதில் பிழை",
    noArticlesFound: "கட்டுரைகள் எதுவும் கிடைக்கவில்லை",
    
    // Bulk Translation
    translateAll: "அனைத்தையும் மொழிபெயர்க்கவும்",
    translateAllArticles: "அனைத்து கட்டுரைகளையும் மொழிபெயர்க்கவும்",
    bulkTranslating: "அனைத்து கட்டுரைகளும் மொழிபெயர்க்கப்படுகின்றன...",
    bulkTranslationComplete: "அனைத்து கட்டுரைகளும் வெற்றிகரமாக மொழிபெயர்க்கப்பட்டன",
    bulkTranslationError: "கட்டுரைகளை மொழிபெயர்ப்பதில் பிழை",
    
    // General
    of: "இன்",
    articles: "கட்டுரைகள்",
  },
  
  kn: {
    // Header
    appTitle: "ನ್ಯೂಸ್‌ಲೆನ್ಸ್",
    appSubtitle: "ಬಹುಭಾಷಾ ಪಕ್ಷಪಾತ ಪತ್ತೆ",
    searchPlaceholder: "ಸುದ್ದಿ ಲೇಖನಗಳನ್ನು ಹುಡುಕಿ...",
    
    // Navigation & Buttons
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    refresh: "ರಿಫ್ರೆಶ್",
    translate: "ಅನುವಾದ",
    close: "ಮುಚ್ಚಿ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    
    // Stats Bar
    totalArticles: "ಒಟ್ಟು ಲೇಖನಗಳು",
    todayArticles: "ಇಂದಿನ ಲೇಖನಗಳು",
    translatedArticles: "ಅನುವಾದಿತ ಲೇಖನಗಳು",
    sortBy: "ವರ್ಗೀಕರಣ",
    latest: "ಇತ್ತೀಚಿನ",
    oldest: "ಹಳೆಯ",
    mostTranslated: "ಹೆಚ್ಚು ಅನುವಾದಿತ",
    
    // Filters
    filters: "ಫಿಲ್ಟರ್‌ಗಳು",
    categories: "ವರ್ಗಗಳು",
    biasTypes: "ಪಕ್ಷಪಾತ ಪ್ರಕಾರಗಳು",
    sentiments: "ಭಾವನೆಗಳು",
    timeRange: "ಸಮಯ ವ್ಯಾಪ್ತಿ",
    clearFilters: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ",
    
    // Categories
    politics: "ರಾಜಕೀಯ",
    technology: "ತಂತ್ರಜ್ಞಾನ",
    sports: "ಕ್ರೀಡೆ",
    business: "ವ್ಯಾಪಾರ",
    entertainment: "ಮನರಂಜನೆ",
    health: "ಆರೋಗ್ಯ",
    science: "ವಿಜ್ಞಾನ",
    education: "ಶಿಕ್ಷಣ",
    
    // Bias Types
    left: "ಎಡ",
    right: "ಬಲ",
    center: "ಮಧ್ಯ",
    neutral: "ತಟಸ್ಥ",
    
    // Sentiments
    positive: "ಧನಾತ್ಮಕ",
    negative: "ಋಣಾತ್ಮಕ",
    
    // Time Ranges
    today: "ಇಂದು",
    thisWeek: "ಈ ವಾರ",
    thisMonth: "ಈ ತಿಂಗಳು",
    
    // Article Card
    readMore: "ಹೆಚ್ಚು ಓದಿ",
    biasScore: "ಪಕ್ಷಪಾತ ಸ್ಕೋರ್",
    sentiment: "ಭಾವನೆ",
    
    // Translation Modal
    translationFor: "ಗಾಗಿ ಅನುವಾದ",
    originalLanguage: "ಮೂಲ ಭಾಷೆ",
    targetLanguage: "ಗುರಿ ಭಾಷೆ",
    translating: "ಅನುವಾದ ಮಾಡುತ್ತಿದೆ...",
    translationError: "ಅನುವಾದ ದೋಷ",
    
    // Error Messages
    errorLoadingArticles: "ಲೇಖನಗಳನ್ನು ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ",
    noArticlesFound: "ಯಾವುದೇ ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    
    // Bulk Translation
    translateAll: "ಎಲ್ಲವನ್ನೂ ಅನುವಾದಿಸಿ",
    translateAllArticles: "ಎಲ್ಲಾ ಲೇಖನಗಳನ್ನು ಅನುವಾದಿಸಿ",
    bulkTranslating: "ಎಲ್ಲಾ ಲೇಖನಗಳನ್ನು ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...",
    bulkTranslationComplete: "ಎಲ್ಲಾ ಲೇಖನಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅನುವಾದಿಸಲಾಗಿದೆ",
    bulkTranslationError: "ಲೇಖನಗಳನ್ನು ಅನುವಾದಿಸುವಲ್ಲಿ ದೋಷ",
    
    // General
    of: "ನ",
    articles: "ಲೇಖನಗಳು",
  },
  
  te: {
    // Header
    appTitle: "న్యూస్‌లెన్స్",
    appSubtitle: "బహుభాషా పక్షపాత గుర్తింపు",
    searchPlaceholder: "వార్తా వ్యాసాలను వెతకండి...",
    
    // Navigation & Buttons
    settings: "సెట్టింగులు",
    refresh: "రిఫ్రెష్",
    translate: "అనువాదం",
    close: "మూసివేయండి",
    loading: "లోడ్ అవుతోంది...",
    
    // Stats Bar
    totalArticles: "మొత్తం వ్యాసాలు",
    todayArticles: "నేటి వ్యాసాలు",
    translatedArticles: "అనువాదం చేసిన వ్యాసాలు",
    sortBy: "క్రమపద్ధతి",
    latest: "తాజా",
    oldest: "పాత",
    mostTranslated: "ఎక్కువ అనువాదం",
    
    // Filters
    filters: "ఫిల్టర్లు",
    categories: "వర్గాలు",
    biasTypes: "పక్షపాత రకాలు",
    sentiments: "భావనలు",
    timeRange: "సమయ పరిధి",
    clearFilters: "ఫిల్టర్లను క్లియర్ చేయండి",
    
    // Categories
    politics: "రాజకీయాలు",
    technology: "సాంకేతికత",
    sports: "క్రీడలు",
    business: "వ్యాపారం",
    entertainment: "వినోదం",
    health: "ఆరోగ్యం",
    science: "శాస్త్రం",
    education: "విద్య",
    
    // Bias Types
    left: "వామ",
    right: "కుడి",
    center: "మధ్య",
    neutral: "తటస్థ",
    
    // Sentiments
    positive: "సానుకూల",
    negative: "ప్రతికూల",
    
    // Time Ranges
    today: "నేడు",
    thisWeek: "ఈ వారం",
    thisMonth: "ఈ నెల",
    
    // Article Card
    readMore: "మరింత చదవండి",
    biasScore: "పక్షపాత స్కోర్",
    sentiment: "భావన",
    
    // Translation Modal
    translationFor: "కోసం అనువాదం",
    originalLanguage: "మూల భాష",
    targetLanguage: "లక్ష్య భాష",
    translating: "అనువాదం చేస్తోంది...",
    translationError: "అనువాద లోపం",
    
    // Error Messages
    errorLoadingArticles: "వ్యాసాలను లోడ్ చేయడంలో లోపం",
    noArticlesFound: "వ్యాసాలు కనుగొనబడలేదు",
    
    // Bulk Translation
    translateAll: "అన్నింటినీ అనువదించండి",
    translateAllArticles: "అన్ని వ్యాసాలను అనువదించండి",
    bulkTranslating: "అన్ని వ్యాసాలు అనువదించబడుతున్నాయి...",
    bulkTranslationComplete: "అన్ని వ్యాసాలు విజయవంతంగా అనువదించబడ్డాయి",
    bulkTranslationError: "వ్యాసాలను అనువదించడంలో లోపం",
    
    // General
    of: "యొక్క",
    articles: "వ్యాసాలు",
  },
  
  ml: {
    // Header
    appTitle: "ന്യൂസ്‌ലെൻസ്",
    appSubtitle: "ബഹുഭാഷാ പക്ഷപാത കണ്ടെത്തൽ",
    searchPlaceholder: "വാർത്താ ലേഖനങ്ങൾ തിരയുക...",
    
    // Navigation & Buttons
    settings: "ക്രമീകരണങ്ങൾ",
    refresh: "പുതുക്കുക",
    translate: "വിവർത്തനം",
    close: "അടയ്ക്കുക",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    
    // Stats Bar
    totalArticles: "മൊത്തം ലേഖനങ്ങൾ",
    todayArticles: "ഇന്നത്തെ ലേഖനങ്ങൾ",
    translatedArticles: "വിവർത്തനം ചെയ്ത ലേഖനങ്ങൾ",
    sortBy: "ക്രമപ്പെടുത്തുക",
    latest: "ഏറ്റവും പുതിയത്",
    oldest: "പഴയത്",
    mostTranslated: "ഏറ്റവും കൂടുതൽ വിവർത്തനം",
    
    // Filters
    filters: "ഫിൽട്ടറുകൾ",
    categories: "വിഭാഗങ്ങൾ",
    biasTypes: "പക്ഷപാത തരങ്ങൾ",
    sentiments: "വികാരങ്ങൾ",
    timeRange: "സമയ പരിധി",
    clearFilters: "ഫിൽട്ടറുകൾ മായ്ക്കുക",
    
    // Categories
    politics: "രാഷ്ട്രീയം",
    technology: "സാങ്കേതികവിദ്യ",
    sports: "കായികം",
    business: "വ്യാപാരം",
    entertainment: "വിനോദം",
    health: "ആരോഗ്യം",
    science: "ശാസ്ത്രം",
    education: "വിദ്യാഭ്യാസം",
    
    // Bias Types
    left: "ഇടത്",
    right: "വലത്",
    center: "മധ്യം",
    neutral: "നിഷ്പക്ഷ",
    
    // Sentiments
    positive: "പോസിറ്റീവ്",
    negative: "നെഗറ്റീവ്",
    
    // Time Ranges
    today: "ഇന്ന്",
    thisWeek: "ഈ ആഴ്ച",
    thisMonth: "ഈ മാസം",
    
    // Article Card
    readMore: "കൂടുതൽ വായിക്കുക",
    biasScore: "പക്ഷപാത സ്കോർ",
    sentiment: "വികാരം",
    
    // Translation Modal
    translationFor: "യ്ക്കുള്ള വിവർത്തനം",
    originalLanguage: "മൂല ഭാഷ",
    targetLanguage: "ലക്ഷ്യ ഭാഷ",
    translating: "വിവർത്തനം ചെയ്യുന്നു...",
    translationError: "വിവർത്തന പിശക്",
    
    // Error Messages
    errorLoadingArticles: "ലേഖനങ്ങൾ ലോഡ് ചെയ്യുന്നതിൽ പിശക്",
    noArticlesFound: "ലേഖനങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
    
    // Bulk Translation
    translateAll: "എല്ലാം വിവർത്തനം ചെയ്യുക",
    translateAllArticles: "എല്ലാ ലേഖനങ്ങളും വിവർത്തനം ചെയ്യുക",
    bulkTranslating: "എല്ലാ ലേഖനങ്ങളും വിവർത്തനം ചെയ്യുന്നു...",
    bulkTranslationComplete: "എല്ലാ ലേഖനങ്ങളും വിജയകരമായി വിവർത്തനം ചെയ്തു",
    bulkTranslationError: "ലേഖനങ്ങൾ വിവർത്തനം ചെയ്യുന്നതിൽ പിശക്",
    
    // General
    of: "യുടെ",
    articles: "ലേഖനങ്ങൾ",
  },
};

export default translations;