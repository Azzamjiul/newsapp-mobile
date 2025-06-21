import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ImageStyle,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { getFontWeight, pxToNumber } from '@/constants/parseDesignToken';
import designSystem from '@/constants/ui-design-system';
import { News } from '@/types/api';
import { formatNewsDate } from '@/utils/dateUtils';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  const router = useRouter();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    router.push({ pathname: '/[id]', params: { id: news.id.toString() } });
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View 
        style={[
          styles.card,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          }
        ]}
      >
        <View style={styles.content}>
          <ThemedText 
            style={styles.title} 
            numberOfLines={designSystem.components.newsCard.structure.content.title.maxLines}
          >
            {news.title}
          </ThemedText>
          <ThemedText style={styles.metadata}>
            Publisher • {formatNewsDate(news.createdAt)}
          </ThemedText>
        </View>
        <Image source={{ uri: news.imageUrl }} style={styles.image} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: designSystem.components.newsCard.backgroundColor,
    borderRadius: pxToNumber(designSystem.components.newsCard.borderRadius),
    padding: pxToNumber(designSystem.components.newsCard.padding),
    marginBottom: pxToNumber(designSystem.components.newsCard.marginBottom),
    boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
    elevation: 2,
  } as ViewStyle,
  content: {
    flex: 1,
    justifyContent: 'center',
    marginRight: pxToNumber(designSystem.layout.structure.gaps.medium),
  } as ViewStyle,
  title: {
    fontWeight: getFontWeight(designSystem.components.newsCard.structure.content.title.fontWeight),
    fontSize: pxToNumber(designSystem.components.newsCard.structure.content.title.fontSize),
    lineHeight: pxToNumber(designSystem.components.newsCard.structure.content.title.fontSize) * designSystem.typography.lineHeights.tight,
    color: designSystem.components.newsCard.structure.content.title.color,
    marginBottom: pxToNumber(designSystem.components.newsCard.structure.content.title.marginBottom),
    fontFamily: designSystem.typography.fontFamily.primary,
  } as TextStyle,
  metadata: {
    color: designSystem.components.newsCard.structure.content.metadata.color,
    fontSize: pxToNumber(designSystem.components.newsCard.structure.content.metadata.fontSize),
    fontWeight: getFontWeight(designSystem.components.newsCard.structure.content.metadata.fontWeight),
    fontFamily: designSystem.typography.fontFamily.primary,
  } as TextStyle,
  image: {
    width: pxToNumber(designSystem.components.newsCard.structure.media.width),
    height: pxToNumber(designSystem.components.newsCard.structure.media.height),
    borderRadius: pxToNumber(designSystem.components.newsCard.structure.media.borderRadius),
    resizeMode: 'cover',
    backgroundColor: designSystem.colorPalette.background.accent,
  } as ImageStyle,
});
