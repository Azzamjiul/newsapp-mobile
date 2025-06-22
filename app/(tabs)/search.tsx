import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import LoadingSpinner from '@/components/LoadingSpinner';
import PageTransition from '@/components/PageTransition';
import { getFontWeight, pxToNumber } from '@/constants/parseDesignToken';
import designSystem from '@/constants/ui-design-system';

const API_URL = 'https://news-api.alat.cc/api/news';

type News = {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
};

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // Fetch search results with optional cursor
  const fetchResults = async (searchQuery: string, cursorParam?: number, append = false) => {
    if (!searchQuery.trim()) return;
    if (loading || loadingMore) return;
    if (!append) setLoading(true);
    else setLoadingMore(true);
    try {
      const url = `${API_URL}?q=${encodeURIComponent(searchQuery)}${cursorParam ? `&cursor=${cursorParam}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      // Assume API returns { items: News[], nextCursor: number | null }
      const items = data.items || data; // fallback for old API
      const nextCursor = data.nextCursor ?? null;
      setResults(prev => append ? [...prev, ...items] : items);
      setCursor(nextCursor);
      setHasMore(!!nextCursor && items.length > 0);
    } catch {
      // Handle error
    } finally {
      if (!append) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const handleSearch = () => {
    setCursor(null);
    setHasMore(true);
    fetchResults(query);
  };

  const loadMore = () => {
    if (!hasMore || loadingMore || loading) return;
    fetchResults(query, cursor ?? undefined, true);
  };

  return (
    <PageTransition>
      <View style={{ flex: 1, backgroundColor: designSystem.colorPalette.background.primary }}>
        <TextInput
          style={{
            margin: pxToNumber(designSystem.layout.structure.gaps.medium),
            padding: pxToNumber(designSystem.components.newsCard.padding),
            borderWidth: 1,
            borderColor: designSystem.colorPalette.neutral.mediumGray,
            borderRadius: pxToNumber(designSystem.components.newsCard.structure.media.borderRadius),
            fontSize: pxToNumber(designSystem.typography.fontSizes.base),
            backgroundColor: designSystem.colorPalette.background.accent,
          }}
          placeholder="Search news..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {loading && !loadingMore ? (
          <LoadingSpinner size="large" text="Searching news" />
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={{
                flexDirection: 'row',
                marginBottom: pxToNumber(designSystem.components.newsCard.marginBottom),
                backgroundColor: designSystem.components.newsCard.backgroundColor,
                borderRadius: pxToNumber(designSystem.components.newsCard.borderRadius),
                overflow: 'hidden',
                elevation: 2,
                padding: pxToNumber(designSystem.components.newsCard.padding),
              }} onPress={() => router.push({ pathname: '/[id]', params: { id: item.id.toString() } })}>
                <Image source={{ uri: item.imageUrl }} style={{
                  width: pxToNumber(designSystem.components.newsCard.structure.media.width),
                  height: pxToNumber(designSystem.components.newsCard.structure.media.height),
                  borderRadius: pxToNumber(designSystem.components.newsCard.structure.media.borderRadius),
                  marginRight: pxToNumber(designSystem.layout.structure.gaps.medium),
                  resizeMode: 'cover',
                }} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={{
                    fontWeight: getFontWeight(designSystem.components.newsCard.structure.content.title.fontWeight),
                    fontSize: pxToNumber(designSystem.components.newsCard.structure.content.title.fontSize),
                    lineHeight: pxToNumber(designSystem.components.newsCard.structure.content.title.fontSize) * designSystem.typography.lineHeights.tight,
                    color: designSystem.components.newsCard.structure.content.title.color,
                    marginBottom: pxToNumber(designSystem.components.newsCard.structure.content.title.marginBottom),
                  }} numberOfLines={designSystem.components.newsCard.structure.content.title.maxLines}>{item.title}</Text>
                  <Text style={{
                    color: designSystem.components.newsCard.structure.content.metadata.color,
                    fontSize: pxToNumber(designSystem.components.newsCard.structure.content.metadata.fontSize),
                    fontWeight: getFontWeight(designSystem.components.newsCard.structure.content.metadata.fontWeight),
                  }} numberOfLines={designSystem.patterns.textTruncation.descriptions.maxLines}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ padding: pxToNumber(designSystem.layout.structure.padding) }}
            ListEmptyComponent={
              results.length === 0 && query ? (
                <Text style={{ textAlign: 'center', color: designSystem.colorPalette.neutral.mediumGray, marginTop: 32 }}>No results found.</Text>
              ) : null
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? <LoadingSpinner size="small" text="Loading more..." /> : null}
          />
        )}
      </View>
    </PageTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: '#555',
  },
});
