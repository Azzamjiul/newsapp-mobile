import { pxToNumber } from '@/constants/parseDesignToken';
import designSystem from '@/constants/ui-design-system';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  text, 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Continuous spin animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Pulse animation for dots
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSpinnerSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 48;
      default: return 32;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return designSystem.typography.fontSizes.sm;
      case 'large': return designSystem.typography.fontSizes.lg;
      default: return designSystem.typography.fontSizes.base;
    }
  };

  const spinnerSize = getSpinnerSize();
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.inlineContainer;

  return (
    <Animated.View style={[containerStyle, { opacity: fadeValue }]}>
      <View style={styles.spinnerContainer}>
        <Animated.View
          style={[
            styles.spinner,
            {
              width: spinnerSize,
              height: spinnerSize,
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={[styles.spinnerRing, { 
            width: spinnerSize, 
            height: spinnerSize,
            borderWidth: Math.max(2, spinnerSize / 16)
          }]} />
        </Animated.View>
        
        {text && (
          <View style={styles.textContainer}>
            <ThemedText style={[styles.loadingText, { fontSize: pxToNumber(getTextSize()) }]}>
              {text}
            </ThemedText>
            <Animated.View style={[styles.dotsContainer, { opacity: pulseValue }]}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </Animated.View>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designSystem.colorPalette.background.primary,
  },
  inlineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: pxToNumber(designSystem.layout.structure.gaps.medium),
  },
  spinnerContainer: {
    alignItems: 'center',
    gap: pxToNumber(designSystem.layout.structure.gaps.medium),
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerRing: {
    borderRadius: 50,
    borderColor: designSystem.colorPalette.primary.blue,
    borderTopColor: 'transparent',
  },
  textContainer: {
    alignItems: 'center',
    gap: pxToNumber(designSystem.layout.structure.gaps.small),
  },
  loadingText: {
    color: designSystem.colorPalette.neutral.darkGray,
    fontWeight: '500',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: designSystem.colorPalette.primary.blue,
  },
});
