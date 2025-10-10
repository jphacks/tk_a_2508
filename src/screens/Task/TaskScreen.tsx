import React from 'react';
import { View, Text } from 'react-native';
import { TaskStyles } from './TaskScreen.styles';

export function TaskScreen() {
  return (
    <View style={TaskStyles.container}>
      <Text style={TaskStyles.title}>タスク</Text>
      <Text style={TaskStyles.subtitle}>タスク管理画面です</Text>
      <View style={TaskStyles.content}>
        <Text style={TaskStyles.description}>
          ここにタスク一覧やタスク管理機能が表示されます。
        </Text>
      </View>
    </View>
  );
}