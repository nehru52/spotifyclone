import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as Icons from '@expo/vector-icons';

import { LibraryRelated } from './LibraryRelated';

import { useUserData } from '@context';
import { HEADER_CATEGORIES_HEIGHT, HEADER_HEIGHT, Pages } from '@config';
import { translations } from '@data';

import { styles } from './styles';

export type HeaderPropsType = {
  tab: Pages;
};

export const Header = ({ tab }: HeaderPropsType) => {
  const { top: statusBarOffset } = useSafeAreaInsets();
  const { userData } = useUserData();

  const handleProfilePress = () => {
    // TODO: open menu logic
  };

  const title = React.useMemo(() => translations.header[tab], [tab]);

  const height = React.useMemo(() => {
    switch (tab) {
      case Pages.BOOKING:
      case Pages.MAP:
      case Pages.PROFILE:
      case Pages.HOME:
      default:
        return HEADER_HEIGHT;
    }
  }, [tab]);

  const TabRelatedComponent = React.useMemo(() => {
    switch (tab) {
      case Pages.BOOKING:
      case Pages.MAP:
      case Pages.PROFILE:
      case Pages.HOME:
      default:
        return null;
    }
  }, [tab]);

  const TabRelatedIcons = React.useMemo(() => {
    switch (tab) {
      case Pages.HOME:
        return (
          <>
            <Pressable>
              <Icons.Ionicons style={styles.icon} name="notifications-outline" />
            </Pressable>
            <Pressable>
              <Icons.AntDesign style={styles.icon} name="setting" />
            </Pressable>
          </>
        );
      case Pages.BOOKING:
      case Pages.MAP:
      case Pages.PROFILE:
      default:
        return null;
    }
  }, [tab]);

  return (
    <View style={[styles.container, { paddingTop: statusBarOffset, height }]}>
      <View style={styles.content}>
        <Pressable style={styles.profile} onPress={handleProfilePress}>
          <Image
            style={styles.profileImage}
            source={{ uri: userData.imageURL || '' }}
          />
        </Pressable>
        {TabRelatedIcons}
      </View>
      {TabRelatedComponent}
    </View>
  );
};
