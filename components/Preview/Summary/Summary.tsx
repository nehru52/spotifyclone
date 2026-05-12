import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import { AnimatedPressable } from './AnimatedPressable';

import { checkSavedAlbums, checkSavedPlaylists } from '@api';
import { COLORS } from '@config';

import { styles } from './styles';

export type SummaryPropsType = {
  id: string;
  type: 'album' | 'playlist';
  title: string;
  subtitle: string;
  info: string;
  forceDisableSaveIcon?: boolean;
  description?: string;
  kidsMyth?: string;
  tips?: string[];
};

export const Summary = ({
  id,
  type,
  title,
  subtitle,
  info,
  forceDisableSaveIcon,
  description,
  kidsMyth,
  tips,
}: SummaryPropsType) => {
  const [isSaved, setIsSaved] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!id) {
      return;
    }

    (async () => {
      try {
        const savedAlbums =
          type === 'album'
            ? await checkSavedAlbums([id])
            : await checkSavedPlaylists([id]);

        setIsSaved(savedAlbums[0]);
      } catch (error) {
        setIsSaved(false);
        console.error(`Failed to check if ${type} is saved:`, error);
      }
    })();
  }, [type, id]);

  return (
    <View style={styles.summary}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.info}>{info}</Text>

      {description && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.info, { color: COLORS.WHITE, fontSize: 14, lineHeight: 20 }]}>{description}</Text>
        </View>
      )}

      {kidsMyth && (
        <View style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8 }}>
          <Text style={[styles.subtitle, { color: COLORS.TINT, marginBottom: 4 }]}>✨ Kids Myth</Text>
          <Text style={[styles.info, { fontSize: 13, fontStyle: 'italic' }]}>{kidsMyth}</Text>
        </View>
      )}

      {tips && tips.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.subtitle, { fontSize: 14, fontWeight: 'bold' }]}>💡 Pro Tips</Text>
          {tips.map((tip, index) => (
            <Text key={index} style={[styles.info, { fontSize: 13, marginTop: 4 }]}>• {tip}</Text>
          ))}
        </View>
      )}

      <View style={styles.pressablesView}>
        {!forceDisableSaveIcon && (
          <AnimatedPressable
            defaultIcon="plus"
            activeIcon="check"
            isActive={isSaved}
          />
        )}
        <AnimatedPressable
          defaultIcon="arrow-down"
          activeIcon="arrow-down"
          // TODO: removed this true value and check if tracks are downloaded instead
          isActive={true}
        />
        <Pressable>
          <Entypo style={styles.moreIcon} name="dots-three-horizontal" />
        </Pressable>
      </View>
    </View>
  );
};
