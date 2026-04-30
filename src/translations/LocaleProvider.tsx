import { type FC, type ReactNode, createContext, useContext, useState } from 'react';

import { useSQLiteContext } from 'expo-sqlite';

import { getPreferences } from '../db';
import i18n from './i18n';

type LocaleContextValue = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
});

export const useLocale = (): LocaleContextValue => useContext(LocaleContext);

type Props = {
  children: ReactNode;
};

const LocaleProvider: FC<Props> = ({ children }) => {
  const db = useSQLiteContext();
  const prefs = getPreferences(db);
  const initialLocale = prefs.language ?? 'en';

  const [locale, setLocaleState] = useState(initialLocale);

  const setLocale = (newLocale: string): void => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
  };

  i18n.locale = locale;

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
};

export default LocaleProvider;
