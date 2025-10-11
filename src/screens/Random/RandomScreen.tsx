import React from "react";
import { View, Text } from "react-native";
import { RandomStyles } from "./RandomScreen.styles";

export function RandomScreen() {
  return (
    <View style={RandomStyles.container}>
      <Text style={RandomStyles.title}>ランダム</Text>
      <Text style={RandomStyles.subtitle}>デフォルトで表示される画面です</Text>
      <View style={RandomStyles.content}>
        <Text style={RandomStyles.description}>
          ここにランダムなコンテンツが表示されます。
        </Text>
      </View>
    </View>
  );
}
