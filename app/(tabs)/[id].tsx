import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
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

import LoadingSpinner from '@/components/LoadingSpinner';
import PageTransition from '@/components/PageTransition';
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
      <>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ThemedView style={styles.centered}>
          <LoadingSpinner size="large" text="Loading article" fullScreen />
        </ThemedView>
      </>
    );
  }

  if (error || !news) {
    return (
      <>
        <Stack.Screen options={{ title: 'News Article' }} />
        <ThemedView style={styles.centered}>
          <ThemedText style={styles.errorText}>
            {error || 'News not found'}
          </ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <ThemedText style={styles.retryButtonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </>
    );
  }

  const contentWidth = width > 640 ? 600 : width - 2 * pxToNumber(designSystem.layout.structure.padding);

  return (
    <>
      <Stack.Screen options={{ title: news.title }} />
      <PageTransition>
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
            tagsStyles={{
              p: {
                fontSize: pxToNumber(designSystem.typography.fontSizes.lg),
                lineHeight: pxToNumber(designSystem.typography.fontSizes.lg) * designSystem.typography.lineHeights.relaxed,
                color: designSystem.colorPalette.neutral.darkGray,
                fontFamily: designSystem.typography.fontFamily.primary,
                textAlign: 'justify',
                marginBottom: pxToNumber(designSystem.layout.structure.gaps.medium),
              },
              h1: {
                fontSize: pxToNumber(designSystem.typography.fontSizes['2xl']),
                fontWeight: getFontWeight(designSystem.typography.fontWeights.bold),
                color: designSystem.colorPalette.neutral.black,
                marginVertical: pxToNumber(designSystem.layout.structure.gaps.medium),
                fontFamily: designSystem.typography.fontFamily.primary,
              },
              h2: {
                fontSize: pxToNumber(designSystem.typography.fontSizes.xl),
                fontWeight: getFontWeight(designSystem.typography.fontWeights.semibold),
                color: designSystem.colorPalette.neutral.black,
                marginVertical: pxToNumber(designSystem.layout.structure.gaps.medium),
                fontFamily: designSystem.typography.fontFamily.primary,
              },
              h3: {
                fontSize: pxToNumber(designSystem.typography.fontSizes.lg),
                fontWeight: getFontWeight(designSystem.typography.fontWeights.semibold),
                color: designSystem.colorPalette.neutral.darkGray,
                marginVertical: pxToNumber(designSystem.layout.structure.gaps.small),
                fontFamily: designSystem.typography.fontFamily.primary,
              },
              a: {
                color: designSystem.colorPalette.primary.blue,
                textDecorationLine: 'underline',
              },
              blockquote: {
                borderLeftWidth: 4,
                borderLeftColor: designSystem.colorPalette.primary.blue,
                paddingLeft: pxToNumber(designSystem.layout.structure.gaps.medium),
                marginVertical: pxToNumber(designSystem.layout.structure.gaps.medium),
                fontStyle: 'italic',
                backgroundColor: designSystem.colorPalette.background.accent,
                padding: pxToNumber(designSystem.layout.structure.gaps.medium),
                borderRadius: 8,
              },
              li: {
                marginBottom: pxToNumber(designSystem.layout.structure.gaps.small),
                fontSize: pxToNumber(designSystem.typography.fontSizes.lg),
                lineHeight: pxToNumber(designSystem.typography.fontSizes.lg) * designSystem.typography.lineHeights.relaxed,
                color: designSystem.colorPalette.neutral.darkGray,
              },
              strong: {
                fontWeight: getFontWeight(designSystem.typography.fontWeights.bold),
              },
              em: {
                fontStyle: 'italic',
              },
            }}
          />
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={designSystem.colorPalette.primary.blue} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.webButton} onPress={handleOpenPublisher}>
            <Text style={styles.webButtonText}>Read at Publisher</Text>
          </TouchableOpacity>
        </View>
        </ThemedView>
      </PageTransition>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designSystem.colorPalette.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: pxToNumber(designSystem.layout.structure.padding),
    paddingBottom: 120, // Space for bottom actions
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
    fontFamily: designSystem.typography.fontFamily.primary,
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
    fontSize: pxToNumber(designSystem.typography.fontSizes['2xl']),
    fontWeight: getFontWeight(designSystem.typography.fontWeights.bold),
    color: designSystem.colorPalette.neutral.black,
    lineHeight: pxToNumber(designSystem.typography.fontSizes['2xl']) * 1.2,
    marginBottom: pxToNumber(designSystem.layout.structure.gaps.medium),
    fontFamily: designSystem.typography.fontFamily.primary,
    textAlign: 'left',
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pxToNumber(designSystem.layout.structure.gaps.large),
    paddingVertical: pxToNumber(designSystem.layout.structure.gaps.small),
    borderBottomWidth: 1,
    borderBottomColor: designSystem.colorPalette.background.accent,
  },
  author: {
    fontSize: pxToNumber(designSystem.typography.fontSizes.sm),
    fontWeight: getFontWeight(designSystem.typography.fontWeights.semibold),
    color: designSystem.colorPalette.primary.blue,
    fontFamily: designSystem.typography.fontFamily.primary,
  },
  timestamp: {
    fontSize: pxToNumber(designSystem.typography.fontSizes.sm),
    color: designSystem.colorPalette.neutral.mediumGray,
    fontFamily: designSystem.typography.fontFamily.primary,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 12,
    marginBottom: pxToNumber(designSystem.layout.structure.gaps.large),
    backgroundColor: designSystem.colorPalette.background.accent,
  },
  articleContent: {
    fontSize: pxToNumber(designSystem.typography.fontSizes.lg),
    lineHeight: pxToNumber(designSystem.typography.fontSizes.lg) * designSystem.typography.lineHeights.relaxed,
    color: designSystem.colorPalette.neutral.darkGray,
    fontWeight: getFontWeight(designSystem.typography.fontWeights.normal),
    fontFamily: designSystem.typography.fontFamily.primary,
    textAlign: 'justify',
    marginBottom: pxToNumber(designSystem.layout.structure.gaps.large),
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: pxToNumber(designSystem.layout.structure.gaps.medium),
    padding: pxToNumber(designSystem.layout.structure.padding),
    backgroundColor: designSystem.colorPalette.background.primary,
    borderTopWidth: 1,
    borderTopColor: designSystem.colorPalette.background.accent,
    paddingBottom: 34, // Safe area for iOS
  },
  shareButton: {
    backgroundColor: designSystem.colorPalette.background.primary,
    borderWidth: 1,
    borderColor: designSystem.colorPalette.primary.blue,
    borderRadius: 12,
    paddingVertical: pxToNumber(designSystem.layout.structure.gaps.medium),
    paddingHorizontal: pxToNumber(designSystem.layout.structure.gaps.large),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: pxToNumber(designSystem.layout.structure.gaps.small),
  },
  shareButtonText: {
    fontSize: pxToNumber(designSystem.typography.fontSizes.base),
    fontWeight: getFontWeight(designSystem.typography.fontWeights.semibold),
    color: designSystem.colorPalette.primary.blue,
    fontFamily: designSystem.typography.fontFamily.primary,
  },
  webButton: {
    backgroundColor: designSystem.colorPalette.primary.blue,
    borderRadius: 12,
    paddingVertical: pxToNumber(designSystem.layout.structure.gaps.medium),
    paddingHorizontal: pxToNumber(designSystem.layout.structure.gaps.large),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webButtonText: {
    fontSize: pxToNumber(designSystem.typography.fontSizes.base),
    fontWeight: getFontWeight(designSystem.typography.fontWeights.semibold),
    color: designSystem.colorPalette.neutral.white,
    textAlign: 'center',
    fontFamily: designSystem.typography.fontFamily.primary,
  },
});
