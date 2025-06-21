import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, Linking, ScrollView, StyleSheet, Text } from 'react-native';

import { getFontWeight, pxToNumber } from '@/constants/parseDesignToken';
import designSystem from '@/constants/ui-design-system';

const API_URL = 'http://localhost:4000/api/news/';

type News = {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  content: string;
  publisherId: number;
  publisherUrl: string;
  createdAt: string;
  importedAt: string;
};

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(API_URL + id)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={designSystem.colorPalette.primary.red} />;
  }

  if (!news) {
    return <Text style={{ flex: 1, textAlign: 'center', marginTop: 40, color: designSystem.colorPalette.neutral.mediumGray }}>News not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{
      padding: pxToNumber(designSystem.layout.structure.padding),
      backgroundColor: designSystem.colorPalette.background.primary,
    }}>
      <Image source={{ uri: news.imageUrl }} style={{
        width: '100%',
        height: pxToNumber(designSystem.components.newsCard.structure.media.height) * 2.5,
        borderRadius: pxToNumber(designSystem.components.newsCard.structure.media.borderRadius),
        marginBottom: pxToNumber(designSystem.components.newsCard.structure.content.title.marginBottom),
        resizeMode: 'cover',
      }} />
      <Text style={{
        fontWeight: getFontWeight(designSystem.components.newsCard.structure.content.title.fontWeight),
        fontSize: pxToNumber(designSystem.components.newsCard.structure.content.title.fontSize),
        lineHeight: pxToNumber(designSystem.components.newsCard.structure.content.title.fontSize) * designSystem.typography.lineHeights.tight,
        color: designSystem.components.newsCard.structure.content.title.color,
        marginBottom: pxToNumber(designSystem.components.newsCard.structure.content.title.marginBottom),
      }}>{news.title}</Text>
      <Text style={{
        color: designSystem.components.newsCard.structure.content.metadata.color,
        fontSize: pxToNumber(designSystem.components.newsCard.structure.content.metadata.fontSize),
        fontWeight: getFontWeight(designSystem.components.newsCard.structure.content.metadata.fontWeight),
        marginBottom: pxToNumber(designSystem.layout.structure.gaps.small),
      }}>{new Date(news.createdAt).toLocaleString()}</Text>
      <Text style={{
        fontSize: pxToNumber(designSystem.typography.fontSizes.base),
        color: designSystem.colorPalette.neutral.darkGray,
        marginBottom: pxToNumber(designSystem.layout.structure.gaps.large),
      }}>{news.content}</Text>
      <Button title="Read at Publisher" color={designSystem.colorPalette.primary.blue} onPress={() => Linking.openURL(news.publisherUrl)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
  },
  date: {
    color: '#888',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
});
