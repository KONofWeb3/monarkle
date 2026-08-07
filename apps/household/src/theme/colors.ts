// Design tokens pulled from Figma (MONARKLE Household app, file 00xhBGP0srHno5lSZpvdrt)
export const colors = {
  // brand
  primary: '#005F28', // Foundation/Green/green-500
  primaryAlt: '#008037', // Foundation/Green 2/green2-500
  primaryLight: '#E6EFEA', // Foundation/Green/green-50
  primarySoft: '#E6ECE9',

  // accents (seen across category chips / status badges)
  sell: '#B5490B', // "Sell" intent (orange/brown)
  info: '#2F6FED',
  infoBg: '#E8F0FE',
  warning: '#B58900',
  warningBg: '#FDF3D8',
  danger: '#D92D20',
  dangerBg: '#FBEAE9',
  success: '#0F9D58',

  // text
  textPrimary: '#0B1F19',
  textBody: '#4B5A54',
  textSecondary: '#99A1AB',
  textMuted: '#8C9490',
  textInverse: '#FFFFFF',

  // surfaces
  background: '#F7F7F6',
  surface: '#FFFFFF',
  surfaceAlt: '#FAF9F9',
  border: '#E7E9E8',
  divider: '#EEF0EF',

  // misc
  overlay: 'rgba(11,31,25,0.5)',
} as const;
