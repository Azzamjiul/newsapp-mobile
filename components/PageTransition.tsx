import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface PageTransitionProps {
  children: React.ReactNode;
  duration?: number;
}

export default function PageTransition({ children, duration = 300 }: PageTransitionProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, duration]);

  return (
    <Animated.View 
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
}
