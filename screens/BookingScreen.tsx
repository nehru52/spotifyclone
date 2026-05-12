import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, ActivityIndicator, Image } from 'react-native';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { fetchToursFromSanity, SanityTour } from '../src/services/tours';
import { useLanguage } from '@context';

const BOOKING_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BOOKING_URL || 'https://wondersofrome.com/book';

export const BookingScreen = () => {
  const { translations } = useLanguage();
  const [tours, setTours] = React.useState<SanityTour[]>([]);
  const [filteredTours, setFilteredTours] = React.useState<SanityTour[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const categories = [
    { id: 'all', label: translations.booking.allTours },
    { id: 'vatican', label: translations.booking.vaticanMuseums },
    { id: 'colosseum', label: translations.booking.colosseumTours },
    { id: 'city', label: translations.booking.cityTours },
    { id: 'hidden-gems', label: translations.booking.hiddenGems },
  ];

  React.useEffect(() => {
    loadTours();
  }, []);

  React.useEffect(() => {
    filterTours();
  }, [selectedCategory, tours]);

  const loadTours = async () => {
    try {
      setLoading(true);
      console.log('[BookingScreen] Fetching tours...');
      const data = await fetchToursFromSanity();
      console.log('[BookingScreen] Received tours:', data.length);
      
      // Filter and sanitize tours
      const seenIds = new Set();
      const validTours = data
        .filter(tour => {
          if (!tour || typeof tour !== 'object') {
            console.warn('[BookingScreen] Invalid tour object:', tour);
            return false;
          }
          if (!tour.id || !tour.title) {
            console.warn('[BookingScreen] Tour missing id or title:', tour);
            return false;
          }
          if (seenIds.has(tour.id)) {
            console.warn('[BookingScreen] Duplicate tour ID found, skipping:', tour.id);
            return false;
          }
          seenIds.add(tour.id);
          return true;
        })
        .map(tour => ({
          ...tour,
          // Ensure all fields are safe strings or proper types
          title: String(tour.title || 'Untitled'),
          description: tour.description ? String(tour.description).substring(0, 200) : '',
          duration: tour.duration ? String(tour.duration) : '',
          location: tour.location ? String(tour.location) : '',
          price: typeof tour.price === 'number' ? tour.price : null,
          highlights: Array.isArray(tour.highlights) 
            ? tour.highlights.filter(h => h && typeof h === 'string').map(h => String(h))
            : [],
        }));
      
      console.log('[BookingScreen] Valid tours:', validTours.length);
      setTours(validTours);
    } catch (error) {
      console.error('[BookingScreen] Failed to load tours:', error);
      setTours([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filterTours = () => {
    if (selectedCategory === 'all') {
      setFilteredTours(tours);
    } else if (selectedCategory === 'vatican') {
      // Vatican Museums includes both 'vatican' and 'Vatican Tours' categories
      setFilteredTours(tours.filter(t => 
        t.category === 'vatican' || t.category === 'Vatican Tours'
      ));
    } else {
      setFilteredTours(tours.filter(t => t.category === selectedCategory));
    }
  };

  const handleBookOnWebsite = async (tourId?: string) => {
    try {
      const url = tourId ? `${BOOKING_URL}?tour=${tourId}` : BOOKING_URL;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open booking website');
      }
    } catch (error) {
      console.error('[BookingScreen] Failed to open URL:', error);
      Alert.alert('Error', 'Failed to open booking page');
    }
  };

  const handleQuickBook = (tour: SanityTour) => {
    const priceText = tour.price ? `€${tour.price}` : 'Contact for pricing';
    const durationText = tour.duration || 'Flexible duration';
    
    Alert.alert(
      tour.title,
      `${tour.description || 'Explore this amazing experience'}\n\nPrice: ${priceText}\nDuration: ${durationText}\n\nWould you like to book this tour?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book on Website', 
          onPress: () => handleBookOnWebsite(tour.id),
          style: 'default'
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.VATICAN_GOLD} />
        <Text style={styles.loadingText}>{translations.booking.loadingTours}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Category Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryTab,
                  selectedCategory === cat.id && styles.categoryTabActive
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[
                  styles.categoryTabText,
                  selectedCategory === cat.id && styles.categoryTabTextActive
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Quick Book Button */}
          <TouchableOpacity 
            style={styles.websiteButton}
            onPress={() => handleBookOnWebsite()}
          >
            <View style={styles.websiteButtonContent}>
              <Ionicons name="globe" size={24} color={COLORS.PRIMARY} />
              <View style={styles.websiteButtonText}>
                <Text style={styles.websiteButtonTitle}>{translations.booking.bookOnWebsite}</Text>
                <Text style={styles.websiteButtonSubtitle}>{translations.booking.bookingExperience}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={COLORS.PRIMARY} />
            </View>
          </TouchableOpacity>

          {/* Tour Packages */}
          <View style={styles.packagesContainer}>
            <Text style={styles.sectionTitle}>
              {filteredTours.length > 0 ? `${categories.find(c => c.id === selectedCategory)?.label} (${filteredTours.length})` : 'Loading Tours...'}
            </Text>
            
            {filteredTours.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="ticket-outline" size={60} color="rgba(0,0,0,0.2)" />
                <Text style={styles.emptyText}>{translations.booking.noToursAvailable}</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={() => setSelectedCategory('all')}
                >
                  <Text style={styles.retryButtonText}>{translations.booking.viewAllTours}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredTours.map((tour) => {
              // Safety check - skip tours without required data
              if (!tour.id || !tour.title) return null;
              
              return (
              <TouchableOpacity 
                key={tour.id}
                style={styles.tourCard}
                onPress={() => handleQuickBook(tour)}
              >
                {!!tour.thumbnail && (
                  <Image 
                    source={{ uri: tour.thumbnail }} 
                    style={styles.tourImage}
                    resizeMode="cover"
                  />
                )}
                
                <View style={styles.tourCardContent}>
                  <View style={styles.tourCardHeader}>
                    <View style={styles.tourCardHeaderText}>
                      <Text style={styles.tourName} numberOfLines={2}>
                        {tour.title}
                      </Text>
                      {!!(tour.duration && tour.duration.length > 0) && (
                        <View style={styles.tourMeta}>
                          <Ionicons name="time-outline" size={14} color="rgba(0,0,0,0.5)" />
                          <Text style={styles.tourDuration}>{tour.duration}</Text>
                        </View>
                      )}
                      {!!(tour.location && tour.location.length > 0) && (
                        <View style={styles.tourMeta}>
                          <Ionicons name="location-outline" size={14} color="rgba(0,0,0,0.5)" />
                          <Text style={styles.tourDuration}>{tour.location}</Text>
                        </View>
                      )}
                    </View>
                    {!!(tour.price && typeof tour.price === 'number') && (
                      <Text style={styles.tourPrice}>€{tour.price}</Text>
                    )}
                  </View>

                  {!!(tour.description && tour.description.length > 0) && (
                    <Text style={styles.tourDescription} numberOfLines={3}>
                      {tour.description}
                    </Text>
                  )}

                  {!!(tour.highlights && Array.isArray(tour.highlights) && tour.highlights.length > 0) && (
                    <View style={styles.includesContainer}>
                      {tour.highlights.slice(0, 3).map((item, index) => {
                        if (!item || typeof item !== 'string') return null;
                        return (
                          <View key={index} style={styles.includeItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.includeText} numberOfLines={1}>
                              {item}
                            </Text>
                          </View>
                        );
                      })}
                      {tour.highlights.length > 3 && (
                        <Text style={styles.moreHighlights}>
                          +{tour.highlights.length - 3} more
                        </Text>
                      )}
                    </View>
                  )}

                  <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => handleQuickBook(tour)}
                  >
                    <Text style={styles.bookButtonText}>{translations.booking.bookNow}</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.PRIMARY} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
            })
            )}
          </View>

          {/* Contact Info */}
          <View style={styles.contactCard}>
            <Ionicons name="help-circle" size={32} color={COLORS.VATICAN_GOLD} />
            <Text style={styles.contactTitle}>{translations.booking.needHelp}</Text>
            <Text style={styles.contactText}>
              {translations.booking.contactUs}
            </Text>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => Linking.openURL(`https://wa.me/3514199425`)}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text style={styles.contactButtonText}>{translations.booking.whatsappUs}</Text>
            </TouchableOpacity>
          </View>
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
    color: COLORS.VATICAN_BLUE,
    fontSize: 14,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    maxHeight: 50,
    marginTop: 10,
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  categoryTabActive: {
    backgroundColor: COLORS.VATICAN_BLUE,
    borderColor: COLORS.VATICAN_BLUE,
  },
  categoryTabText: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: COLORS.WHITE,
  },
  websiteButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: COLORS.VATICAN_BLUE,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  websiteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  websiteButtonText: {
    flex: 1,
  },
  websiteButtonTitle: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  websiteButtonSubtitle: {
    color: COLORS.WHITE,
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
  packagesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    color: COLORS.BLACK,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tourCard: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  tourImage: {
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tourCardContent: {
    padding: 16,
  },
  tourCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tourIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tourCardHeaderText: {
    flex: 1,
  },
  tourName: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tourMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  tourDuration: {
    color: COLORS.GREY,
    fontSize: 12,
  },
  tourPrice: {
    color: COLORS.VATICAN_BLUE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  tourDescription: {
    color: COLORS.GREY,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  includesContainer: {
    gap: 6,
    marginBottom: 16,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  includeText: {
    color: COLORS.GREY,
    fontSize: 13,
    flex: 1,
  },
  moreHighlights: {
    color: COLORS.VATICAN_BLUE,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.VATICAN_BLUE,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  contactCard: {
    margin: 20,
    marginTop: 0,
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  contactTitle: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  contactText: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(37, 211, 102, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#25D366',
  },
  contactButtonText: {
    color: '#25D366',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 14,
    marginTop: 12,
  },
  retryButton: {
    backgroundColor: COLORS.VATICAN_BLUE,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  retryButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
});
