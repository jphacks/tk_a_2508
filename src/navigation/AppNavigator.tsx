import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, StyleSheet } from 'react-native';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/Login/LoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            // use app-style logo as centered title and avatar on the right
            headerTitle: () => (
              <Image source={require('../../assets/logo-header.png')} style={localStyles.logoImage} />
            ),
            headerShown: false,
          }}
        />
        {/* 🧪 テスト用: 新しい画面を直接表示したい場合は以下をアンコメント
        <Stack.Screen 
          name="NewScreen" 
          component={NewScreen}
          options={{ title: '新しい画面' }}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const localStyles = StyleSheet.create({
  logoImage: {
    width: 180,
    height: 38,
    resizeMode: 'contain',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
