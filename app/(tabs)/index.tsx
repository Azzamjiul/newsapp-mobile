import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!loading && news.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ fontSize: 18, color: '#888', textAlign: 'center' }}>
          No news found. Check your backend API and network connection.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={news}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/news/[id]', params: { id: item.id.toString() } })}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <View style={{ height: 60 }} /> : null}
      />
      {loadingMore && !loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
});
