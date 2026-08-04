import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing } from '@/constants/theme';

type Ring = {
  id: number;
  scale: Animated.Value;
  opacity: Animated.Value;
};

type LoadingScreenProps = {
  message?: string;
};

export function LoadingScreen({ message = 'Loading portal...' }: LoadingScreenProps) {
  const { colors, resolvedTheme } = useTheme();
  const badgeScale = useRef(new Animated.Value(1)).current;
  const [rings, setRings] = useState<Ring[]>([]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.spring(badgeScale, { toValue: 1.7, friction: 3, useNativeDriver: true }),
        Animated.spring(badgeScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]),
      { iterations: -1 }
    );
    loop.start();
    return () => loop.stop();
  }, [badgeScale]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const scale = new Animated.Value(0.3);
      const opacity = new Animated.Value(0.7);
      setRings((prev) => [...prev, { id, scale, opacity }]);
      Animated.parallel([
        Animated.timing(scale, { toValue: 5, duration: 1800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]).start(() => {
        setRings((prev) => prev.filter((r) => r.id !== id));
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.center}>
        <Svg style={styles.halo} width={220} height={220} viewBox="0 0 220 220" fill="none">
          <Defs>
            <LinearGradient id="loadingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.primaryLight} stopOpacity={0.45} />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity={0.1} />
            </LinearGradient>
          </Defs>
          <Circle cx={110} cy={110} r={95} fill="url(#loadingGrad)" />
        </Svg>

        <View style={styles.bellRow}>
          <View style={styles.bell}>
            <MaterialIcons name="notifications" size={88} color={colors.primary} />
            <Animated.View
              style={[
                styles.badge,
                { backgroundColor: colors.primary, transform: [{ scale: badgeScale }] },
              ]}
            />
          </View>

          {rings.map((ring) => (
            <Animated.View
              key={ring.id}
              style={[
                styles.ring,
                {
                  borderColor: colors.primary,
                  opacity: ring.opacity,
                  transform: [{ scale: ring.scale }],
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.brand}>
          <Text style={[styles.brandName, { color: colors.text }]}>Digital Bulletin Board</Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>Campus notices & events</Text>
        </View>

        <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  halo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -110 }, { translateY: -110 }],
  },
  bellRow: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 116,
    height: 116,
    marginBottom: Spacing.xl,
  },
  bell: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  ring: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  brand: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.25,
    marginBottom: 2,
  },
  tagline: {
    fontSize: 13,
    letterSpacing: 0.25,
  },
  message: {
    fontSize: 15,
    marginTop: Spacing.sm,
  },
});