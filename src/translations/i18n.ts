import { I18n } from 'i18n-js';

import en from './en';
import zh from './zh';

const i18n = new I18n({ en, zh });
i18n.enableFallback = true;

export default i18n;
