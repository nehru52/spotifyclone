import * as React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { fetchTours } from '../../src/services/content';
import { Tour } from '../../src/types';
import { COLORS, BOTTOM_NAVIGATION_HEIGHT, HEADER_HEIGHT } from '@config';
import { useApplicationDimensions } from '@hooks';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getSightImage } from '../../src/services/images';
import { LinearGradient } from 'expo-linear-gradient';

export const Home = () => {
  const { height, width } = useApplicationDimensions();
  const [tours, setTours] = React.useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = React.useState<Tour[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      try {
        const data = await fetchTours();
        setTours(data);
        setFilteredTours(data);
      } catch (e) {
        console.error('Failed to fetch tours', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredTours(tours);
    } else {
      setFilteredTours(
        tours.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.category?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, tours]);

  const handleTourPress = (tour: Tour) => {
    router.push({
      pathname: '/album/[albumId]',
      params: { albumId: tour.id }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { height: height - BOTTOM_NAVIGATION_HEIGHT - HEADER_HEIGHT, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.TINT} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height: height - BOTTOM_NAVIGATION_HEIGHT - HEADER_HEIGHT }]}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="rgba(0,0,0,0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tours, locations..."
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="rgba(0,0,0,0.5)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.headerSection}>
          <Text style={styles.sectionTitle}>Wonders of Rome</Text>
          <Text style={styles.sectionSubtitle}>Discover the secrets of the Eternal City</Text>
        </View>
        
        <View style={styles.tourList}>
          {filteredTours.map((tour) => (
            <TouchableOpacity 
              key={tour.id} 
              style={styles.tourCard}
              onPress={() => handleTourPress(tour)}
              activeOpacity={0.9}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: getSightImage(tour.id, tour.thumbnail) }} 
                  style={styles.thumbnail} 
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.badge}>
                  <Ionicons name="walk" size={12} color="#000" />
                  <Text style={styles.badgeText}>{tour.stops.length} stops</Text>
                </View>
                {tour.duration && (
                  <View style={[styles.badge, { left: 85 }]}>
                    <Ionicons name="time-outline" size={12} color="#000" />
                    <Text style={styles.badgeText}>{tour.duration}</Text>
                  </View>
                )}
              </View>
              <View style={styles.tourInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.tourTitle}>{tour.title}</Text>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.TINT} />
                </View>
                <Text style={styles.tourCategory}>{tour.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {filteredTours.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="rgba(0,0,0,0.2)" />
              <Text style={styles.emptyText}>No tours found for "{searchQuery}"</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.PRIMARY,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: COLORS.BLACK,
    fontSize: 15,
    marginLeft: 8,
  },
  headerSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: COLORS.BLACK,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 15,
    marginTop: 4,
    fontWeight: '500',
  },
  tourList: {
    paddingHorizontal: 20,
    gap: 20,
  },
  tourCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: COLORS.TINT,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: COLORS.PRIMARY,
    fontSize: 11,
    fontWeight: '800',
  },
  tourInfo: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tourTitle: {
    color: COLORS.BLACK,
    fontSize: 19,
    fontWeight: '800',
    flex: 1,
    marginRight: 10,
  },
  tourCategory: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 16,
    marginTop: 12,
  },
});
