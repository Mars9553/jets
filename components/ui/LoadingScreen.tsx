import React, { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { Radius, Spacing } from '@/constants/theme';

type LoadingScreenProps = {
  message?: string;
};

const BAR_COUNT = 5;

export function LoadingScreen({ message = 'Loading portal...' }: LoadingScreenProps) {
  const { colors, resolvedTheme } = useTheme();
  const anims = useRef(Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.3))).current;
  const loopsRef = useRef<Animated.CompositeAnimation[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    loopsRef.current = [];
    timeoutsRef.current = [];
    anims.forEach((anim, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 550, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 550, useNativeDriver: true }),
        ])
      );
      const t = setTimeout(() => loop.start(), i * 150);
      timeoutsRef.current.push(t);
      loopsRef.current.push(loop);
    });
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      loopsRef.current.forEach((l) => l.stop());
    };
  }, [anims]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.center}>
        <MaterialIcons name="notifications" size={48} color={colors.primary} style={styles.icon} />
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.bars}>
            {anims.map((anim, i) => (
              <Animated.View
                key={i}
                style={[styles.bar, { backgroundColor: colors.primary, transform: [{ scaleY: anim }] }]}
              />
            ))}
          </View>
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
    gap: Spacing.sm,
  },
  icon: {
    marginBottom: 2,
  },
  card: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 50,
  },
  bar: {
    width: 8,
    height: 50,
    borderRadius: 4,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
});