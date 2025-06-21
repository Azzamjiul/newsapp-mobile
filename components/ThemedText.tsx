import { Text, type TextProps } from 'react-native';

import { getFontWeight, pxToNumber } from '@/constants/parseDesignToken';
import designSystem from '@/constants/ui-design-system';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Map type to design system
  let dsStyle = {};
  if (type === 'title') {
    dsStyle = {
      fontSize: pxToNumber(designSystem.typography.fontSizes.xl),
      fontWeight: getFontWeight(designSystem.typography.fontWeights.bold),
      lineHeight: pxToNumber(designSystem.typography.fontSizes.xl) * designSystem.typography.lineHeights.tight,
      color: designSystem.colorPalette.neutral.black,
    };
  } else if (type === 'subtitle') {
    dsStyle = {
      fontSize: pxToNumber(designSystem.typography.fontSizes.lg),
      fontWeight: getFontWeight(designSystem.typography.fontWeights.semibold),
      lineHeight: pxToNumber(designSystem.typography.fontSizes.lg) * designSystem.typography.lineHeights.normal,
      color: designSystem.colorPalette.neutral.darkGray,
    };
  } else {
    dsStyle = {
      fontSize: pxToNumber(designSystem.typography.fontSizes.base),
      fontWeight: getFontWeight(designSystem.typography.fontWeights.normal),
      lineHeight: pxToNumber(designSystem.typography.fontSizes.base) * designSystem.typography.lineHeights.normal,
      color: designSystem.colorPalette.neutral.darkGray,
    };
  }

  return (
    <Text
      style={[
        { color },
        dsStyle,
        style,
      ]}
      {...rest}
    />
  );
}
