import React, { useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react-native';
import { Radius, Spacing } from '@/constants/theme';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onDismiss: (id: string) => void;
}

export function Toast({ id, message, type, onDismiss }: ToastProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();

    const timer = setTimeout(() => {
      dismiss();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => onDismiss(id));
  };

  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#f0fdf4',
          border: '#dcfce7',
          text: '#166534',
          icon: <CheckCircle size={18} color="#16a34a" />,
        };
      case 'error':
        return {
          bg: '#fef2f2',
          border: '#fee2e2',
          text: '#991b1b',
          icon: <AlertTriangle size={18} color="#dc2626" />,
        };
      case 'info':
      default:
        return {
          bg: '#eff6ff',
          border: '#dbeafe',
          text: '#1e40af',
          icon: <Info size={18} color="#2563eb" />,
        };
    }
  };

  const theme = getTheme();

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      {theme.icon}
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      <TouchableOpacity onPress={dismiss} style={styles.closeButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <X size={16} color={theme.text} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    maxWidth: 500,
    alignSelf: 'center',
    width: Platform.OS === 'web' ? '90%' : 'auto',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    marginRight: 6,
    lineHeight: 18,
  },
  closeButton: {
    padding: 2,
    marginLeft: 4,
  },
});
