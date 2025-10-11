import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { LoginStyles } from './LoginScreen.styles';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('エラー', 'ユーザー名とパスワードを入力してください');
      return;
    }
    
    // ログイン処理
    Alert.alert('ログイン成功', 'ホーム画面に遷移します', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Home')
      }
    ]);
  };

        return (
          <View style={LoginStyles.container}>
            {/* 背景グラデーション */}
            <LinearGradient
              colors={['rgba(111, 191, 118, 1)', 'rgba(3, 160, 229, 1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={LoginStyles.backgroundGradient}
            />
      
      {/* ロゴエリア */}
      <View style={LoginStyles.logoArea}>
        {/* Lazy Busters ロゴ画像 */}
        <Image
          source={require('../../../assets/images/lazy-busters-logo.png')}
          style={LoginStyles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* フォームエリア */}
      <View style={LoginStyles.formArea}>
        {/* ユーザー名入力 */}
        <View style={LoginStyles.inputContainer}>
          <TextInput
            style={LoginStyles.input}
            placeholder="Username"
            placeholderTextColor="#D9D9D9"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* パスワード入力 */}
        <View style={LoginStyles.inputContainer}>
          <TextInput
            style={LoginStyles.input}
            placeholder="Password"
            placeholderTextColor="#D9D9D9"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* ログインボタン */}
        <TouchableOpacity style={LoginStyles.loginButton} onPress={handleLogin}>
          <Text style={LoginStyles.loginButtonText}>Create new account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
