import React from 'react';
import { View, Text } from 'react-native';
import { FriendStyles } from './FriendScreen.styles';

export function FriendScreen() {
  return (
    <View style={FriendStyles.container}>
      <Text style={FriendStyles.title}>フレンド</Text>
      <Text style={FriendStyles.subtitle}>フレンド管理画面です</Text>
      <View style={FriendStyles.content}>
        <Text style={FriendStyles.description}>
          ここにフレンド一覧やフレンド機能が表示されます。
        </Text>
      </View>
    </View>
  );
}