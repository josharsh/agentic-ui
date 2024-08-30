import { useTranslation } from 'react-i18next';
import { Switch } from '@radix-ui/react-switch';
import { useState, useEffect } from 'react';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === 'en');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsEnglish(lng === 'en');
    localStorage.setItem('language', lng); // Save selected language to localStorage
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setIsEnglish(savedLanguage === 'en');
    } else {
      setIsEnglish(i18n.language === 'en');
    }
  }, [i18n]);

  return (
    <div className="flex items-center gap-2">
      <span>{isEnglish ? 'English' : 'ภาษาไทย'}</span>
      <Switch
        checked={isEnglish}
        onCheckedChange={(checked) => changeLanguage(checked ? 'en' : 'th')}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
      >
        <span className="sr-only">Toggle Language</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isEnglish ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </Switch>
    </div>
  );
}

export default LanguageSwitcher;