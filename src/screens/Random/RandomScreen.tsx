
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RandomStyles } from './RandomScreen.styles';
import { supabase } from '../../lib/supabase';
import { FriendScreen } from '../Friend/FriendScreen';
import ProfileScreen from '../Profile/ProfileScreen';

const sampleImage = { uri: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80&auto=format&fit=crop' };
const profileImage = { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop&crop=face' };

type Photo = {
  id: string;
  url: string; // public URL
  user_id?: string;
  created_at?: string;
};

export function RandomScreen() {
  const [active, setActive] = useState<'home' | 'friend'>('home');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const screenWidth = Dimensions.get('window').width;

  // Animated value tracking horizontal scroll position
  const pillWidth = 200; // should match styles
  const iconWrapWidth = 48;
  const pillInnerPadding = 6; // left+right padding inside pill (approx)
  const moveRange = (pillWidth - iconWrapWidth - pillInnerPadding) / 2; // distance from center to left/right
  // Animated value tracking indicator position (in pixels, -moveRange..moveRange)
  const indicatorX = useRef(new Animated.Value(active === 'home' ? -moveRange : moveRange)).current;
  const currentIndicatorX = useRef(active === 'home' ? -moveRange : moveRange);
  const iconWidth = 24;
  const indicatorWidth = 48;
  const pillCenter = pillWidth / 2;
  const leftIconLeft = pillCenter - moveRange - iconWidth / 2;
  const rightIconLeft = pillCenter + moveRange - iconWidth / 2;
  const iconNudge = 8; // pixels to nudge icons inward to avoid touching indicator
  const leftIconPos = leftIconLeft + iconNudge;
  const rightIconPos = rightIconLeft - iconNudge;

  const scrollToPage = (index: number) => {
    const target = index === 0 ? -moveRange : moveRange;
    // animate indicator to the target with improved spring animation
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

  // Fetch initial photos and subscribe to realtime INSERTs
  useEffect(() => {
    let isMounted = true;

    const sortPhotos = (list: Photo[], currentUserId?: string) => {
      return list.sort((a, b) => {
        // put current user's photos first
        if (currentUserId) {
          const aIsMine = a.user_id === currentUserId ? 1 : 0;
          const bIsMine = b.user_id === currentUserId ? 1 : 0;
          if (aIsMine !== bIsMine) return bIsMine - aIsMine; // mine first
        }
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime; // newest first
      });
    };

    const load = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        // Assume a table 'photos' with columns id, url, user_id, created_at
        const { data, error } = await supabase
          .from('photos')
          .select('id, url, user_id, created_at')
          .order('created_at', { ascending: false });
        if (error) {
          console.warn('supabase fetch photos error', error);
        } else if (isMounted && data) {
          setPhotos(sortPhotos([...data], userId));
        }

        // subscribe to new photos
        // Realtime subscription using Realtime v2: create a channel
        const channel = supabase.channel('public:photos')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos' }, (payload: any) => {
            const newPhoto: Photo = payload.new as Photo;
            setPhotos((prev) => {
              const exists = prev.find((p) => p.id === newPhoto.id);
              const merged = exists ? prev.map((p) => (p.id === newPhoto.id ? newPhoto : p)) : [newPhoto, ...prev];
              return sortPhotos(merged, userId);
            });
          })
          .subscribe();

        return () => {
          isMounted = false;
          try {
            // unsubscribe (safe-guard for different supabase versions)
            try {
              channel.unsubscribe();
            } catch (e) {
              // ignore
            }
          } catch (e) {
            // ignore
          }
        };
      } catch (e) {
        console.warn('error loading photos', e);
      }
    };

    const unsubPromise = load();

    return () => {
      // if load returned cleanup, call it
      Promise.resolve(unsubPromise).then((cleanup: any) => cleanup && cleanup());
    };
  }, []);

  // We will not use horizontal paging scroll; render pages conditionally below

  // Add visual effect values for dragging
  const indicatorScale = useRef(new Animated.Value(1)).current;
  const indicatorLift = useRef(new Animated.Value(0)).current; // translateY
  // ripple values for wave effect
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const rippleAnimsRef = useRef<Array<Animated.CompositeAnimation>>([]);
  // side offset to bias ripples toward drag direction (positive = right)
  const sideOffset = useRef(new Animated.Value(0)).current;

  // PanResponder to allow strict swipes on the indicator itself (drag-only)
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      // 手動で範囲を指定（現在: 200x60px）
      const { locationX, locationY } = evt.nativeEvent;
      const PILL_WIDTH = 200;   // ピルボタンの幅
      const PILL_HEIGHT = 60;   // ピルボタンの高さ
      return locationX >= 0 && locationX <= PILL_WIDTH && locationY >= 0 && locationY <= PILL_HEIGHT;
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // 横方向の移動が縦方向より大きい場合のみ反応
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderGrant: () => {
      // lift and slightly scale indicator for feedback
      Animated.parallel([
        Animated.spring(indicatorScale, { toValue: 1.06, useNativeDriver: true }),
        Animated.spring(indicatorLift, { toValue: -6, useNativeDriver: true }),
      ]).start();
      // start ripple loops with slight stagger
      // ensure previous anim refs cleared
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
      // リアルタイムでインジケーターを移動させるが、範囲内に制限
      const start = currentIndicatorX.current;
      const next = Math.max(-moveRange, Math.min(moveRange, start + gestureState.dx));
      indicatorX.setValue(next);
      currentIndicatorX.current = next;
      // bias ripples toward movement direction
      sideOffset.setValue(gestureState.dx >= 0 ? 14 : -14);
    },
    onPanResponderRelease: (_, gestureState) => {
      const dx = gestureState.dx;
      const current = currentIndicatorX.current;
      const threshold = 8; // px - より敏感に
      
      let target: number;
      
      // 移動距離が閾値以上の場合、移動方向に切り替え
      if (dx > threshold) {
        target = moveRange; // to friend (right)
      } else if (dx < -threshold) {
        target = -moveRange; // to home (left)
      } else {
        // 移動距離が少ない場合、現在位置に基づいて最も近い位置に切り替え
        const distanceToLeft = Math.abs(current - (-moveRange));
        const distanceToRight = Math.abs(current - moveRange);
        target = distanceToLeft < distanceToRight ? -moveRange : moveRange;
      }
      // animate indicator to target and revert lift/scale, stop ripples
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
      // stop ripple loops and fade values out
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
    <View style={RandomStyles.container}>
      {/* 背景グラデーション */}
      <LinearGradient
        colors={['rgba(3, 160, 229, 1)', 'rgba(8, 110, 255, 1)', 'rgba(3, 160, 229, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={RandomStyles.backgroundGradient}
      />
      
      <ScrollView 
        contentContainerStyle={RandomStyles.scrollContent} 
        showsVerticalScrollIndicator={false} 
        nestedScrollEnabled={true} 
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* ヘッダーエリア */}
        <View style={RandomStyles.header}>
          <View style={RandomStyles.logoContainer}>
            <Image 
              source={require('../../../assets/images/material-symbols_person-add.png')} 
              style={RandomStyles.personAddIcon}
              resizeMode="contain"
            />
            <Image 
              source={require('../../../assets/Group 1000006493.png')} 
              style={RandomStyles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={RandomStyles.pillWrap}>
          <View style={RandomStyles.pill}>
            {/* ピルボタンの背景グラデーション */}
            <LinearGradient
              colors={['rgba(10, 172, 228, 1)', 'rgba(11, 110, 221, 1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={RandomStyles.pillGradient}
            />
            {/* Animated indicator (white circle) that moves left/right with scroll */}
            {/* ripples behind indicator */}
            <Animated.View
              style={[
                RandomStyles.ripple,
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
                RandomStyles.ripple,
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
                RandomStyles.ripple,
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
                RandomStyles.animatedIndicator,
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
              {/* Active icon image inside the white indicator - crossfade based on indicatorX */}
              <Animated.Image
                source={require('../../../assets/icon-home.png')}
                style={[
                  RandomStyles.indicatorIcon,
                  {
                    opacity: indicatorX.interpolate({ inputRange: [-moveRange, moveRange], outputRange: [1, 0], extrapolate: 'clamp' }),
                  },
                ]}
              />
              <Animated.Image
                source={require('../../../assets/icon-friend.png')}
                style={[
                  RandomStyles.indicatorIcon,
                  {
                    position: 'absolute',
                    opacity: indicatorX.interpolate({ inputRange: [-moveRange, moveRange], outputRange: [0, 1], extrapolate: 'clamp' }),
                  },
                ]}
              />
            </Animated.View>
            {/* Tap handlers removed — drag-only control */}
          </View>
        </View>

        {/* メインコンテンツエリア */}
        {active === 'home' ? (
          <View style={RandomStyles.contentArea}>
            <View style={RandomStyles.mainCard}>
              <View style={RandomStyles.cardHeader}>
                <Text style={RandomStyles.cardTitle}>今日のタスク</Text>
                <Text style={RandomStyles.cardSubtitle}>新しいチャレンジを始めましょう！</Text>
              </View>
              <View style={RandomStyles.cardContent}>
                {/* show latest photo (photos[0]) if exists, else fallback to sampleImage */}
                <Image source={photos[0] ? { uri: photos[0].url } : sampleImage} style={RandomStyles.cardImage} />
                <TouchableOpacity style={RandomStyles.cardButton}>
                  <Text style={RandomStyles.cardButtonText}>開始する</Text>
                </TouchableOpacity>
              </View>

              {/* thumbnail strip */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }} contentContainerStyle={{ paddingHorizontal: 12 }}>
                {photos.map((p) => (
                  <TouchableOpacity key={p.id} onPress={() => { /* open or focus logic */ }} style={{ marginRight: 8 }}>
                    <Image source={{ uri: p.url }} style={{ width: 64, height: 64, borderRadius: 8 }} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        ) : (
          <View style={{ width: screenWidth }}>
            <FriendScreen />
          </View>
        )}
        
        {/* プロフィール画像（右下固定） */}
        <TouchableOpacity style={RandomStyles.profileButton}>
          <Image source={profileImage} style={RandomStyles.profileButtonImage} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
