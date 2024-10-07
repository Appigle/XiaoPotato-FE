import { defaultNS } from '../utils/i18n/i18nRes';
import Resources from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: Resources;
    // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
    // set returnNull to false (and also in the i18next init options)
    // returnNull: false;
  }
}
