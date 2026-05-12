import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TEST - App Loaded!</Text>
      <Link href="/(tabs)/home" style={styles.link}>
        <Text style={styles.linkText}>Go to Home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  link: {
    padding: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  linkText: {
    color: '#fff',
    fontSize: 18,
  },
});
