// Headings use Plus Jakarta Sans (Bold/SemiBold), body text uses Inter.
export const fontFamily = {
  headingBold: 'PlusJakartaSans_700Bold',
  headingSemiBold: 'PlusJakartaSans_600SemiBold',
  bodyRegular: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
};

export const typography = {
  h1: { fontFamily: fontFamily.headingBold, fontSize: 30, lineHeight: 36 },
  h2: { fontFamily: fontFamily.headingBold, fontSize: 24, lineHeight: 30 },
  h3: { fontFamily: fontFamily.headingSemiBold, fontSize: 20, lineHeight: 26 },
  h4: { fontFamily: fontFamily.headingSemiBold, fontSize: 17, lineHeight: 22 },
  bodyLg: { fontFamily: fontFamily.bodyRegular, fontSize: 18, lineHeight: 26 },
  body: { fontFamily: fontFamily.bodyRegular, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fontFamily.bodyMedium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fontFamily.bodyRegular, fontSize: 13, lineHeight: 18 },
  captionMedium: { fontFamily: fontFamily.bodyMedium, fontSize: 13, lineHeight: 18 },
  tiny: { fontFamily: fontFamily.bodyRegular, fontSize: 11, lineHeight: 15 },
  button: { fontFamily: fontFamily.bodyMedium, fontSize: 16, lineHeight: 24 },
} as const;
