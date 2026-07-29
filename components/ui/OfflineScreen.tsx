import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Spacing, Radius } from '@/constants/theme';

type OfflineScreenProps = {
  onRetry: () => Promise<boolean>;
};

export function OfflineScreen({ onRetry }: OfflineScreenProps) {
  const [checking, setChecking] = useState(false);

  const handleRetry = async () => {
    if (checking) return;
    setChecking(true);
    // Simulate a brief delay to feel responsive/accurate
    await new Promise((resolve) => setTimeout(resolve, 800));
    await onRetry();
    setChecking(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Modern high-fidelity SVG illustration */}
        <View style={styles.illustrationContainer}>
          <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
            <Defs>
              <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                <Stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.02} />
              </LinearGradient>
              <LinearGradient id="gradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#94a3b8" />
                <Stop offset="100%" stopColor="#475569" />
              </LinearGradient>
              <LinearGradient id="gradWarning" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ef4444" />
                <Stop offset="100%" stopColor="#b91c1c" />
              </LinearGradient>
            </Defs>

            {/* Background Decorative Circles */}
            <Circle cx={100} cy={100} r={80} fill="url(#grad1)" />
            <Circle cx={100} cy={100} r={60} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />

            {/* Outer Wi-Fi Arc 1 */}
            <Path
              d="M60 70 A 55 55 0 0 1 140 70"
              stroke="#cbd5e1"
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* Wi-Fi Arc 2 */}
            <Path
              d="M75 90 A 35 35 0 0 1 125 90"
              stroke="#94a3b8"
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* Wi-Fi Arc 3 */}
            <Path
              d="M90 110 A 15 15 0 0 1 110 110"
              stroke="url(#gradIcon)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            
            {/* Central Circle */}
            <Circle cx={100} cy={125} r={5} fill="#475569" />

            {/* Disconnect Slash */}
            <Path
              d="M50 50 L150 150"
              stroke="url(#gradWarning)"
              strokeWidth={5}
              strokeLinecap="round"
            />

            {/* Warning Shield Badge */}
            <Circle cx={150} cy={70} r={16} fill="#fee2e2" />
            <Path
              d="M150 63 L150 71"
              stroke="#ef4444"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <Circle cx={150} cy={76} r={1.25} fill="#ef4444" />
          </Svg>
        </View>

        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.subtitle}>
          {"We couldn't connect to the server. Please check your network settings and try again."}
        </Text>

        <TouchableOpacity
          style={[styles.button, checking && styles.buttonDisabled]}
          onPress={handleRetry}
          disabled={checking}
          activeOpacity={0.8}
        >
          {checking ? (
            <View style={styles.row}>
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Checking...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Retry Connection</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    maxWidth: 400,
  },
  illustrationContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: Radius.md,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
