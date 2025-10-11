import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { commonStyles } from '../styles/common';
import { RandomScreen } from './Random/RandomScreen';
import { TaskScreen } from './Task/TaskScreen';
import { FriendScreen } from './Friend/FriendScreen';
import { HomeStyles } from './HomeScreen.styles';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

type TabType = 'random' | 'task' | 'friend';

export function HomeScreen({ navigation }: HomeScreenProps) {
  // 🧪 テスト用: 新しい画面を表示したい場合は以下を変更
  // const [activeTab, setActiveTab] = useState<TabType>('random');
  const [activeTab, setActiveTab] = useState<TabType>('random');
  // 例: const [activeTab, setActiveTab] = useState<TabType>('newscreen');

  const renderContent = () => {
    switch (activeTab) {
      case 'random':
        return <RandomScreen />;
      case 'task':
        return <TaskScreen />;
      case 'friend':
        return <FriendScreen />;
      default:
        return <RandomScreen />;
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* タブバー */}
      <View style={HomeStyles.tabBar}>
        <TouchableOpacity
          style={[
            HomeStyles.tabButton,
            activeTab === 'random' && HomeStyles.activeTabButton
          ]}
          onPress={() => setActiveTab('random')}
        >
          <Text style={[
            HomeStyles.tabButtonText,
            activeTab === 'random' && HomeStyles.activeTabButtonText
          ]}>
            ランダム
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            HomeStyles.tabButton,
            activeTab === 'task' && HomeStyles.activeTabButton
          ]}
          onPress={() => setActiveTab('task')}
        >
          <Text style={[
            HomeStyles.tabButtonText,
            activeTab === 'task' && HomeStyles.activeTabButtonText
          ]}>
            タスク
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            HomeStyles.tabButton,
            activeTab === 'friend' && HomeStyles.activeTabButton
          ]}
          onPress={() => setActiveTab('friend')}
        >
          <Text style={[
            HomeStyles.tabButtonText,
            activeTab === 'friend' && HomeStyles.activeTabButtonText
          ]}>
            フレンド
          </Text>
        </TouchableOpacity>

      </View>

      {/* コンテンツエリア */}
      <View style={HomeStyles.contentArea}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}
