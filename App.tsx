// App.tsx の内容を以下に書き換えます

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 作成した画面をインポート
import ProfileScreen from "./screens/ProfileScreen"; 
// 現在のApp.tsxの画面を仮のHome画面とします
import HomeScreen from "./screens/HomeScreen"; 

// スタックナビゲーターを初期化
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // アプリ全体のナビゲーションコンテナ
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Home画面 (元のApp.tsxの内容を移植) */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* プロフィール画面の登録 */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}