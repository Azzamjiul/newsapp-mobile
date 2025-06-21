import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import RenderHtml from 'react-native-render-html';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getFontWeight, pxToNumber } from '@/constants/parseDesignToken';
import designSystem from '@/constants/ui-design-system';
import { useNewsDetail } from '@/hooks/useNewsDetail';
import { formatArticleDate } from '@/utils/dateUtils';

export default function NewsDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { news, loading, error } = useNewsDetail(id);
  const { width } = useWindowDimensions();

  const handleShare = async () => {
    if (!news) return;
    
    try {
      await Share.share({
        message: `${news.title}\n\n${news.description}`,
        url: news.publisherUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOpenPublisher = () => {
    if (news?.publisherUrl) {
      Linking.openURL(news.publisherUrl);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={designSystem.colorPalette.primary.red} />
      </ThemedView>
    );
  }

  if (error || !news) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>
          {error || 'News not found'}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <ThemedText style={styles.retryButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const contentWidth = width > 640 ? 600 : width - 2 * pxToNumber(designSystem.articleDetailPage.layout.padding.split(' ')[1]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Header */}
        <Text style={styles.title}>{news.title}</Text>
        
        <View style={styles.metadataContainer}>
          <Text style={styles.author}>By Publisher</Text>
          <Text style={styles.timestamp}>{formatArticleDate(news.createdAt)}</Text>
        </View>

        {/* Hero Image */}
        <Image 
          source={{ uri: news.imageUrl }} 
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Article Content */}
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: news.content }}
          baseStyle={styles.articleContent}
        />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={designSystem.articleDetailPage.bottomActions.shareButton.color} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.webButton} onPress={handleOpenPublisher}>
          <Text style={styles.webButtonText}>Read at Publisher</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designSystem.articleDetailPage.layout.backgroundColor,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: pxToNumber(designSystem.articleDetailPage.layout.padding.split(' ')[1]),
    paddingBottom: 100, // Space for bottom actions
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pxToNumber(designSystem.layout.structure.padding),
  },
  errorText: {
    fontSize: pxToNumber(designSystem.typography.fontSizes.lg),
    color: designSystem.colorPalette.primary.red,
    textAlign: 'center',
    marginBottom: pxToNumber(designSystem.layout.structure.gaps.large),
  },
  retryButton: {
    backgroundColor: designSystem.colorPalette.primary.blue,
    paddingHorizontal: pxToNumber(designSystem.layout.structure.gaps.large),
    paddingVertical: pxToNumber(designSystem.layout.structure.gaps.medium),
    borderRadius: 8,
  },
  retryButtonText: {
    color: designSystem.colorPalette.neutral.white,
    fontSize: pxToNumber(designSystem.typography.fontSizes.base),
    fontWeight: getFontWeight(designSystem.typography.fontWeights.medium),
  },
  title: {
    fontSize: pxToNumber(designSystem.articleDetailPage.articleHeader.title.fontSize),
    fontWeight: getFontWeight(designSystem.articleDetailPage.articleHeader.title.fontWeight),
    color: designSystem.articleDetailPage.articleHeader.title.color,
    lineHeight: pxToNumber(designSystem.articleDetailPage.articleHeader.title.fontSize) * 1.3,
    marginBottom: pxToNumber(designSystem.articleDetailPage.articleHeader.title.marginBottom),
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pxToNumber(designSystem.articleDetailPage.articleHeader.metadata.marginBottom),
  },
  author: {
    fontSize: pxToNumber(designSystem.articleDetailPage.articleHeader.metadata.author.fontSize),
    fontWeight: getFontWeight(designSystem.articleDetailPage.articleHeader.metadata.author.fontWeight),
    color: designSystem.articleDetailPage.articleHeader.metadata.author.color,
  },
  timestamp: {
    fontSize: pxToNumber(designSystem.articleDetailPage.articleHeader.metadata.timestamp.fontSize),
    color: designSystem.articleDetailPage.articleHeader.metadata.timestamp.color,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: pxToNumber(designSystem.articleDetailPage.heroImage.borderRadius),
    marginBottom: pxToNumber(designSystem.articleDetailPage.heroImage.marginBottom),
  },
  articleContent: {
    fontSize: pxToNumber(designSystem.articleDetailPage.articleContent.typography.fontSize),
    lineHeight: pxToNumber(designSystem.articleDetailPage.articleContent.typography.fontSize) * 1.6,
    color: designSystem.articleDetailPage.articleContent.typography.color,
    fontWeight: getFontWeight(designSystem.articleDetailPage.articleContent.typography.fontWeight),
  },
  bottomActions: {
    position: 'absolute',
    bottom: pxToNumber(designSystem.articleDetailPage.bottomActions.bottom),
    left: pxToNumber(designSystem.articleDetailPage.bottomActions.left),
    right: pxToNumber(designSystem.articleDetailPage.bottomActions.right),
    flexDirection: 'row',
    gap: pxToNumber(designSystem.articleDetailPage.bottomActions.gap),
  },
  shareButton: {
    backgroundColor: designSystem.articleDetailPage.bottomActions.shareButton.backgroundColor,
    borderWidth: 1,
    borderColor: designSystem.articleDetailPage.bottomActions.shareButton.border.split(' ')[2], // Extract color from border string
    borderRadius: pxToNumber(designSystem.articleDetailPage.bottomActions.shareButton.borderRadius),
    padding: pxToNumber(designSystem.articleDetailPage.bottomActions.shareButton.padding.split(' ')[0]),
    paddingHorizontal: pxToNumber(designSystem.articleDetailPage.bottomActions.shareButton.padding.split(' ')[1]),
    flexDirection: 'row',
    alignItems: 'center',
    gap: pxToNumber(designSystem.articleDetailPage.bottomActions.shareButton.gap),
  },
  shareButtonText: {
    fontSize: pxToNumber(designSystem.articleDetailPage.bottomActions.shareButton.fontSize),
    fontWeight: getFontWeight(designSystem.articleDetailPage.bottomActions.shareButton.fontWeight),
    color: designSystem.articleDetailPage.bottomActions.shareButton.color,
  },
  webButton: {
    backgroundColor: designSystem.articleDetailPage.bottomActions.webButton.backgroundColor,
    borderRadius: pxToNumber(designSystem.articleDetailPage.bottomActions.webButton.borderRadius),
    padding: pxToNumber(designSystem.articleDetailPage.bottomActions.webButton.padding.split(' ')[0]),
    paddingHorizontal: pxToNumber(designSystem.articleDetailPage.bottomActions.webButton.padding.split(' ')[1]),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webButtonText: {
    fontSize: pxToNumber(designSystem.articleDetailPage.bottomActions.webButton.fontSize),
    fontWeight: getFontWeight(designSystem.articleDetailPage.bottomActions.webButton.fontWeight),
    color: designSystem.articleDetailPage.bottomActions.webButton.color,
    textAlign: 'center',
  },
});
