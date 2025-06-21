import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageStyle, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getFontWeight, pxToNumber } from '@/constants/parseDesignToken';
import designSystem from '@/constants/ui-design-system';

const API_URL = 'http://localhost:4000/api/news';

type News = {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
};

export default function HomeScreen() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // Fetch news with optional cursor
  const fetchNews = useCallback(async (cursorParam: number | null = null) => {
    const url = cursorParam ? `${API_URL}?cursor=${cursorParam}` : API_URL;
    const res = await fetch(url);
    const data: News[] = await res.json();
    return data;
  }, []);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchNews()
      .then(data => {
        setNews(data);
        if (data.length > 0) {
          setCursor(data[data.length - 1].id);
        }
        setHasMore(data.length > 0);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error fetching news:', err);
        setLoading(false);
      });
  }, [fetchNews]);

  // Load more news when reaching end
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchNews(cursor);
      if (data.length > 0) {
        setNews(prev => [...prev, ...data]);
        setCursor(data[data.length - 1].id);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log('Error loading more news:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={designSystem.colorPalette.primary.red} />;
  }

  if (!loading && news.length === 0) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: pxToNumber(designSystem.layout.structure.padding) }}>
        <ThemedText style={{ fontSize: pxToNumber(designSystem.typography.fontSizes.lg), color: designSystem.colorPalette.neutral.mediumGray, textAlign: 'center' }}>
          No news found. Check your backend API and network connection.
        </ThemedText>
      </ThemedView>
    );
  }

  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      marginBottom: pxToNumber(designSystem.components.newsCard.marginBottom),
      backgroundColor: designSystem.components.newsCard.backgroundColor,
      borderRadius: pxToNumber(designSystem.components.newsCard.borderRadius),
      overflow: 'hidden',
      elevation: 2,
      padding: pxToNumber(designSystem.components.newsCard.padding),
    } as ViewStyle,
    image: {
      width: pxToNumber(designSystem.components.newsCard.structure.media.width),
      height: pxToNumber(designSystem.components.newsCard.structure.media.height),
      borderRadius: pxToNumber(designSystem.components.newsCard.structure.media.borderRadius),
      marginRight: pxToNumber(designSystem.layout.structure.gaps.medium),
      resizeMode: 'cover',
    } as ImageStyle,
    info: {
      flex: 1,
      justifyContent: 'center',
    } as ViewStyle,
    title: {
      fontWeight: getFontWeight(designSystem.components.newsCard.structure.content.title.fontWeight),
      fontSize: pxToNumber(designSystem.components.newsCard.structure.content.title.fontSize),
      lineHeight: pxToNumber(designSystem.components.newsCard.structure.content.title.fontSize) * designSystem.typography.lineHeights.tight,
      color: designSystem.components.newsCard.structure.content.title.color,
      marginBottom: pxToNumber(designSystem.components.newsCard.structure.content.title.marginBottom),
    } as TextStyle,
    description: {
      color: designSystem.components.newsCard.structure.content.metadata.color,
      fontSize: pxToNumber(designSystem.components.newsCard.structure.content.metadata.fontSize),
      fontWeight: getFontWeight(designSystem.components.newsCard.structure.content.metadata.fontWeight),
    } as TextStyle,
    loadingOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      backgroundColor: 'rgba(255,255,255,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    } as ViewStyle,
  });

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={news}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/news/[id]', params: { id: item.id.toString() } })}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.info}>
              <ThemedText style={styles.title} numberOfLines={designSystem.components.newsCard.structure.content.title.maxLines}>{item.title}</ThemedText>
              <ThemedText style={styles.description} numberOfLines={designSystem.patterns.textTruncation.descriptions.maxLines}>{item.description}</ThemedText>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: pxToNumber(designSystem.layout.structure.padding) }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <View style={{ height: 60 }} /> : null}
      />
      {loadingMore && !loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color={designSystem.colorPalette.primary.red} />
        </View>
      )}
    </ThemedView>
  );
}
