import { Tabs } from 'expo-router';
import { BottomTabBar } from '@navigators';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@config';

export default function Layout() {
  return (
    <View style={styles.container}>
      <Tabs 
        tabBar={(props) => <BottomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          contentStyle: styles.content,
        }}
      >
        <Tabs.Screen name="home" options={{ headerShown: false }} />
        <Tabs.Screen name="map" options={{ headerShown: false }} />
        <Tabs.Screen name="booking" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ headerShown: false }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  content: {
    backgroundColor: COLORS.PRIMARY,
  },
});
