import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { LoginStyles } from "./LoginScreen.styles";
import { supabase } from "../../lib/supabase";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // ログイン（既存ユーザー）
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert("ログイン失敗", error.message);
      return;
    }
    // 成功したらホームへ
    navigation.navigate("Home");
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Alert.alert("登録失敗", error.message);
      return;
    }
    // メール認証を有効にしている場合は認証メール送信後の案内を表示
    Alert.alert(
      "確認メールを送信しました",
      "メール内のリンクを開いて完了してください"
    );
  };

  return (
    <View style={LoginStyles.container}>
      {/* 背景グラデーション */}
      <LinearGradient
        colors={["#DDD7FE", "#DDD7FE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={LoginStyles.backgroundGradient}
      />

      {/* ロゴエリア */}
      <View style={LoginStyles.logoArea}>
        {/* Lazy Busters ロゴ画像 */}
        <Image
          source={require("../../../assets/images/lazy-busters-logo.png")}
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
            placeholder="Email"
            placeholderTextColor="#D9D9D9"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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
            autoCapitalize="none"
            secureTextEntry
          />
        </View>

        {/* ログインボタン */}
        <TouchableOpacity style={LoginStyles.loginButton} onPress={handleLogin}>
          <Text style={LoginStyles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={LoginStyles.loginButton}
          onPress={handleSignUp}
        >
          <Text style={LoginStyles.loginButtonText}>Create new account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
