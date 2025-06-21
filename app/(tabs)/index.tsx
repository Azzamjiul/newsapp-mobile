import { Stack } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, View, ViewStyle } from 'react-native';

import NewsCard from '@/components/NewsCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { pxToNumber } from '@/constants/parseDesignToken';
import designSystem from '@/constants/ui-design-system';
import { useNewsList } from '@/hooks/useNewsList';

export default function HomeScreen() {
  const { news, loading, loadingMore, error, hasMore, loadMore } = useNewsList();

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="large" color={designSystem.colorPalette.primary.red} />
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={designSystem.colorPalette.primary.red} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>
          {error}
        </ThemedText>
      </ThemedView>
    );
  }

  if (!loading && news.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.emptyText}>
          No news found. Check your backend API and network connection.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Recent News' }} />
      <ThemedView style={styles.container}>
        <FlatList
          data={news}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <NewsCard news={item} />}
          contentContainerStyle={styles.contentContainer}
          style={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designSystem.patterns.contentFeed.backgroundColor,
  } as ViewStyle,
  list: {
    flex: 1,
  } as ViewStyle,
  contentContainer: {
    padding: pxToNumber(designSystem.layout.structure.padding),
  } as ViewStyle,
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pxToNumber(designSystem.layout.structure.padding),
  } as ViewStyle,
  errorText: {
    fontSize: pxToNumber(designSystem.typography.fontSizes.lg),
    color: designSystem.colorPalette.primary.red,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: pxToNumber(designSystem.typography.fontSizes.lg),
    color: designSystem.colorPalette.neutral.mediumGray,
    textAlign: 'center',
  },
  loadingFooter: {
    padding: pxToNumber(designSystem.layout.structure.gaps.large),
    alignItems: 'center',
  } as ViewStyle,
});
