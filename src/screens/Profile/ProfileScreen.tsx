import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Dimensions,
  SafeAreaView 
} from 'react-native';

import { Ionicons, FontAwesome } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 

const { width } = Dimensions.get('window');
const GALLERY_MARGIN = 5;
const GALLERY_COLUMNS = 3;
const GALLERY_SIZE = (width - 40 - (GALLERY_MARGIN * 2 * GALLERY_COLUMNS)) / GALLERY_COLUMNS; 

const COLOR_BLUE = '#42A5F5';
const COLOR_ORANGE = '#FFA726';
const COLOR_BG = '#e6f0ff'; 

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    name: 'Lazy太郎',
    status: 'TOEICに向けて勉強中！！',
    avatarUrl: 'https://via.placeholder.com/150/42A5F5/FFFFFF?text=P',
    friends: 64,
    posts: 105,
  });

  const [activeFilter, setActiveFilter] = useState<'random' | 'task'>('random'); 

  const taskImages = Array(9).fill(null).map((_, i) => ({
    id: i,
    uri: 'https://via.placeholder.com/200x200?text=Study', 
    date: '2025.10.11',
  }));

  const handleStatusEdit = () => {
    Alert.prompt(
      'ステータスを編集',
      '新しいステータスを入力してください',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'OK',
          onPress: (newStatus: string | undefined) => { 
            if (newStatus) { 
              setProfile(prevProfile => ({ 
                ...prevProfile,
                status: newStatus,
              }));
            }
          },
        },
      ],
      'plain-text',
      profile.status
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.appName}>Lazy*Busters</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* プロフィールカード */}
          <View style={styles.profileCard}>
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} /> 
            <Text style={styles.userName}>{profile.name}</Text>
            
            <TouchableOpacity onPress={handleStatusEdit}>
              <Text style={styles.statusMessage}>{profile.status}</Text> 
            </TouchableOpacity>
            
            {/* 設定アイコン */}
            <TouchableOpacity style={styles.settingsIcon}>
              <Ionicons name="settings-outline" size={24} color="#888" />
            </TouchableOpacity>

            {/* 統計情報 */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <FontAwesome name="users" size={20} color="#666" />
                <Text style={styles.statValue}>{profile.friends}</Text> 
                <Text style={styles.statLabel}>Friends</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome name="file-text-o" size={20} color="#666" />
                <Text style={styles.statValue}>{profile.posts}</Text>
                <Text style={styles.statLabel}>投稿</Text>
              </View>
            </View>
          </View>

          {/* タスクフィルターボタン */}
          <View style={styles.filterButtons}>
            {/* ランダムボタン */}
            <TouchableOpacity 
              onPress={() => setActiveFilter('random')}
              style={[
                styles.filterButton, 
                activeFilter === 'random' ? styles.filterButtonBlueActive : styles.filterButtonInactive
              ]}
            >
              <Text style={[
                styles.filterButtonText, 
                activeFilter !== 'random' && { color: '#666' } 
              ]}>ランダム</Text>
            </TouchableOpacity>
            
            {/* タスクボタン */}
            <TouchableOpacity 
              onPress={() => setActiveFilter('task')}
              style={[
                styles.filterButton, 
                activeFilter === 'task' ? styles.filterButtonOrangeActive : styles.filterButtonInactive
              ]}
            >
              <Text style={[
                styles.filterButtonText, 
                activeFilter !== 'task' && { color: '#666' }
              ]}>タスク</Text>
            </TouchableOpacity>
          </View>

          {/* タスク履歴ギャラリー */}
          <View style={styles.taskGallery}>
            {taskImages.map(task => (
              <View key={task.id} style={styles.taskImageContainer}>
                <Image source={{ uri: task.uri }} style={styles.taskImage} />
                <Text style={styles.taskImageDate}>{task.date}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// StyleSheetの定義はProfileScreen関数の外側に必要です
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  backgroundContainer: {
    flex: 1,
    backgroundColor: COLOR_BG, 
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: { padding: 5 },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR_BLUE, 
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20, 
    padding: 20,
    marginTop: 20,
    width: '95%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLOR_BLUE, 
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statusMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textDecorationLine: 'underline', 
  },
  settingsIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },

  filterButtons: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 15,
    width: '95%',
    justifyContent: 'center',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: '#fff', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonBlueActive: {
    backgroundColor: COLOR_BLUE, 
    shadowOpacity: 0.2,
    elevation: 5,
  },
  filterButtonOrangeActive: {
    backgroundColor: COLOR_ORANGE,
    shadowOpacity: 0.2,
    elevation: 5,
  },
  filterButtonInactive: {
    backgroundColor: '#f0f0f0', 
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', 
  },
  
  taskGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
    width: '100%',
  },
  taskImageContainer: {
    margin: GALLERY_MARGIN,
    width: GALLERY_SIZE,
    alignItems: 'center',
  },
  taskImage: {
    width: GALLERY_SIZE,
    height: GALLERY_SIZE,
    borderRadius: 10, 
    backgroundColor: '#ddd',
  },
  taskImageDate: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
});

export default ProfileScreen;