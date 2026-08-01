'use client';

import { useState, useCallback } from 'react';
import { ChefHat, RefreshCw, Copy, Check, Sparkles, Utensils, ListOrdered, Apple, Lightbulb, Flame } from 'lucide-react';

interface AiRecipeGeneratorProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 菜谱生成器',
    subtitle: '输入食材和偏好，AI 生成2个详细菜谱（含步骤/贴士/营养）',
    ingredients: '食材',
    ingredientsPlaceholder: '请输入手头的食材，逗号分隔...\n例如：鸡蛋, 西红柿, 面条, 葱',
    cuisine: '菜系',
    cuisineChinese: '中式',
    cuisineWestern: '西式',
    cuisineJapanese: '日式',
    cuisineKorean: '韩式',
    cuisineSoutheast: '东南亚',
    cuisineAny: '不限',
    difficulty: '难度',
    difficultyEasy: '简单',
    difficultyMedium: '中等',
    difficultyHard: '复杂',
    servings: '几人份',
    diet: '饮食限制',
    dietNone: '无',
    dietVegetarian: '素食',
    dietLowcalorie: '低卡',
    dietGlutenfree: '无麸质',
    generate: '✨ 生成菜谱',
    loading: '正在生成...',
    recipe: '菜谱',
    ingredientsList: '食材清单',
    steps: '烹饪步骤',
    tips: '烹饪贴士',
    nutrition: '营养信息',
    copyRecipe: '复制菜谱',
    copied: '已复制',
    noResult: '请输入食材开始生成',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    required: '此项必填',
  },
  en: {
    title: 'AI Recipe Generator',
    subtitle: 'Enter ingredients and preferences to get 2 detailed recipes',
    ingredients: 'Ingredients',
    ingredientsPlaceholder: 'Enter ingredients, comma-separated...\ne.g. eggs, tomato, noodles, scallion',
    cuisine: 'Cuisine',
    cuisineChinese: 'Chinese',
    cuisineWestern: 'Western',
    cuisineJapanese: 'Japanese',
    cuisineKorean: 'Korean',
    cuisineSoutheast: 'Southeast Asian',
    cuisineAny: 'Any',
    difficulty: 'Difficulty',
    difficultyEasy: 'Easy',
    difficultyMedium: 'Medium',
    difficultyHard: 'Hard',
    servings: 'Servings',
    diet: 'Diet',
    dietNone: 'None',
    dietVegetarian: 'Vegetarian',
    dietLowcalorie: 'Low-calorie',
    dietGlutenfree: 'Gluten-free',
    generate: '✨ Generate Recipes',
    loading: 'Generating...',
    recipe: 'Recipe',
    ingredientsList: 'Ingredients',
    steps: 'Steps',
    tips: 'Tips',
    nutrition: 'Nutrition',
    copyRecipe: 'Copy',
    copied: 'Copied',
    noResult: 'Enter ingredients to start',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded',
    remaining: 'Remaining today: ',
    required: 'Required field',
  },
  hi: {
    title: 'AI रेसिपी जनरेटर',
    subtitle: 'सामग्री दर्ज करें और 2 विस्तृत रेसिपी पाएं',
    ingredients: 'सामग्री',
    ingredientsPlaceholder: 'सामग्री दर्ज करें, कॉमा से अलग...',
    cuisine: 'भोजन',
    cuisineChinese: 'चीनी',
    cuisineWestern: 'पश्चिमी',
    cuisineJapanese: 'जापानी',
    cuisineKorean: 'कोरियाई',
    cuisineSoutheast: 'दक्षिण पूर्व एशियाई',
    cuisineAny: 'कोई भी',
    difficulty: 'कठिनाई',
    difficultyEasy: 'आसान',
    difficultyMedium: 'मध्यम',
    difficultyHard: 'कठिन',
    servings: 'हिस्से',
    diet: 'आहार',
    dietNone: 'कोई नहीं',
    dietVegetarian: 'शाकाहारी',
    dietLowcalorie: 'कम कैलोरी',
    dietGlutenfree: 'ग्लूटेन मुक्त',
    generate: '✨ रेसिपी बनाएं',
    loading: 'बनाया जा रहा है...',
    recipe: 'रेसिपी',
    ingredientsList: 'सामग्री',
    steps: 'चरण',
    tips: 'सुझाव',
    nutrition: 'पोषण',
    copyRecipe: 'कॉपी करें',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए सामग्री दर्ज करें',
    error: 'जनरेशन विफल, कृपया पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी हो चुकी है',
    remaining: 'आज शेष: ',
    required: 'आवश्यक क्षेत्र',
  },
  fr: {
    title: 'Générateur de recettes AI',
    subtitle: 'Saisissez ingrédients et préférences pour 2 recettes détaillées',
    ingredients: 'Ingrédients',
    ingredientsPlaceholder: 'Entrez les ingrédients, séparés par virgule...',
    cuisine: 'Cuisine',
    cuisineChinese: 'Chinoise',
    cuisineWestern: 'Occidentale',
    cuisineJapanese: 'Japonaise',
    cuisineKorean: 'Coréenne',
    cuisineSoutheast: 'Sud-est asiatique',
    cuisineAny: 'Toute',
    difficulty: 'Difficulté',
    difficultyEasy: 'Facile',
    difficultyMedium: 'Moyenne',
    difficultyHard: 'Difficile',
    servings: 'Portions',
    diet: 'Régime',
    dietNone: 'Aucun',
    dietVegetarian: 'Végétarien',
    dietLowcalorie: 'Faible calorie',
    dietGlutenfree: 'Sans gluten',
    generate: '✨ Générer',
    loading: 'Génération...',
    recipe: 'Recette',
    ingredientsList: 'Ingrédients',
    steps: 'Étapes',
    tips: 'Conseils',
    nutrition: 'Nutrition',
    copyRecipe: 'Copier',
    copied: 'Copié',
    noResult: 'Entrez les ingrédients pour commencer',
    error: 'Échec de la génération, réessayez',
    rateLimit: 'Limite gratuite quotidienne atteinte',
    remaining: 'Restant aujourd\'hui: ',
    required: 'Champ requis',
  },
  es: {
    title: 'Generador de recetas AI',
    subtitle: 'Ingresa ingredientes y preferencias para 2 recetas detalladas',
    ingredients: 'Ingredientes',
    ingredientsPlaceholder: 'Ingresa ingredientes, separados por coma...',
    cuisine: 'Cocina',
    cuisineChinese: 'China',
    cuisineWestern: 'Occidental',
    cuisineJapanese: 'Japonesa',
    cuisineKorean: 'Coreana',
    cuisineSoutheast: 'Sudeste asiático',
    cuisineAny: 'Cualquiera',
    difficulty: 'Dificultad',
    difficultyEasy: 'Fácil',
    difficultyMedium: 'Media',
    difficultyHard: 'Difícil',
    servings: 'Porciones',
    diet: 'Dieta',
    dietNone: 'Ninguna',
    dietVegetarian: 'Vegetariano',
    dietLowcalorie: 'Bajo en calorías',
    dietGlutenfree: 'Sin gluten',
    generate: '✨ Generar',
    loading: 'Generando...',
    recipe: 'Receta',
    ingredientsList: 'Ingredientes',
    steps: 'Pasos',
    tips: 'Consejos',
    nutrition: 'Nutrición',
    copyRecipe: 'Copiar',
    copied: 'Copiado',
    noResult: 'Ingresa ingredientes para empezar',
    error: 'Error al generar, intenta de nuevo',
    rateLimit: 'Límite gratuito diario alcanzado',
    remaining: 'Restante hoy: ',
    required: 'Campo obligatorio',
  },
  ar: {
    title: 'مولد الوصفات AI',
    subtitle: 'أدخل المكونات والتفضيلات للحصول على وصفات مفصلة',
    ingredients: 'المكونات',
    ingredientsPlaceholder: 'أدخل المكونات، مفصولة بفاصلة...',
    cuisine: 'المطبخ',
    cuisineChinese: 'صيني',
    cuisineWestern: 'غربي',
    cuisineJapanese: 'ياباني',
    cuisineKorean: 'كوري',
    cuisineSoutheast: 'جنوب شرق آسيوي',
    cuisineAny: 'أي',
    difficulty: 'الصعوبة',
    difficultyEasy: 'سهل',
    difficultyMedium: 'متوسط',
    difficultyHard: 'صعب',
    servings: 'الحصص',
    diet: 'الحمية',
    dietNone: 'بدون',
    dietVegetarian: 'نباتي',
    dietLowcalorie: 'منخفض السعرات',
    dietGlutenfree: 'خالٍ من الغلوتين',
    generate: '✨ إنشاء الوصفات',
    loading: 'جاري الإنشاء...',
    recipe: 'الوصفة',
    ingredientsList: 'المكونات',
    steps: 'الخطوات',
    tips: 'نصائح',
    nutrition: 'التغذية',
    copyRecipe: 'نسخ',
    copied: 'تم النسخ',
    noResult: 'أدخل المكونات لتبدأ',
    error: 'فشل الإنشاء، حاول مرة أخرى',
    rateLimit: 'تم الوصول إلى الحد اليومي المجاني',
    remaining: 'المتبقي اليوم: ',
    required: 'حقل إجباري',
  },
};

const CUISINES = [
  { key: 'any', label: 'cuisineAny' },
  { key: 'chinese', label: 'cuisineChinese' },
  { key: 'western', label: 'cuisineWestern' },
  { key: 'japanese', label: 'cuisineJapanese' },
  { key: 'korean', label: 'cuisineKorean' },
  { key: 'southeast', label: 'cuisineSoutheast' },
];

const DIFFICULTIES = [
  { key: 'easy', label: 'difficultyEasy' },
  { key: 'medium', label: 'difficultyMedium' },
  { key: 'hard', label: 'difficultyHard' },
];

const SERVINGS = [
  { key: '1', label: '1' },
  { key: '2', label: '2' },
  { key: '4', label: '4' },
  { key: '6', label: '6' },
];

const DIETS = [
  { key: 'none', label: 'dietNone' },
  { key: 'vegetarian', label: 'dietVegetarian' },
  { key: 'lowcalorie', label: 'dietLowcalorie' },
  { key: 'glutenfree', label: 'dietGlutenfree' },
];

interface RecipeItem {
  name: string;
  ingredients: string[];
  steps: string[];
  tips: string;
  nutrition: string;
}

interface GenerateResult {
  recipes: RecipeItem[];
  remaining: number | null;
}

export default function AiRecipeGenerator({ locale = 'zh' }: AiRecipeGeneratorProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [ingredients, setIngredients] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('any');
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [selectedServings, setSelectedServings] = useState('2');
  const [selectedDiet, setSelectedDiet] = useState('none');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!ingredients.trim()) {
      return;
    }

    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setResult(null);

    try {
      const response = await fetch('/api/ai-recipe-generator/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients.trim(),
          cuisine: selectedCuisine,
          difficulty: selectedDifficulty,
          servings: selectedServings,
          diet: selectedDiet,
          locale: resolvedLocale,
        }),
      });

      if (response.status === 429) {
        setRateLimitError(true);
        return;
      }

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        recipes: data.recipes || [],
        remaining: data.remaining,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [ingredients, selectedCuisine, selectedDifficulty, selectedServings, selectedDiet, resolvedLocale]);

  const handleCopy = useCallback(async (recipe: RecipeItem, index: number) => {
    const text = `${recipe.name}\n\n${t('ingredientsList')}:\n${recipe.ingredients.map((i) => `- ${i}`).join('\n')}\n\n${t('steps')}:\n${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n${t('tips')}: ${recipe.tips}\n\n${t('nutrition')}: ${recipe.nutrition}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }, [t]);

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'>
            <ChefHat className='h-5 w-5 sm:h-6 sm:w-6' />
          </div>
          <div>
            <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
          </div>
        </div>

        {((result && result.remaining !== null) || rateLimitError) && (
          <div className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm ${
            rateLimitError
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300'
              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300'
          }`}>
            {rateLimitError ? t('rateLimit') : `${t('remaining')}${result?.remaining ?? 0}`}
          </div>
        )}

        <div className='space-y-4 sm:space-y-6'>
          <div>
            <label className='flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              <Utensils className='h-4 w-4 text-amber-500' />
              {t('ingredients')} <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={ingredients}
              onChange={(e) => { setIngredients(e.target.value); setError(false); }}
              placeholder={t('ingredientsPlaceholder')}
              className='w-full h-24 sm:h-28 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('cuisine')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {CUISINES.map((cuisineItem) => (
                <button
                  key={cuisineItem.key}
                  onClick={() => setSelectedCuisine(cuisineItem.key)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    selectedCuisine === cuisineItem.key
                      ? 'text-white bg-gradient-to-br from-amber-500 to-orange-600 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t(cuisineItem.label)}
                </button>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                {t('difficulty')}
              </label>
              <div className='grid grid-cols-3 gap-2'>
                {DIFFICULTIES.map((diffItem) => (
                  <button
                    key={diffItem.key}
                    onClick={() => setSelectedDifficulty(diffItem.key)}
                    className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedDifficulty === diffItem.key
                        ? 'text-white bg-gradient-to-br from-amber-500 to-orange-600 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {t(diffItem.label)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                {t('servings')}
              </label>
              <div className='grid grid-cols-4 gap-2'>
                {SERVINGS.map((servItem) => (
                  <button
                    key={servItem.key}
                    onClick={() => setSelectedServings(servItem.key)}
                    className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedServings === servItem.key
                        ? 'text-white bg-gradient-to-br from-amber-500 to-orange-600 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {servItem.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                {t('diet')}
              </label>
              <div className='grid grid-cols-2 gap-2'>
                {DIETS.map((dietItem) => (
                  <button
                    key={dietItem.key}
                    onClick={() => setSelectedDiet(dietItem.key)}
                    className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedDiet === dietItem.key
                        ? 'text-white bg-gradient-to-br from-green-500 to-emerald-600 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {t(dietItem.label)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!ingredients.trim() || loading}
            className='w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-lg btn-primary text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <RefreshCw className='h-5 w-5 animate-spin' />
            ) : (
              <Sparkles className='h-5 w-5' />
            )}
            {loading ? t('loading') : t('generate')}
          </button>

          {error && !rateLimitError && (
            <div className='p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50'>
              <p className='text-sm text-red-700 dark:text-red-300'>{t('error')}</p>
            </div>
          )}

          {result && result.recipes.length > 0 && (
            <div className='space-y-4 sm:space-y-6'>
              <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('recipe')}</h3>
              <div className='space-y-4 sm:space-y-6'>
                {result.recipes.map((recipe, index) => (
                  <div
                    key={index}
                    className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <span className='px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-xs font-semibold text-amber-700 dark:text-amber-300 flex-shrink-0'>
                          #{index + 1}
                        </span>
                        <h4 className='text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate'>{recipe.name}</h4>
                      </div>
                      <button
                        onClick={() => handleCopy(recipe, index)}
                        className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px] flex-shrink-0'
                      >
                        {copiedIndex === index ? <Check className='h-3 w-3 text-green-600 dark:text-green-400' /> : <Copy className='h-3 w-3' />}
                        {copiedIndex === index ? t('copied') : t('copyRecipe')}
                      </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                      <div>
                        <div className='flex items-center gap-1.5 mb-2'>
                          <Apple className='h-4 w-4 text-green-500' />
                          <h5 className='text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100'>{t('ingredientsList')}</h5>
                        </div>
                        <ul className='space-y-1.5 ps-5 list-disc'>
                          {(recipe.ingredients || []).map((ing, i) => (
                            <li key={i} className='text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>{ing}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className='flex items-center gap-1.5 mb-2'>
                          <ListOrdered className='h-4 w-4 text-blue-500' />
                          <h5 className='text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100'>{t('steps')}</h5>
                        </div>
                        <ol className='space-y-2 ps-5 list-decimal'>
                          {(recipe.steps || []).map((step, i) => (
                            <li key={i} className='text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3'>
                      <div className='p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30'>
                        <div className='flex items-center gap-1.5 mb-1'>
                          <Lightbulb className='h-3.5 w-3.5 text-amber-600 dark:text-amber-400' />
                          <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>{t('tips')}</span>
                        </div>
                        <p className='text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>{recipe.tips}</p>
                      </div>
                      <div className='p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30'>
                        <div className='flex items-center gap-1.5 mb-1'>
                          <Flame className='h-3.5 w-3.5 text-rose-600 dark:text-rose-400' />
                          <span className='text-xs font-medium text-rose-700 dark:text-rose-400'>{t('nutrition')}</span>
                        </div>
                        <p className='text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>{recipe.nutrition}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
