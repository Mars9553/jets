import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { X, Share, Smartphone, Monitor, Check } from 'lucide-react-native';
import { Radius, Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type InstallModalProps = {
  visible: boolean;
  onClose: () => void;
};

type DeviceType = 'ios' | 'android' | 'desktop';

function getDeviceType(): DeviceType {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    return 'ios';
  }
  if (ua.includes('android')) {
    return 'android';
  }
  return 'desktop';
}

const IOS_STEPS = [
  {
    text: 'Open E-Board in Safari or Chrome on your iPhone/iPad',
  },
  {
    text: 'Tap the Share button (the square with an upward arrow)',
  },
  {
    text: 'Scroll down and tap "Add to Home Screen"',
  },
  {
    text: 'Tap "Add" in the top-right corner',
  },
];

const ANDROID_STEPS = [
  {
    text: 'Open E-Board in Chrome on your Android phone',
  },
  {
    text: 'Tap the three dots menu (⋮) in the bottom-right corner',
  },
  {
    text: 'Tap "Add to Home screen" or "Install app"',
  },
  {
    text: 'Tap "Add" to confirm',
  },
];

const DESKTOP_STEPS = [
  {
    text: 'You should see an install banner — click "Install" on it',
  },
  {
    text: 'If no banner appears, click the install icon in your browser\'s address bar',
  },
  {
    text: 'Or open Chrome menu (⋮) → "Install E-Board"',
  },
  {
    text: 'Click "Install" to confirm',
  },
];

const STEP_ICONS = {
  ios: Share,
  android: Smartphone,
  desktop: Monitor,
};

export function InstallInstructionsModal({ visible, onClose }: InstallModalProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);

  if (!visible) return null;

  const steps = deviceType === 'ios' ? IOS_STEPS : deviceType === 'android' ? ANDROID_STEPS : DESKTOP_STEPS;
  const Icon = STEP_ICONS[deviceType];
  const deviceLabel = deviceType === 'ios' ? 'iPhone/iPad' : deviceType === 'android' ? 'Android' : 'Desktop';

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
              <Icon size={22} color="#2563eb" />
            </View>
            <Text style={styles.title}>Install E-Board</Text>
          </View>
          <Text style={styles.subtitle}>Detected: {deviceLabel}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepText}>{step.text}</Text>
                {i < steps.length - 1 && <View style={styles.stepDivider} />}
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.installButton, { backgroundColor: '#2563eb' }]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Check size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.installButtonText}>Got it!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...Platform.select({
      web: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      },
      default: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      },
    })!,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    width: Math.min(SCREEN_WIDTH * 0.92, 460),
    maxHeight: '75%',
    ...Platform.select({
      web: {
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
      default: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.25,
        shadowRadius: 50,
        elevation: 10,
      },
    })!,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 52,
  },
  closeButton: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
    flexShrink: 0,
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  stepDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginTop: 8,
    marginLeft: -22,
    width: 'calc(100% + 22px)',
  },
  installButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
  },
  installButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
