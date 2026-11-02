export type FontSizeOption = 'normal' | 'large' | 'larger';
export type ContrastOption = 'normal' | 'dark' | 'light' | 'monochrome';

export interface AccessibilitySettings {
  fontSize: FontSizeOption;
  contrast: ContrastOption;
  highlightLinks: boolean;
  readableFont: boolean;
  stopAnimations: boolean;
}

export type CookieConsentType = 'all' | 'essential' | null;

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
}
