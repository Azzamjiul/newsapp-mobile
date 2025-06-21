import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, Linking, ScrollView, StyleSheet, Text } from 'react-native';

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
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!news) {
    return <Text style={{ flex: 1, textAlign: 'center', marginTop: 40 }}>News not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: news.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.date}>{new Date(news.createdAt).toLocaleString()}</Text>
      <Text style={styles.content}>{news.content}</Text>
      <Button title="Read at Publisher" onPress={() => Linking.openURL(news.publisherUrl)} />
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
