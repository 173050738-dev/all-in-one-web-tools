export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  consentDate: string;
}

export const getCookiePreferences = (): CookiePreferences => {
  if (typeof window === 'undefined') {
    return {
      necessary: true,
      analytics: false,
      advertising: false,
      consentDate: '',
    };
  }
  
  const stored = localStorage.getItem('cookiePreferences');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {
        necessary: true,
        analytics: false,
        advertising: false,
        consentDate: '',
      };
    }
  }
  
  return {
    necessary: true,
    analytics: false,
    advertising: false,
    consentDate: '',
  };
};

export const setCookiePreferences = (preferences: CookiePreferences): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
  }
};

export const hasCookieConsent = (): boolean => {
  const preferences = getCookiePreferences();
  return preferences.consentDate !== '';
};