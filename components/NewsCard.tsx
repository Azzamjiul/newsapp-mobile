import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageStyle, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

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

  const handlePress = () => {
    router.push({ pathname: '/news/[id]', params: { id: news.id.toString() } });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
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
  } as TextStyle,
  metadata: {
    color: designSystem.components.newsCard.structure.content.metadata.color,
    fontSize: pxToNumber(designSystem.components.newsCard.structure.content.metadata.fontSize),
    fontWeight: getFontWeight(designSystem.components.newsCard.structure.content.metadata.fontWeight),
  } as TextStyle,
  image: {
    width: pxToNumber(designSystem.components.newsCard.structure.media.width),
    height: pxToNumber(designSystem.components.newsCard.structure.media.height),
    borderRadius: pxToNumber(designSystem.components.newsCard.structure.media.borderRadius),
    resizeMode: 'cover',
  } as ImageStyle,
});
