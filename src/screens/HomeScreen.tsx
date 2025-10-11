import React from 'react';
import { SafeAreaView } from 'react-native';
import { commonStyles } from '../styles/common';
import { RandomScreen } from './Random/RandomScreen';

export function HomeScreen() {
  return (
    <SafeAreaView style={commonStyles.container}>
      <RandomScreen />
    </SafeAreaView>
  );
}
