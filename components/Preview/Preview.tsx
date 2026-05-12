import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

import { ArtistModel, TrackModel } from '@models';
import { useApplicationDimensions, useAudioPlayer } from '@hooks';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { CommonHeader } from './CommonHeader';
import { Cover } from './Cover';
import { Summary } from './Summary';
import { Track } from './Track';
import { Info } from './Info';
import { Artists } from './Artists';
import { MoreOf } from './MoreOf';
import { Copyrights } from './Copyrights';
import { Recommendations } from '../Recommendations';
import { EmptySection } from '../EmptySection';

import { BOTTOM_NAVIGATION_HEIGHT, COLORS, LANGS } from '@config';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './styles';
import { useUserData } from '@context';
import { AudioLang } from '../../src/types';

export type PreviewPropsType = {
  type: 'playlist' | 'album';
  id: string;
  ownerId?: string;
  imageURL: string;
  headerTitle: string;
  summaryTitle: string;
  summarySubtitle: string;
  summaryInfo: string;
  infoTexts?: string[];
  copyrightTexts?: string[];
  tracks?: TrackModel[];
  fetchTracks?: () => void;
  artists?: ArtistModel[] | null;
  recommendationsType?: 'tracks' | 'artists';
  recommendationsSeed?: string;
  description?: string;
  kidsMyth?: string;
  tips?: string[];
};

export const Preview = ({
  type,
  id,
  ownerId,
  imageURL,
  headerTitle,
  summaryTitle,
  summarySubtitle,
  summaryInfo,
  infoTexts,
  copyrightTexts,
  tracks,
  fetchTracks,
  artists,
  recommendationsSeed,
  description,
  kidsMyth,
  tips,
}: PreviewPropsType) => {
  const { userData } = useUserData();
  const { width, height } = useApplicationDimensions();
  const scrollOffset = useSharedValue(0);
  
  const { isPlaying, sightId, positionMs, durationMs, language, play, pause, resume, stop, changeLanguage } = useAudioPlayer();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const handleTrackPress = (track: TrackModel) => {
    if (sightId === track.id) {
      if (isPlaying) pause();
      else resume();
    } else {
      // Use the audioUrl from the track model based on language
      const audioUrl = track.audioFiles?.[language]?.deep?.url || (track as any).audioUrl || '';
      play(track.id, 'deep', audioUrl);
    }
  };

  const renderItem = React.useCallback(
    ({ item, index }: { item: TrackModel; index: number }) => (
      <Track
        type={type}
        key={index}
        title={item.title}
        subtitle={item.subtitle}
        imageURL={item.imageURL}
        isDownloaded={!!item.isDownloaded}
        isSaved={!!item.isSaved}
        isPlaying={sightId === item.id && isPlaying}
        explicit={!!item.explicit}
        forceDisableSaveIcon={!!(ownerId && ownerId === userData.id)}
        onPress={() => handleTrackPress(item)}
      />
    ),
    [type, ownerId, userData.id, sightId, isPlaying, language]
  );

  const currentTrack = React.useMemo(() => {
    return tracks?.find(t => t.id === sightId);
  }, [tracks, sightId]);

  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  const handleLangPress = (langCode: AudioLang) => {
    changeLanguage(langCode);
    // If playing, restart with new language
    if (sightId && isPlaying) {
      const track = tracks?.find(t => t.id === sightId);
      if (track) {
        const audioUrl = track.audioFiles?.[langCode]?.deep?.url || (track as any).audioUrl || '';
        play(sightId, 'deep', audioUrl);
      }
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      <CommonHeader
        type={type}
        title={headerTitle}
        imageURL={imageURL}
        animatedValue={scrollOffset}
      />
      <Animated.FlatList
        contentContainerStyle={[
          styles.flatListContentContainer,
          { paddingBottom: sightId ? 100 : 20 }
        ]}
        style={{
          height: height - BOTTOM_NAVIGATION_HEIGHT,
        }}
        data={tracks}
        keyExtractor={({ id }, index) => id + index}
        renderItem={renderItem}
        disableScrollViewPanResponder
        {...(fetchTracks && {
          onStartReached: fetchTracks,
          onStartReachedThreshold: 1,
        })}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        ListHeaderComponent={
          <>
            <Cover
              type={type}
              imageURL={imageURL}
              animatedValue={scrollOffset}
            />
            <Summary
              id={id}
              type={type}
              title={summaryTitle}
              subtitle={summarySubtitle}
              info={summaryInfo}
              forceDisableSaveIcon={!!(ownerId && ownerId === userData.id)}
              description={description}
              kidsMyth={kidsMyth}
              tips={tips}
            />
            
            <View style={localStyles.langContainer}>
              <Text style={localStyles.langTitle}>Select Audio Language</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={localStyles.langList}
              >
                {LANGS.map((l) => {
                  const isActive = language === l.code;
                  return (
                    <TouchableOpacity
                      key={l.code}
                      onPress={() => handleLangPress(l.code)}
                      style={[
                        localStyles.langBtn,
                        isActive && localStyles.langBtnActive
                      ]}
                    >
                      <Text style={localStyles.langFlag}>{l.flag}</Text>
                      <Text style={[
                        localStyles.langLabel,
                        isActive && localStyles.langLabelActive
                      ]}>
                        {l.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            {infoTexts && <Info infoTexts={infoTexts} />}
            {artists && <Artists artists={artists} />}
            {artists && <MoreOf artists={artists} />}
            {recommendationsSeed && (
              <Recommendations type="artist" seed={recommendationsSeed} />
            )}
            {copyrightTexts && <Copyrights copyrightTexts={copyrightTexts} />}
            <EmptySection />
          </>
        }
      />

      {sightId && currentTrack && (
        <View style={styles.miniPlayer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          <Ionicons name="headset" size={24} color={COLORS.TINT} />
          <View style={styles.miniPlayerInfo}>
            <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.miniPlayerSubtitle} numberOfLines={1}>
              Playing in {LANGS.find(l => l.code === language)?.label || 'EN'}
            </Text>
          </View>
          <View style={styles.miniPlayerControls}>
            <TouchableOpacity onPress={() => (isPlaying ? pause() : resume())}>
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color={COLORS.BLACK} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={stop}>
              <Ionicons name="close" size={24} color="rgba(0,0,0,0.5)" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  langContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    marginTop: 10,
  },
  langTitle: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  langList: {
    gap: 10,
    paddingRight: 20,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  langBtnActive: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderColor: COLORS.TINT,
  },
  langFlag: {
    fontSize: 16,
  },
  langLabel: {
    color: COLORS.BLACK,
    fontSize: 13,
    fontWeight: '700',
  },
  langLabelActive: {
    color: COLORS.TINT,
  },
});
