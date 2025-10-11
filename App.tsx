
import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}

import React from "react";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const appEnv = process.env.EXPO_PUBLIC_APP_ENV;

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>JP hu</Text>
        <Text>ENV: {appEnv}</Text>
        <Text>Supabase URL: {supabaseUrl ? "configured" : "not set"}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 8 },
});

