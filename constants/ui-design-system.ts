// ui-design-system.ts
// This file exports the design system tokens for easy import in components
import { useMemo } from 'react';
import designSystem from '../.config/ui-design-system.json';

export default designSystem;

export function useTheme() {
  // Example: map design tokens to React Native styles
  return useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: designSystem.colorPalette.background.primary,
      padding: 16,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: designSystem.colorPalette.primary.blue,
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: designSystem.colorPalette.neutral.mediumGray,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
      backgroundColor: designSystem.colorPalette.background.secondary,
    },
    error: {
      color: designSystem.colorPalette.primary.red,
      marginBottom: 8,
    },
    button: {
      backgroundColor: designSystem.colorPalette.primary.blue,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: designSystem.colorPalette.neutral.white,
      fontWeight: '600',
      fontSize: 16,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 10,
      borderWidth: 1,
      borderColor: designSystem.colorPalette.primary.blue,
    },
    secondaryButtonText: {
      color: designSystem.colorPalette.primary.blue,
      fontWeight: '600',
      fontSize: 16,
    },
    card: {
      backgroundColor: designSystem.colorPalette.neutral.white,
      borderRadius: 12,
      padding: 20,
      shadowColor: designSystem.colorPalette.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      margin: 16,
    },
    profileItem: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: designSystem.colorPalette.background.secondary,
    },
    profileItemLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: designSystem.colorPalette.neutral.darkGray,
      width: '30%',
    },
    profileItemValue: {
      fontSize: 16,
      color: designSystem.colorPalette.neutral.black,
      flex: 1,
    },
  }), []);
}
