import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, ScrollView, Image, Switch } from 'react-native';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';
import { hexToRGB } from '@utils';
import { locationService } from '../src/services/locationService';
import { useLanguage } from '@context';

// Vatican & Rome Places with GPS coordinates
const PLACES = [
  {
    id: 'colosseum',
    name: 'Colosseum',
    category: 'Ancient Rome',
    lat: 41.8902,
    lng: 12.4922,
    thumbnail: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
  },
  {
    id: 'forum',
    name: 'Roman Forum',
    category: 'Ancient Rome',
    lat: 41.8925,
    lng: 12.4853,
    thumbnail: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=600&q=80',
  },
  {
    id: 'heart',
    name: 'Heart of Rome',
    category: 'Historic Center',
    lat: 41.9009,
    lng: 12.4833,
    thumbnail: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80',
  },
  {
    id: 'jewish-ghetto',
    name: 'Jewish Ghetto',
    category: 'Historic Quarter',
    lat: 41.8919,
    lng: 12.4778,
    thumbnail: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
  },
  {
    id: 'ostia-antica',
    name: 'Ostia Antica',
    category: 'Archaeological Site',
    lat: 41.7569,
    lng: 12.2925,
    thumbnail: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80',
  },
  {
    id: 'pantheon',
    name: 'Pantheon',
    category: 'Ancient Temple',
    lat: 41.8986,
    lng: 12.4769,
    thumbnail: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=600&q=80',
  },
  {
    id: 'sistine-chapel',
    name: 'Sistine Chapel',
    category: 'Vatican Museums',
    lat: 41.9029,
    lng: 12.4545,
    thumbnail: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
  },
  {
    id: 'st-peters-basilica',
    name: "St. Peter's Basilica",
    category: 'Vatican City',
    lat: 41.9022,
    lng: 12.4539,
    thumbnail: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&q=80',
  },
  {
    id: 'trastevere',
    name: 'Trastevere',
    category: 'Neighborhood',
    lat: 41.8897,
    lng: 12.4689,
    thumbnail: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
  },
  {
    id: 'vatican-museums',
    name: 'Vatican Museums',
    category: 'Vatican City',
    lat: 41.9065,
    lng: 12.4536,
    thumbnail: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
  },
  {
    id: 'vatican-pinacoteca',
    name: 'Vatican Pinacoteca',
    category: 'Vatican Museums',
    lat: 41.9043,
    lng: 12.4531,
    thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
  },
];

export const MapScreen = () => {
  const { translations } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [userLocation, setUserLocation] = React.useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = React.useState<typeof PLACES[0] | null>(null);
  const [mapReady, setMapReady] = React.useState(false);
  const [showFallback, setShowFallback] = React.useState(false);
  const [gpsEnabled, setGpsEnabled] = React.useState(false);
  const [gpsLoading, setGpsLoading] = React.useState(false);
  const mapRef = React.useRef<MapView>(null);

  const [region, setRegion] = React.useState<Region>({
    latitude: 41.9028,
    longitude: 12.4964,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });

  const getLocation = async () => {
    try {
      console.log('[MapScreen] Getting current position...');
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });
      console.log('[MapScreen] Location:', location.coords);
      setUserLocation(location);
      setLocationError(null);
      
      // Update map region to user location
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      });
    } catch (locError: any) {
      console.error('[MapScreen] Location error:', locError);
      setLocationError('Could not get your location');
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        console.log('[MapScreen] Requesting location permission...');
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('[MapScreen] Permission status:', status);
        
        if (status === 'granted') {
          await getLocation();
        } else {
          console.log('[MapScreen] Location permission denied');
          setLocationError('Location permission denied');
        }

        // Load GPS settings
        const settings = await locationService.getSettings();
        setGpsEnabled(settings.enabled);
      } catch (error) {
        console.error('[MapScreen] Error:', error);
        setLocationError('Location service error');
      } finally {
        setLoading(false);
      }
    })();

    // Timeout to ensure map shows even if it takes long to load
    const timeout = setTimeout(() => {
      setMapReady(true);
      setLoading(false);
      // If map tiles don't load after 5 seconds, show fallback
      setTimeout(() => {
        setShowFallback(true);
      }, 5000);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handleMarkerPress = (place: typeof PLACES[0]) => {
    setSelectedPlace(place);
    // Animate to the selected place
    mapRef.current?.animateToRegion({
      latitude: place.lat,
      longitude: place.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  const handleMyLocation = async () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    } else {
      await getLocation();
    }
  };

  const calculateDistance = (lat: number, lng: number) => {
    if (!userLocation) return null;
    
    const R = 6371; // Earth radius in km
    const dLat = (lat - userLocation.coords.latitude) * Math.PI / 180;
    const dLon = (lng - userLocation.coords.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.coords.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d;
  };

  const handleToggleGPS = async () => {
    setGpsLoading(true);
    try {
      const newState = !gpsEnabled;
      await locationService.updateSettings({ enabled: newState });
      setGpsEnabled(newState);
      
      Alert.alert(
        newState ? '✅ ' + translations.gps.gpsEnabled : '⏸️ ' + translations.gps.gpsDisabled,
        newState 
          ? translations.gps.gpsEnabledMsg
          : translations.gps.gpsDisabled
      );
    } catch (error) {
      console.error('[MapScreen] Error toggling GPS:', error);
      Alert.alert('Error', 'Could not toggle GPS. Please try again.');
    } finally {
      setGpsLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.VATICAN_GOLD} />
        <Text style={styles.loadingText}>{translations.map.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* GPS Toggle Card */}
      <View style={styles.gpsToggleCard}>
        <View style={styles.gpsToggleContent}>
          <Ionicons 
            name={gpsEnabled ? "navigate-circle" : "navigate-circle-outline"} 
            size={28} 
            color={gpsEnabled ? COLORS.VATICAN_GOLD : COLORS.GREY} 
          />
          <View style={styles.gpsToggleText}>
            <Text style={styles.gpsToggleTitle}>{translations.map.gpsAutoPlay}</Text>
            <Text style={styles.gpsToggleSubtitle}>
              {gpsEnabled ? translations.map.gpsActive : translations.map.gpsInactive}
            </Text>
          </View>
          {gpsLoading ? (
            <ActivityIndicator size="small" color={COLORS.VATICAN_GOLD} />
          ) : (
            <Switch
              value={gpsEnabled}
              onValueChange={handleToggleGPS}
              trackColor={{ false: '#767577', true: COLORS.VATICAN_GOLD }}
              thumbColor={gpsEnabled ? COLORS.WHITE : '#f4f3f4'}
            />
          )}
        </View>
      </View>

      {!showFallback ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            loadingEnabled={true}
            loadingIndicatorColor={COLORS.VATICAN_GOLD}
            loadingBackgroundColor={COLORS.PRIMARY}
            onMapReady={() => {
              console.log('[MapScreen] Map is ready');
              setMapReady(true);
            }}
            onMapLoaded={() => {
              console.log('[MapScreen] Map loaded');
              setShowFallback(false);
            }}
            mapType="standard"
            pitchEnabled={false}
            rotateEnabled={false}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            {/* Place markers */}
            {PLACES.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.lat, longitude: place.lng }}
                onPress={() => handleMarkerPress(place)}
                title={place.name}
                description={place.category}
              >
                <View style={[
                  styles.markerContainer,
                  selectedPlace?.id === place.id && styles.markerSelected
                ]}>
                  <Ionicons 
                    name="location" 
                    size={36} 
                    color={selectedPlace?.id === place.id ? COLORS.VATICAN_GOLD : COLORS.PRIMARY} 
                  />
                </View>
              </Marker>
            ))}
          </MapView>
        </>
      ) : (
        <ScrollView style={styles.fallbackContainer} contentContainerStyle={styles.fallbackContent}>
          <View style={styles.fallbackHeader}>
            <Ionicons name="map-outline" size={32} color={COLORS.VATICAN_GOLD} />
            <View style={styles.placeCountBadge}>
              <Text style={styles.placeCountText}>{PLACES.length} {translations.map.locations}</Text>
            </View>
          </View>

          {PLACES.sort((a, b) => {
            const distA = calculateDistance(a.lat, a.lng);
            const distB = calculateDistance(b.lat, b.lng);
            return (distA || 999) - (distB || 999);
          }).map((place) => {
            const distance = calculateDistance(place.lat, place.lng);
            return (
              <TouchableOpacity
                key={place.id}
                style={styles.placeCard}
                onPress={() => setSelectedPlace(place)}
              >
                <Image source={{ uri: place.thumbnail }} style={styles.placeImage} />
                <View style={styles.placeCardContent}>
                  <Text style={styles.placeCardName}>{place.name}</Text>
                  <Text style={styles.placeCardCategory}>{place.category}</Text>
                  <View style={styles.placeCardMeta}>
                    <Ionicons name="location" size={14} color={COLORS.VATICAN_BLUE} />
                    <Text style={styles.placeCardDistance}>
                      {distance ? `${distance.toFixed(1)} km ${translations.map.away}` : 'Distance unknown'}
                    </Text>
                  </View>
                  <Text style={styles.placeCardCoords}>
                    📍 {place.lat.toFixed(4)}°N, {place.lng.toFixed(4)}°E
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="rgba(0,0,0,0.3)" />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* My Location Button */}
      {!showFallback && (
        <TouchableOpacity 
          style={styles.myLocationBtn}
          onPress={handleMyLocation}
        >
          <Ionicons name="locate" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      )}

      {/* Selected Place Info Card */}
      {selectedPlace && (
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>{selectedPlace.name}</Text>
              <Text style={styles.infoCategory}>{selectedPlace.category}</Text>
              {userLocation && (
                <View style={styles.distanceRow}>
                  <Ionicons name="walk" size={14} color="rgba(0,0,0,0.6)" />
                  <Text style={styles.distanceText}>
                    {calculateDistance(selectedPlace.lat, selectedPlace.lng)?.toFixed(1)} km away
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setSelectedPlace(null)}
            >
              <Ionicons name="close" size={20} color="rgba(0,0,0,0.6)" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.playBtn}
            onPress={() => {
              Alert.alert(
                translations.map.playAudioTour,
                `Start audio tour for ${selectedPlace.name}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Play', onPress: () => console.log('Play audio:', selectedPlace.id) }
                ]
              );
            }}
          >
            <Ionicons name="play-circle" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.playBtnText}>{translations.map.playAudioTour}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Location Status Bar */}
      <View style={styles.statusBar}>
        <Ionicons 
          name={locationError ? "alert-circle" : "location"} 
          size={16} 
          color={locationError ? "#FF6B6B" : COLORS.VATICAN_GOLD} 
        />
        <Text style={styles.statusText}>
          {locationError 
            ? locationError
            : userLocation 
              ? `${userLocation.coords.latitude.toFixed(4)}°${userLocation.coords.latitude >= 0 ? 'N' : 'S'}, ${Math.abs(userLocation.coords.longitude).toFixed(4)}°${userLocation.coords.longitude >= 0 ? 'E' : 'W'}` 
              : 'Getting location...'}
        </Text>
      </View>

      {/* Map Loading Overlay */}
      {!mapReady && (
        <View style={styles.mapLoadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.VATICAN_GOLD} />
          <Text style={styles.mapLoadingText}>Loading map tiles...</Text>
          <TouchableOpacity 
            style={styles.skipLoadingBtn}
            onPress={() => setMapReady(true)}
          >
            <Text style={styles.skipLoadingBtnText}>Show Map Anyway</Text>
          </TouchableOpacity>
        </View>
      )}
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
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.VATICAN_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerSelected: {
    backgroundColor: COLORS.WHITE,
    transform: [{ scale: 1.2 }],
  },
  myLocationBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.VATICAN_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statusBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: hexToRGB(COLORS.PRIMARY, 0.9),
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: COLORS.BLACK,
    fontSize: 12,
    flex: 1,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: hexToRGB(COLORS.PRIMARY, 0.95),
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: hexToRGB(COLORS.VATICAN_GOLD, 0.3),
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCategory: {
    color: COLORS.VATICAN_GOLD,
    fontSize: 13,
    marginTop: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  distanceText: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 12,
  },
  closeBtn: {
    padding: 4,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.VATICAN_BLUE,
    paddingVertical: 12,
    borderRadius: 12,
  },
  playBtnText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: hexToRGB(COLORS.PRIMARY, 0.9),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  mapLoadingText: {
    color: COLORS.VATICAN_GOLD,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  skipLoadingBtn: {
    backgroundColor: COLORS.VATICAN_BLUE,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  skipLoadingBtnText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  fallbackContent: {
    padding: 20,
    paddingTop: 10,
  },
  fallbackHeader: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 10,
    paddingTop: 10,
  },
  placeCountBadge: {
    backgroundColor: COLORS.VATICAN_BLUE,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  placeCountText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
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
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  placeCardName: {
    color: COLORS.VATICAN_BLUE,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeCardCategory: {
    color: COLORS.GREY,
    fontSize: 12,
    marginBottom: 6,
  },
  placeCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  placeCardDistance: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 12,
  },
  placeCardCoords: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 10,
  },
  gpsToggleCard: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: hexToRGB(COLORS.PRIMARY, 0.95),
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: hexToRGB(COLORS.VATICAN_GOLD, 0.3),
  },
  gpsToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gpsToggleText: {
    flex: 1,
  },
  gpsToggleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 2,
  },
  gpsToggleSubtitle: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
});
