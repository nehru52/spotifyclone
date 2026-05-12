import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import { COLORS } from '@config';
import { useLanguage } from '@context';
import { hexToRGB } from '@utils';

import { styles } from './styles';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useApplicationDimensions } from '@hooks';

const renderPressableContent = (name: string, isActive: boolean, translations: any) => {
  let icon = 'headset-outline';
  let label = translations.router.home;

  // Use includes() to match routes like "map/index", "map", etc.
  if (name.includes('map')) {
    icon = 'map-outline';
    label = translations.router.map;
  } else if (name.includes('booking')) {
    icon = 'ticket-outline';
    label = translations.router.booking;
  } else if (name.includes('profile')) {
    icon = 'person-outline';
    label = translations.router.profile;
  } else if (name.includes('home')) {
    icon = 'home-outline';
    label = translations.router.home;
  }

  return (
    <View style={styles.linkContainer}>
      <Ionicons
        style={[styles.icon, isActive ? styles.active : {}]}
        name={icon as any}
        size={22}
      />
      <Text style={[styles.text, isActive ? styles.active : {}]}>
        {label}
      </Text>
    </View>
  );
};

export const BottomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { width } = useApplicationDimensions();
  const { translations } = useLanguage();
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[hexToRGB(COLORS.PRIMARY, 0.9), COLORS.PRIMARY]}
        style={styles.gradient}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isActive = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={[styles.pressable, { width: width / 4 }]}
          >
            {renderPressableContent(route.name, isActive, translations)}
          </Pressable>
        );
      })}
    </View>
  );
};
