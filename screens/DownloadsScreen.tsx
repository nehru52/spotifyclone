import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import { downloadManager, DownloadedTour, DownloadProgress } from '../src/services/downloadManager';
import { useRouter } from 'expo-router';
import { useLanguage } from '@context';

// Vatican Places - Same as home screen
const VATICAN_PLACES = [
  {
    id: 'colosseum',
    title: 'Colosseum',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
  },
  {
    id: 'forum',
    title: 'Roman Forum',
    image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=600&q=80',
  },
  {
    id: 'heart',
    title: 'Heart of Rome',
    image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80',
  },
  {
    id: 'jewish-ghetto',
    title: 'Jewish Ghetto',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
  },
  {
    id: 'ostia-antica',
    title: 'Ostia Antica',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80',
  },
  {
    id: 'pantheon',
    title: 'Pantheon',
    image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=600&q=80',
  },
  {
    id: 'sistine-chapel',
    title: 'Sistine Chapel',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
  },
  {
    id: 'st-peters-basilica',
    title: "St. Peter's Basilica",
    image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&q=80',
  },
  {
    id: 'trastevere',
    title: 'Trastevere',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
  },
  {
    id: 'vatican-museums',
    title: 'Vatican Museums',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
  },
  {
    id: 'vatican-pinacoteca',
    title: 'Vatican Pinacoteca',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
  },
];

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export const DownloadsScreen = () => {
  const { translations } = useLanguage();
  const [downloadedTours, setDownloadedTours] = React.useState<DownloadedTour[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalStorage, setTotalStorage] = React.useState(0);
  const [downloadProgress, setDownloadProgress] = React.useState<Map<string, number>>(new Map());
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');
  const router = useRouter();

  React.useEffect(() => {
    loadDownloadedTours();
  }, []);

  const loadDownloadedTours = async () => {
    try {
      setLoading(true);
      const tours = await downloadManager.getDownloadedTours();
      const storage = await downloadManager.getTotalStorageUsed();
      setDownloadedTours(tours);
      setTotalStorage(storage);
    } catch (error) {
      console.error('[DownloadsScreen] Error loading tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleDownloadTour = async (place: typeof VATICAN_PLACES[0]) => {
    const downloadKey = `${place.id}_${selectedLanguage}`;
    
    try {
      // Check if already downloaded
      const isDownloaded = await downloadManager.isDownloaded(place.id, selectedLanguage);
      if (isDownloaded) {
        Alert.alert(translations.downloads.alreadyDownloaded, `${place.title} (${selectedLanguage}) ${translations.downloads.alreadyDownloadedMsg}`);
        return;
      }

      // Check if already downloading
      if (downloadManager.isDownloading(place.id, selectedLanguage)) {
        Alert.alert(translations.downloads.downloadInProgress, translations.downloads.downloadInProgressMsg);
        return;
      }

      // Start download
      const success = await downloadManager.downloadTour(
        place.id,
        place.title,
        selectedLanguage,
        place.image,
        (progress: DownloadProgress) => {
          setDownloadProgress(prev => {
            const newMap = new Map(prev);
            newMap.set(downloadKey, progress.progress);
            return newMap;
          });
        }
      );

      if (success) {
        Alert.alert(translations.downloads.downloadComplete, `${place.title} ${translations.downloads.downloadCompleteMsg}`);
        await loadDownloadedTours();
        setDownloadProgress(prev => {
          const newMap = new Map(prev);
          newMap.delete(downloadKey);
          return newMap;
        });
      } else {
        Alert.alert(translations.downloads.downloadFailed, translations.downloads.downloadFailedMsg);
        setDownloadProgress(prev => {
          const newMap = new Map(prev);
          newMap.delete(downloadKey);
          return newMap;
        });
      }
    } catch (error) {
      console.error('[DownloadsScreen] Download error:', error);
      Alert.alert(translations.downloads.downloadError, translations.home.downloadErrorMsg);
      setDownloadProgress(prev => {
        const newMap = new Map(prev);
        newMap.delete(downloadKey);
        return newMap;
      });
    }
  };

  const handleDeleteTour = async (tour: DownloadedTour) => {
    Alert.alert(
      translations.downloads.deleteDownload,
      `${translations.downloads.deleteDownloadMsg.replace('?', '')} ${tour.title} (${tour.language})?`,
      [
        { text: translations.downloads.cancel, style: 'cancel' },
        {
          text: translations.downloads.delete,
          style: 'destructive',
          onPress: async () => {
            const success = await downloadManager.deleteTour(tour.id, tour.language);
            if (success) {
              await loadDownloadedTours();
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      translations.downloads.deleteAllDownloads,
      `${translations.downloads.deleteAllDownloadsMsg} ${downloadedTours.length} ${translations.downloads.tours}? ${formatBytes(totalStorage)}.`,
      [
        { text: translations.downloads.cancel, style: 'cancel' },
        {
          text: translations.downloads.deleteAll,
          style: 'destructive',
          onPress: async () => {
            await downloadManager.deleteAllTours();
            await loadDownloadedTours();
          },
        },
      ]
    );
  };

  const getPlaceInfo = (tourId: string) => {
    return VATICAN_PLACES.find(p => p.id === tourId);
  };

  const getLanguageInfo = (code: string) => {
    return LANGUAGES.find(l => l.code === code);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.VATICAN_GOLD} />
        <Text style={styles.loadingText}>{translations.downloads.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.VATICAN_GOLD} />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{translations.downloads.title}</Text>
              <Text style={styles.headerSubtitle}>
                {downloadedTours.length} {translations.downloads.tours} • {formatBytes(totalStorage)}
              </Text>
            </View>
            {downloadedTours.length > 0 && (
              <TouchableOpacity style={styles.deleteAllBtn} onPress={handleDeleteAll}>
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.VATICAN_GOLD} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>{translations.downloads.downloadOnWifi}</Text>
            <Text style={styles.infoText}>
              {translations.downloads.downloadOnWifiDesc}
            </Text>
          </View>
        </View>

        {/* Downloaded Tours */}
        {downloadedTours.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.downloads.downloadedTours}</Text>
            {downloadedTours.map((tour) => {
              const place = getPlaceInfo(tour.id);
              const language = getLanguageInfo(tour.language);
              
              return (
                <View key={`${tour.id}_${tour.language}`} style={styles.tourCard}>
                  <Image
                    source={{ uri: tour.thumbnail || place?.image }}
                    style={styles.tourImage}
                    resizeMode="cover"
                  />
                  <View style={styles.tourInfo}>
                    <Text style={styles.tourTitle} numberOfLines={1}>
                      {tour.title}
                    </Text>
                    <View style={styles.tourMeta}>
                      <Text style={styles.tourLanguage}>
                        {language?.flag} {language?.label}
                      </Text>
                      <Text style={styles.tourSize}>{formatBytes(tour.fileSize)}</Text>
                    </View>
                    <Text style={styles.tourDate}>
                      {translations.downloads.downloaded} {new Date(tour.downloadedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteTour(tour)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* Download New Tours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.downloads.downloadNewTours}</Text>
          
          {/* Language Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.languageContainer}
            contentContainerStyle={styles.languageContent}
          >
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageTab,
                  selectedLanguage === lang.code && styles.languageTabActive,
                ]}
                onPress={() => setSelectedLanguage(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.languageLabel,
                    selectedLanguage === lang.code && styles.languageLabelActive,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Available Tours */}
          {VATICAN_PLACES.map((place) => {
            const downloadKey = `${place.id}_${selectedLanguage}`;
            const progress = downloadProgress.get(downloadKey);
            const isDownloading = progress !== undefined;
            const isDownloaded = downloadedTours.some(
              t => t.id === place.id && t.language === selectedLanguage
            );

            return (
              <View key={place.id} style={styles.placeCard}>
                <Image
                  source={{ uri: place.image }}
                  style={styles.placeImage}
                  resizeMode="cover"
                />
                <View style={styles.placeInfo}>
                  <Text style={styles.placeTitle} numberOfLines={1}>
                    {place.title}
                  </Text>
                  <Text style={styles.placeLanguage}>
                    {LANGUAGES.find(l => l.code === selectedLanguage)?.label}
                  </Text>
                  
                  {isDownloading && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                    </View>
                  )}
                </View>
                
                {isDownloaded ? (
                  <View style={styles.downloadedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                ) : isDownloading ? (
                  <ActivityIndicator size="small" color={COLORS.VATICAN_GOLD} />
                ) : (
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => handleDownloadTour(place)}
                  >
                    <Ionicons name="download-outline" size={24} color={COLORS.VATICAN_GOLD} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Empty State */}
        {downloadedTours.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-download-outline" size={80} color="rgba(0,0,0,0.2)" />
            <Text style={styles.emptyTitle}>{translations.downloads.noDownloadsYet}</Text>
            <Text style={styles.emptyText}>
              {translations.downloads.noDownloadsDesc}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.VATICAN_GOLD,
    fontSize: 14,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: COLORS.NAV,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.VATICAN_GOLD,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.VATICAN_GOLD,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  deleteAllBtn: {
    padding: 8,
  },
  infoCard: {
    flexDirection: 'row',
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(212, 165, 116, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 116, 0.3)',
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.VATICAN_GOLD,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 18,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 16,
    marginTop: 16,
  },
  tourCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  tourImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.NAV,
  },
  tourInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tourTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  tourMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  tourLanguage: {
    fontSize: 13,
    color: COLORS.VATICAN_GOLD,
  },
  tourSize: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  tourDate: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.4)',
  },
  deleteBtn: {
    padding: 8,
  },
  languageContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  languageContent: {
    gap: 8,
  },
  languageTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  languageTabActive: {
    backgroundColor: COLORS.VATICAN_GOLD,
    borderColor: COLORS.VATICAN_GOLD,
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  languageLabelActive: {
    color: COLORS.WHITE,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  placeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.NAV,
  },
  placeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  placeLanguage: {
    fontSize: 13,
    color: COLORS.VATICAN_GOLD,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.VATICAN_GOLD,
  },
  progressText: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
  },
  downloadBtn: {
    padding: 8,
  },
  downloadedBadge: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
