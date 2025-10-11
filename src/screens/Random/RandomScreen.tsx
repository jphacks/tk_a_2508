import React, { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { RandomStyles } from './RandomScreen.styles';
import { FriendScreen } from '../Friend/FriendScreen';

const sampleImage = { uri: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80&auto=format&fit=crop' };
const profileImage = { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop&crop=face' };

export function RandomScreen() {
  const [active, setActive] = useState<'home' | 'friend'>('home');
  const screenWidth = Dimensions.get('window').width;

  // Animated value tracking horizontal scroll position
  const pillWidth = 170; // should match styles
  const iconWrapWidth = 48;
  const pillInnerPadding = 8; // left+right padding inside pill (approx)
  const moveRange = (pillWidth - iconWrapWidth - pillInnerPadding) / 2; // distance from center to left/right
  // Animated value tracking indicator position (in pixels, -moveRange..moveRange)
  const indicatorX = useRef(new Animated.Value(active === 'home' ? -moveRange : moveRange)).current;
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
    // animate indicator to the target
    Animated.spring(indicatorX, { toValue: target, useNativeDriver: true, tension: 120, friction: 12 }).start();
    setActive(index === 0 ? 'home' : 'friend');
  };

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
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 5,
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
      const start = indicatorX.__getValue();
      const next = Math.max(-moveRange, Math.min(moveRange, start + gestureState.dx));
      indicatorX.setValue(next);
      // bias ripples toward movement direction
      sideOffset.setValue(gestureState.dx >= 0 ? 14 : -14);
    },
    onPanResponderRelease: (_, gestureState) => {
      const dx = gestureState.dx;
      const threshold = 12; // px
      let target = indicatorX.__getValue();
      if (dx > threshold) {
        target = moveRange; // to friend (right)
      } else if (dx < -threshold) {
        target = -moveRange; // to home (left)
      } else {
        const current = indicatorX.__getValue();
        target = Math.abs(current - (-moveRange)) < Math.abs(current - moveRange) ? -moveRange : moveRange;
      }
      // animate indicator to target and revert lift/scale, stop ripples
      Animated.parallel([
        Animated.spring(indicatorX, { toValue: target, useNativeDriver: true, tension: 120, friction: 12 }),
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
      <ScrollView contentContainerStyle={RandomStyles.scrollContent} showsVerticalScrollIndicator={false} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
        <View style={RandomStyles.header}>
          <Image source={require('../../../assets/logo-header.png')} style={RandomStyles.logoImage} />
          <Image source={profileImage} style={RandomStyles.headerAvatar} />
        </View>

        <View style={RandomStyles.pillWrap}>
          <View
            style={[
              RandomStyles.pill,
              active === 'friend' && RandomStyles.pillFriendBackground,
            ]}
          >
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

        {/* ページングは無効化。インジケータの状態で表示を切替 */}
        {active === 'home' ? (
          <View style={{ width: screenWidth }}>
            <View style={RandomStyles.sectionShadow}>
              <View style={RandomStyles.waveTop} />
              <View style={RandomStyles.card}>
                <Image source={sampleImage} style={RandomStyles.cardImage} accessibilityLabel="feature image" />
              </View>
              <View style={RandomStyles.waveBottom} />
            </View>

            <View style={RandomStyles.profileCard}>
              <Image source={profileImage} style={RandomStyles.smallAvatar} accessibilityLabel="profile avatar" />
              <View style={RandomStyles.profileImageWrap}>
                <Image source={sampleImage} style={RandomStyles.profileImage} accessibilityLabel="profile image" />
              </View>
            </View>
          </View>
        ) : (
          <View style={{ width: screenWidth }}>
            <FriendScreen />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
