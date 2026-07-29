import { ReactNode } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Bell, AlertCircle } from 'lucide-react-native';
import { authStyles as styles } from '@/styles/authStyles';
import { AppColors } from '@/constants/theme';

type AuthScreenProps = {
  children: ReactNode;
};

export function AuthBrand() {
  return (
    <View style={styles.brandBlock}>
      <View style={styles.brandIcon}>
        <Bell size={22} color={AppColors.surface} strokeWidth={2.2} />
      </View>
      <Text style={styles.brandTitle}>Digital Bulletin Board</Text>
      <Text style={styles.brandTagline}>Campus notices & events</Text>
    </View>
  );
}

export function AuthScreen({ children }: AuthScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthBrand />
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthCardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.cardHeader}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

export function AuthErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View style={localStyles.bannerContainer}>
      <AlertCircle size={16} color="#ef4444" />
      <Text style={localStyles.bannerText}>{message}</Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  bannerText: {
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});
