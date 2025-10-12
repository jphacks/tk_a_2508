import React, { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RandomStyles as styles } from './RandomScreen.styles';
import { FriendScreen } from '../Friend/FriendScreen';
import ProfileScreen from '../Profile/ProfileScreen';
import { Photo } from '../../services/photoService';
import { PhotoCard } from '../../components/PhotoCard';

const profileImage = { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop&crop=face' };

interface RandomScreenProps {
  isCameraOpen?: boolean;
  photos?: Photo[];
  loading?: boolean;
}

// ご指定の画像パス
const NEW_LOGO_PATH = '/home/junsei/tk_a_2508/assets/tyeki1.png';
const WAVE_SEPARATOR_PATH = '../../../assets/tyeki1.png'; 

export function RandomScreen({ isCameraOpen, photos = [], loading = false }: RandomScreenProps) {
  const navigation = useNavigation();
  const [active, setActive] = useState<'home' | 'friend'>('home');
  const screenWidth = Dimensions.get('window').width;

  const pillWidth = 200;
  const iconWrapWidth = 48;
  const pillInnerPadding = 6;
  const moveRange = (pillWidth - iconWrapWidth - pillInnerPadding) / 2;
  const indicatorX = useRef(new Animated.Value(active === 'home' ? -moveRange : moveRange)).current;
  const currentIndicatorX = useRef(active === 'home' ? -moveRange : moveRange);
  const iconWidth = 24;
  const indicatorWidth = 48;
  const pillCenter = pillWidth / 2;
  const leftIconLeft = pillCenter - moveRange - iconWidth / 2;
  const rightIconLeft = pillCenter + moveRange - iconNudge / 2; // Adjusting for icon positioning logic
  const iconNudge = 8;
  const leftIconPos = leftIconLeft + iconNudge;
  const rightIconPos = rightIconLeft - iconNudge;

  const scrollToPage = (index: number) => {
    const target = index === 0 ? -moveRange : moveRange;
    currentIndicatorX.current = target;
    Animated.spring(indicatorX, { 
      toValue: target, 
      useNativeDriver: true, 
      tension: 150, 
      friction: 8,
      overshootClamping: true 
    }).start();
    setActive(index === 0 ? 'home' : 'friend');
  };

  const indicatorScale = useRef(new Animated.Value(1)).current;
  const indicatorLift = useRef(new Animated.Value(0)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const rippleAnimsRef = useRef<Array<Animated.CompositeAnimation>>([]);
  const sideOffset = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      const { locationX, locationY } = evt.nativeEvent;
      const PILL_WIDTH = 200;
      const PILL_HEIGHT = 60;
      return locationX >= 0 && locationX <= PILL_WIDTH && locationY >= 0 && locationY <= PILL_HEIGHT;
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 18;
    },
    onPanResponderGrant: () => {
      Animated.parallel([
        Animated.spring(indicatorScale, { toValue: 1.06, useNativeDriver: true }),
        Animated.spring(indicatorLift, { toValue: -6, useNativeDriver: true }),
      ]).start();
      rippleAnimsRef.current.forEach(a => a.stop && a.stop());
      rippleAnimsRef.current = [];
      setTimeout(() => {
        const a1 = Animated.loop(Animated.timing(ripple1, { toValue: 1, duration: 900, useNativeDriver: true }));
        rippleAnimsRef.current.push(a1);
        a1.start();
      }, 0);
      setTimeout(() => {
        const a2 = Animated.loop(Animated.timing(ripple2, { toValue: 1, duration: 900, useNativeDriver: true }));
        rippleAnimsRef.current.push(a2);
        a2.start();
      }, 200);
      setTimeout(() => {
        const a3 = Animated.loop(Animated.timing(ripple3, { toValue: 1, duration: 900, useNativeDriver: true }));
        rippleAnimsRef.current.push(a3);
        a3.start();
      }, 400);
    },
    onPanResponderMove: (_, gestureState) => {
      const start = currentIndicatorX.current;
      const next = Math.max(-moveRange, Math.min(moveRange, start + gestureState.dx));
      indicatorX.setValue(next);
      currentIndicatorX.current = next;
      sideOffset.setValue(gestureState.dx >= 0 ? 14 : -14);
    },
    onPanResponderRelease: (_, gestureState) => {
      const dx = gestureState.dx;
      const current = currentIndicatorX.current;
      const threshold = 20;
      
      let target: number;
      
      if (dx > threshold) {
        target = moveRange;
      } else if (dx < -threshold) {
        target = -moveRange;
      } else {
        const distanceToLeft = Math.abs(current - (-moveRange));
        const distanceToRight = Math.abs(current - moveRange);
        target = distanceToLeft < distanceToRight ? -moveRange : moveRange;
      }
      currentIndicatorX.current = target;
      Animated.parallel([
        Animated.spring(indicatorX, { 
          toValue: target, 
          useNativeDriver: true, 
          tension: 150, 
          friction: 8,
          overshootClamping: true 
        }),
        Animated.spring(indicatorScale, { toValue: 1, useNativeDriver: true }),
        Animated.spring(indicatorLift, { toValue: 0, useNativeDriver: true }),
        Animated.spring(sideOffset, { toValue: 0, useNativeDriver: true }),
      ]).start();
      rippleAnimsRef.current.forEach(a => a.stop && a.stop());
      rippleAnimsRef.current = [];
      Animated.parallel([
        Animated.timing(ripple1, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(ripple2, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(ripple3, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      setActive(target === -moveRange ? 'home' : 'friend');
    },
  })).current;

  return (
    <View style={styles.container}>
      {/* 背景グラデーション: friend のときオレンジ系に切り替える */}
      <LinearGradient
        colors={active === 'friend'
          ? ['#ffdca8', '#ffb56b']
          : ['rgba(3, 160, 229, 1)', 'rgba(8, 110, 255, 1)', 'rgba(3, 160, 229, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      {/* ヘッダーエリア */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/material-symbols_person-add.png')} 
            style={styles.personAddIcon}
            resizeMode="contain"
          />
          {/* ご指定の画像パスに更新 */}
          <Image 
            source={{ uri: NEW_LOGO_PATH }} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* hide pill when camera overlay is open to avoid overlap */}
      {!isCameraOpen && (
        <View style={styles.pillWrap}>
          <View style={styles.pill}>
            {/* pill background layers that blend based on indicatorX */}
            <Animated.View style={[styles.pillBgLayer, { backgroundColor: '#0AA7E8', opacity: indicatorX.interpolate({ inputRange: [-moveRange, moveRange], outputRange: [1, 0], extrapolate: 'clamp' }) }]} />
            <Animated.View style={[styles.pillBgLayer, { backgroundColor: '#ffb56b', opacity: indicatorX.interpolate({ inputRange: [-moveRange, moveRange], outputRange: [0, 1], extrapolate: 'clamp' }) }]} />
            {/* original decorative gradient overlaid for texture */}
            <LinearGradient
              colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.pillGradient}
            />
          {/* Animated indicator (white circle) that moves left/right with scroll */}
          {/* ripples behind indicator */}
          <Animated.View
            style={[
              styles.ripple,
              {
                transform: [
                  { translateX: Animated.add(indicatorX, sideOffset) },
                  { scale: ripple1.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.2] }) },
                ],
                opacity: ripple1.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.ripple,
              {
                transform: [
                  { translateX: Animated.add(indicatorX, sideOffset) },
                  { scale: ripple2.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.6] }) },
                ],
                opacity: ripple2.interpolate({ inputRange: [0, 1], outputRange: [0, 0.32] }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.ripple,
              {
                transform: [
                  { translateX: Animated.add(indicatorX, sideOffset) },
                  { scale: ripple3.interpolate({ inputRange: [0, 1], outputRange: [0.6, 3.0] }) },
                ],
                opacity: ripple3.interpolate({ inputRange: [0, 1], outputRange: [0, 0.22] }),
              },
            ]}
          />

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.animatedIndicator,
              {
                transform: [
                  {
                    translateX: indicatorX,
                  },
                  { translateY: indicatorLift },
                  { scale: indicatorScale },
                ],
              },
            ]}
          >
            {/* background layers that blend based on drag position */}
            <Animated.View style={[styles.animatedIndicatorBg, { backgroundColor: '#1AA0E5', opacity: indicatorX.interpolate({ inputRange: [-moveRange, moveRange], outputRange: [1, 0], extrapolate: 'clamp' }) }]} />
            <Animated.View style={[styles.animatedIndicatorBg, { backgroundColor: '#ffb56b', opacity: indicatorX.interpolate({ inputRange: [-moveRange, moveRange], outputRange: [0, 1], extrapolate: 'clamp' }) }]} />

            <View style={styles.indicatorInner}>
              {/* Active icon image inside the white indicator - crossfade based on indicatorX */}
              <Animated.Image
                source={require('../../../assets/icon-home.png')}
                style={[
                  styles.indicatorIcon,
                  {
                    opacity: indicatorX.interpolate({ inputRange: [-moveRange, moveRange], outputRange: [1, 0], extrapolate: 'clamp' }),
                  },
                ]}
              />
              <Animated.Image
                source={require('../../../assets/icon-friend.png')}
                style={[
                  styles.indicatorIcon,
                  {
                    position: 'absolute',
                    opacity: indicatorX.interpolate({ inputRange: [-moveRange, moveRange], outputRange: [0, 1], extrapolate: 'clamp' }),
                  },
                ]}
              />
            </View>
          </Animated.View>
          {/* Tap handlers removed — drag-only control */}
          </View>
        </View>
      )}

      {/* ★ 波状のセパレーターをここに配置（ScrollViewの外で固定） */}
      {active === 'home' && (
        <View style={styles.waveSeparatorContainer}>
          <Image 
            // require() は静的な文字列リテラルを必要としますが、ここではトップレベルの定数を使用
            source={require(WAVE_SEPARATOR_PATH)} 
            style={styles.waveSeparatorImage} 
          />
          {/* 点線を追加 - styles.dotLine の定義がないため一時的にコメントアウト */}
          {/* <View style={styles.dotLine} /> */}
        </View>
      )}

      {/* メインコンテンツエリア */}
      {active === 'home' ? (
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { 
            // 固定されたセパレーターの高さとマージンに合わせて padding を調整
            paddingTop: 40, // 以前の padding: 20 + 新しいセパレーターの高さ（例: 20px）を考慮して調整が必要
          }]} 
          showsVerticalScrollIndicator={false} 
          nestedScrollEnabled={true} 
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: 'transparent', width: '100%' }}
        >
          <View style={styles.contentArea}>
            {/* 写真カードのセクション（PhotoCard を使って縦リスト表示） */}
            <View style={styles.photosScroll}>
              {loading ? (
                <Text style={styles.loadingText}>読み込み中...</Text>
              ) : photos.length > 0 ? (
                photos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))
              ) : (
                <Text style={styles.emptyText}>まだ写真がありません</Text>
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={{ width: '100%' }}>
          <FriendScreen />
        </View>
      )}

      {/* プロフィール画像（右下固定） - カメラ開いてるときは隠す */}
      {!isCameraOpen && (
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile' as never)}>
          <Image source={profileImage} style={styles.profileButtonImage} />
        </TouchableOpacity>
      )}
    </View>
  );
}