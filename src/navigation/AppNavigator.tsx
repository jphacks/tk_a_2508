import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/Login/LoginScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: () => (
            <Image source={require('../../assets/logo-header.png')} style={localStyles.logoImage} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{ marginRight: 8 }}
            >
              <View style={localStyles.headerAvatar}>
                <Text style={localStyles.avatarText}>👤</Text>
              </View>
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'プロフィール' }} />
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
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: '#fff',
  },
});
