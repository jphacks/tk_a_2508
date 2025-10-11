import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
// 🧪 テスト用: 新しい画面を直接表示したい場合は以下をアンコメント
// import { NewScreen } from '../screens/NewScreen/NewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
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
