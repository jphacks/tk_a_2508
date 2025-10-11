import React from 'react';
// プロジェクトが元々使っていたナビゲーターをインポート
// このパスが正しいナビゲーション定義ファイルであると仮定します
import { AppNavigator } from "./src/navigation/AppNavigator";
import "react-native-url-polyfill/auto";

export default function App() {
  // AppNavigatorが全ての画面とルーティングを管理します
  return <AppNavigator />;
}

// 注意: このファイルから NavigationContainer, Stack, HomeScreen, ProfileScreen の
// すべてのインポートと、styles の定義、そして重複した export default App は削除してください。
