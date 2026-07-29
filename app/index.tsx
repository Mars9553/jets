import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { AppColors, Radius, Spacing, Shadow } from '@/constants/theme';

export default function LandingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/user_notice');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <SafeAreaView style={nativeStyles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={nativeStyles.loadingContainer}>
          <Text style={nativeStyles.loadingText}>Loading portal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={nativeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <View style={nativeStyles.nativeContent}>
        <View style={nativeStyles.brandBlock}>
          <View style={nativeStyles.iconBg}>
            <Text style={nativeStyles.iconText}>🔔</Text>
          </View>
          <Text style={nativeStyles.nativeLogo}>Digital Bulletin Board</Text>
          <Text style={nativeStyles.nativeTagline}>Campus notices & events</Text>
        </View>

        <View style={nativeStyles.card}>
          <Text style={nativeStyles.cardTitle}>Welcome to E-Board</Text>
          <Text style={nativeStyles.cardDesc}>
            The official portal for all campus notices, memos, lectures, and upcoming student events.
          </Text>

          <TouchableOpacity
            style={nativeStyles.primaryButton}
            onPress={() => router.push('/(auth)/' as any)}
            activeOpacity={0.85}
          >
            <Text style={nativeStyles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const nativeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: AppColors.textMuted,
  },
  nativeContent: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 1.5,
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  iconText: {
    fontSize: 32,
  },
  nativeLogo: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.text,
  },
  nativeTagline: {
    fontSize: 14,
    color: AppColors.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: AppColors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    alignItems: 'center',
    ...Shadow.card,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textSecondary,
    marginBottom: Spacing.sm,
  },
  cardDesc: {
    fontSize: 14,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: Radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: AppColors.surface,
    fontWeight: '600',
    fontSize: 15,
  },
});
