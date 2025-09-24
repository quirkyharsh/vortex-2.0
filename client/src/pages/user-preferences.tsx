import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { apiRequest } from '@/lib/queryClient';
import { userOnboardingSchema, UserOnboardingData, UserPreferences } from '@shared/schema';
import type { SupportedLanguage } from '@/lib/i18n';
import { Sparkles, Settings, Globe, Heart, ChevronRight, SkipForward } from 'lucide-react';

// Available categories that map to existing system categories
const NEWS_CATEGORIES = [
  { id: 'technology', label: 'Technology', description: 'Latest tech news, gadgets, and innovations' },
  { id: 'politics', label: 'Politics', description: 'Political news and government updates' },
  { id: 'sports', label: 'Sports', description: 'Sports news, scores, and highlights' },
  { id: 'entertainment', label: 'Entertainment', description: 'Movies, music, celebrities, and pop culture' },
  { id: 'business', label: 'Business', description: 'Business news, markets, and finance' },
  { id: 'health', label: 'Health', description: 'Health, medical news, and wellness' },
  { id: 'science', label: 'Science', description: 'Scientific discoveries and research' },
  { id: 'general', label: 'General', description: 'Breaking news and miscellaneous topics' },
];

// Available languages with native names
const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

// Tone preferences with descriptions
const TONE_OPTIONS = [
  {
    value: 'neutral',
    label: 'Factual & Professional',
    description: 'Objective reporting with balanced perspectives',
    icon: '📊'
  },
  {
    value: 'opinionated',
    label: 'Bold & Forward-Thinking',
    description: 'Strong viewpoints and thought-provoking analysis',
    icon: '🔥'
  },
  {
    value: 'emotional',
    label: 'Human-Centered & Relatable',
    description: 'Stories that connect on an emotional level',
    icon: '💝'
  }
];

export default function UserPreferencesPage() {
  const { user } = useAuth();
  const { setLanguage } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [dislikedTopicsInput, setDislikedTopicsInput] = useState('');

  // Form setup with validation
  const form = useForm<UserOnboardingData>({
    resolver: zodResolver(userOnboardingSchema),
    defaultValues: {
      preferredCategories: [],
      preferredLanguages: ['en'], // Default to English
      preferredTone: '',
      dislikedTopics: [],
    }
  });

  // Fetch existing user preferences
  const { data: existingPreferences, isLoading } = useQuery({
    queryKey: ['/api/users', user?.id, 'preferences'],
    enabled: !!user?.id,
  });

  // Auto-populate form if user has existing preferences
  useEffect(() => {
    if (existingPreferences && !form.formState.isDirty) {
      const prefs = existingPreferences as UserPreferences;
      form.reset({
        preferredCategories: prefs.preferredCategories || [],
        preferredLanguages: prefs.preferredLanguages || ['en'],
        preferredTone: prefs.preferredTone || '',
        dislikedTopics: prefs.dislikedTopics || [],
      });
      setDislikedTopicsInput((prefs.dislikedTopics || []).join(', '));
    }
  }, [existingPreferences, form]);

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (data: UserOnboardingData) => {
      const dislikedTopicsArray = dislikedTopicsInput
        .split(',')
        .map(topic => topic.trim())
        .filter(topic => topic.length > 0);

      const preferencesData = {
        userId: user!.id,
        preferredCategories: data.preferredCategories,
        preferredLanguages: data.preferredLanguages,
        preferredTone: data.preferredTone,
        dislikedTopics: dislikedTopicsArray,
        hasCompletedOnboarding: true,
      };

      const response = await apiRequest('POST', `/api/users/${user!.id}/preferences`, preferencesData);
      return response.json();
    },
    onSuccess: (savedPreferences) => {
      // Apply language preference immediately if selected
      const form_data = form.getValues();
      if (form_data.preferredLanguages && form_data.preferredLanguages.length > 0) {
        const selectedLang = form_data.preferredLanguages[0];
        setLanguage(selectedLang as SupportedLanguage);
      }
      
      toast({
        title: "Preferences Saved!",
        description: "Your news preferences have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'preferences'] });
      // Clear the redirect flags when preferences are saved
      sessionStorage.removeItem('vartaAI_preferences_redirect');
      sessionStorage.removeItem(`vartaAI_redirected_${user?.id}`);
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Skip onboarding and go to homepage
  const handleSkip = () => {
    setLocation('/');
  };

  const onSubmit = (data: UserOnboardingData) => {
    savePreferencesMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Varta.ai
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Where trusted news meets your preferences
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Let's personalize your news experience to match your interests
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* News Categories */}
            <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  News Categories
                </CardTitle>
                <CardDescription>
                  Choose the topics you're most interested in. We'll prioritize these in your feed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="preferredCategories"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {NEWS_CATEGORIES.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="preferredCategories"
                            render={({ field }) => (
                              <FormItem key={category.id}>
                                <FormControl>
                                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <Checkbox
                                      checked={field.value?.includes(category.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValue, category.id]);
                                        } else {
                                          field.onChange(currentValue.filter((value) => value !== category.id));
                                        }
                                      }}
                                    />
                                    <div className="flex-1">
                                      <FormLabel className="text-base font-medium cursor-pointer">
                                        {category.label}
                                      </FormLabel>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {category.description}
                                      </p>
                                    </div>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Language Preferences */}
            <Card className="border-2 border-green-100 dark:border-green-900 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  Language Preferences
                </CardTitle>
                <CardDescription>
                  Select the languages you'd like to read news in. Articles can be translated automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="preferredLanguages"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {LANGUAGES.map((language) => (
                          <FormField
                            key={language.code}
                            control={form.control}
                            name="preferredLanguages"
                            render={({ field }) => (
                              <FormItem key={language.code}>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={field.value?.includes(language.code)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValue, language.code]);
                                        } else {
                                          // Ensure at least one language is selected
                                          const newValue = currentValue.filter((value) => value !== language.code);
                                          if (newValue.length > 0) {
                                            field.onChange(newValue);
                                          }
                                        }
                                      }}
                                    />
                                    <FormLabel className="text-sm cursor-pointer">
                                      <div>
                                        <div className="font-medium">{language.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{language.nativeName}</div>
                                      </div>
                                    </FormLabel>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tone Preferences */}
            <Card className="border-2 border-purple-100 dark:border-purple-900 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Heart className="h-5 w-5 mr-2 text-purple-600" />
                  Preferred Tone
                </CardTitle>
                <CardDescription>
                  Choose the style of news reporting that resonates with you most.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="preferredTone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-4"
                        >
                          {TONE_OPTIONS.map((option) => (
                            <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                              <FormLabel htmlFor={option.value} className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg">{option.icon}</span>
                                  <span className="font-medium text-base">{option.label}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {option.description}
                                </p>
                              </FormLabel>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Topics to Avoid */}
            <Card className="border-2 border-orange-100 dark:border-orange-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Topics to Avoid</CardTitle>
                <CardDescription>
                  List any specific topics or keywords you'd prefer not to see in your news feed. Separate multiple topics with commas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., celebrity gossip, sports injuries, natural disasters"
                  value={dislikedTopicsInput}
                  onChange={(e) => setDislikedTopicsInput(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  This is optional and helps us filter out content you're not interested in.
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="px-6 py-3"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Skip for Now
              </Button>
              <Button
                type="submit"
                disabled={savePreferencesMutation.isPending}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {savePreferencesMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Save Preferences
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Display selected preferences summary */}
        {form.watch('preferredCategories').length > 0 && (
          <Card className="mt-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg">Your Preferences Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Selected Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.watch('preferredCategories').map((categoryId) => {
                      const category = NEWS_CATEGORIES.find(c => c.id === categoryId);
                      return category ? (
                        <Badge key={categoryId} variant="secondary">
                          {category.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Selected Languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.watch('preferredLanguages').map((langCode) => {
                      const language = LANGUAGES.find(l => l.code === langCode);
                      return language ? (
                        <Badge key={langCode} variant="outline">
                          {language.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>

                {form.watch('preferredTone') && (
                  <div>
                    <p className="text-sm font-medium mb-2">Preferred Tone:</p>
                    <Badge variant="default">
                      {TONE_OPTIONS.find(t => t.value === form.watch('preferredTone'))?.label}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}