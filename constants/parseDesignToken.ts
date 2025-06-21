// parseDesignToken.ts
// Utility to convert px values to numbers and extract design tokens

export function pxToNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.endsWith('px')) {
    return parseFloat(value);
  }
  return Number(value) || 0;
}

export function getFontWeight(weight: string | number): any {
  if (typeof weight === 'number') return weight.toString();
  if (typeof weight === 'string') {
    if (!isNaN(Number(weight))) return weight;
    // map semantic names to numbers if needed
    const map: Record<string, string> = {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    };
    return map[weight] || weight;
  }
  return '400';
}
