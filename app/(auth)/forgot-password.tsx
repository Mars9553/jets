import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { AuthScreen, AuthCardHeader } from '@/components/auth/AuthScreen';
import { AuthField } from '@/components/auth/AuthField';
import { authStyles as styles } from '@/styles/authStyles';
import { AppColors } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';

// MAT number format: DE.YYYY/NNNN  e.g. DE.2021/5628
const MAT_REGEX = /^DE\.\d{4}\/\d{4}$/i;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [matNumber, setMatNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleReset = () => {
    if (!matNumber.trim()) {
      setErrors({ matNumber: 'MAT number is required' });
      return;
    }
    if (!MAT_REGEX.test(matNumber.trim())) {
      setErrors({ matNumber: 'Invalid format — use DE.YYYY/NNNN (e.g. DE.2021/5628)' });
      return;
    }

    setErrors({});
    showToast('If an account exists for this MAT number, you will receive reset instructions shortly.', 'success');
    router.replace('/');
  };


  return (
    <AuthScreen>
      <View style={styles.card}>
        <AuthCardHeader
          title="Reset password"
          subtitle="Enter your MAT number and we'll email you reset instructions."
        />

        <AuthField
          label="MAT Number"
          placeholder="e.g. DE.2000/1234"
          value={matNumber}
          onChangeText={(val) => {
            setMatNumber(val);
            setErrors((prev) => ({ ...prev, matNumber: '' }));
          }}
          autoCapitalize="none"
          error={errors.matNumber}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleReset} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Send reset link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={14} color={AppColors.primary} />
          <Text style={styles.linkText}>Back to sign in</Text>
        </TouchableOpacity>
      </View>
    </AuthScreen>
  );
}

