import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreen, AuthCardHeader, AuthErrorBanner } from '@/components/auth/AuthScreen';
import { AuthField } from '@/components/auth/AuthField';
import { authStyles as styles } from '@/styles/authStyles';
import { api } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { subscribeUserToPush } from '@/lib/notifications';

// MAT number format: DE.YYYY/NNNN  e.g. DE.2021/5628
const MAT_REGEX = /^DE\.\d{4}\/\d{4}$/i;

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [matNumber, setMatNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const handleLogin = async () => {
    const newErrors: Record<string, string> = {};

    if (!matNumber.trim()) {
      newErrors.matNumber = 'MAT number is required';
    } else if (!MAT_REGEX.test(matNumber.trim())) {
      newErrors.matNumber = 'Invalid format — use DE.YYYY/NNNN (e.g. DE.2021/5628)';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError('');
      return;
    }

    setErrors({});
    setFormError('');
    setSubmitting(true);
    try {
      const user = await api.login(matNumber.toUpperCase(), password);
      await setUser(user);
      if (Platform.OS === 'web') {
        subscribeUserToPush(user.userId);
      }
      router.replace('/user_notice');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <AuthScreen>
      <View style={styles.card}>
        <AuthCardHeader
          title="Sign in"
          subtitle="Enter your credentials to access the bulletin board."
        />

        <AuthErrorBanner message={formError} />

        <AuthField
          label="MAT Number"
          placeholder="e.g. DE.2000/1234"
          value={matNumber}
          onChangeText={(val) => {
            setMatNumber(val);
            setErrors((prev) => ({ ...prev, matNumber: '' }));
          }}
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.matNumber}
        />

        <AuthField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setErrors((prev) => ({ ...prev, password: '' }));
          }}
          secureToggle
          error={errors.password}
        />

        <View style={styles.rememberRow}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, submitting && { opacity: 0.7 }]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>{submitting ? 'Signing in...' : 'Sign in'}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>No account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.linkText}>Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScreen>
  );
}

