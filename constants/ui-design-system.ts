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
  }), []);
}
