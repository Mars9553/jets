import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { AuthScreen, AuthCardHeader, AuthErrorBanner } from '@/components/auth/AuthScreen';
import { AuthField } from '@/components/auth/AuthField';
import { authStyles as styles } from '@/styles/authStyles';
import { AppColors } from '@/constants/theme';
import { api } from '@/lib/api';
import { useUser } from '@/context/UserContext';

// MAT number format: DE.YYYY/NNNN  e.g. DE.2021/5628
const MAT_REGEX = /^DE\.\d{4}\/\d{4}$/i;

type Level = '' | '100' | '200' | '300' | '400' | '500';
const LEVELS: Level[] = ['100', '200', '300', '400', '500'];

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const { width } = useWindowDimensions();
  const useTwoColumns = width >= 480;

  const [matNumber, setMatNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [level, setLevel] = useState<Level>('');
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};

    if (!matNumber.trim()) {
      newErrors.matNumber = 'MAT number is required';
    } else if (!MAT_REGEX.test(matNumber.trim())) {
      newErrors.matNumber = 'Invalid format — use DE.YYYY/NNNN (e.g. DE.2021/5628)';
    }

    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (nameParts.length < 2) {
      newErrors.fullName = 'Enter at least a first and last name (e.g. Mike Ollay)';
    }

    if (!faculty.trim()) newErrors.faculty = 'Faculty is required';
    if (!department.trim()) newErrors.department = 'Department is required';
    if (!level) newErrors.level = 'Level is required';
    if (!password.trim()) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError('');
      return;
    }

    setErrors({});
    setFormError('');
    setSubmitting(true);
    try {
      const user = await api.register({
        matNumber: matNumber.trim().toUpperCase(),
        fullName: fullName.trim(),
        level,
        password,
        faculty: faculty.trim(),
        department: department.trim(),
      });
      await setUser(user);
      router.replace('/user_notice');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to register');
    } finally {
      setSubmitting(false);
    }
  };

  const matField = (
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
  );

  const nameField = (
    <AuthField
      label="Full Name"
      placeholder="Your full name"
      value={fullName}
      onChangeText={(val) => {
        setFullName(val);
        setErrors((prev) => ({ ...prev, fullName: '' }));
      }}
      autoCapitalize="words"
      error={errors.fullName}
    />
  );

  const facultyField = (
    <AuthField
      label="Faculty"
      placeholder="e.g. Engineering"
      value={faculty}
      onChangeText={(val) => {
        setFaculty(val);
        setErrors((prev) => ({ ...prev, faculty: '' }));
      }}
      autoCapitalize="words"
      error={errors.faculty}
    />
  );

  const departmentField = (
    <AuthField
      label="Department"
      placeholder="e.g. Computer Science"
      value={department}
      onChangeText={(val) => {
        setDepartment(val);
        setErrors((prev) => ({ ...prev, department: '' }));
      }}
      autoCapitalize="words"
      error={errors.department}
    />
  );

  return (
    <AuthScreen>
      <View style={styles.card}>
        <AuthCardHeader
          title="Create account"
          subtitle="Set up your student profile to join the board."
        />

        <AuthErrorBanner message={formError} />

        {useTwoColumns ? (
          <>
            <View style={styles.twoColumnRow}>
              <View style={styles.columnHalf}>{matField}</View>
              <View style={styles.columnHalf}>{nameField}</View>
            </View>
            <View style={styles.twoColumnRow}>
              <View style={styles.columnHalf}>{facultyField}</View>
              <View style={styles.columnHalf}>{departmentField}</View>
            </View>
          </>
        ) : (
          <>
            {matField}
            {nameField}
            {facultyField}
            {departmentField}
          </>
        )}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Level</Text>
          <TouchableOpacity
            style={[styles.dropdownTrigger, errors.level ? localStyles.inputError : undefined]}
            onPress={() => setLevelDropdownOpen(!levelDropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownTriggerText, !level && styles.dropdownPlaceholder]}>
              {level ? `Level ${level}` : 'Select your level'}
            </Text>
            <ChevronDown
              size={18}
              color={AppColors.textMuted}
              style={{ transform: [{ rotate: levelDropdownOpen ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>

          {errors.level ? <Text style={localStyles.errorText}>{errors.level}</Text> : null}

          {levelDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {LEVELS.map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.dropdownItem, level === lvl && styles.dropdownItemSelected]}
                  onPress={() => {
                    setLevel(lvl);
                    setLevelDropdownOpen(false);
                    setErrors((prev) => ({ ...prev, level: '' }));
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      level === lvl && styles.dropdownItemTextSelected,
                    ]}
                  >
                    Level {lvl}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <AuthField
          label="Password"
          placeholder="Create a secure password"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setErrors((prev) => ({ ...prev, password: '' }));
          }}
          secureToggle
          error={errors.password}
        />

        <TouchableOpacity
          style={[styles.primaryButton, submitting && { opacity: 0.7 }]}
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? 'Creating account...' : 'Create account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already registered? </Text>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScreen>
  );
}

const localStyles = StyleSheet.create({
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#ef4444',
  },
});

