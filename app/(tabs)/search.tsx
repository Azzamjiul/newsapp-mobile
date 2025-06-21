import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { getFontWeight, pxToNumber } from '@/constants/parseDesignToken';
import designSystem from '@/constants/ui-design-system';

const API_URL = 'http://localhost:4000/api/news';

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
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    fetch(`${API_URL}?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
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
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color={designSystem.colorPalette.primary.red} />
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
            }} onPress={() => router.push({ pathname: '/news/[id]', params: { id: item.id.toString() } })}>
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
        />
      )}
    </View>
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
