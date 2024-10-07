import locales from '@assets/locales';
export const defaultNS = 'ns1';
export const ns = ['ns1', 'ns2'];
export const resources = {
  ...locales,
} as const;

export default resources;
