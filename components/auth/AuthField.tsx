import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { authStyles as styles } from '@/styles/authStyles';
import { AppColors } from '@/constants/theme';

type AuthFieldProps = TextInputProps & {
  label: string;
  secureToggle?: boolean;
  error?: string;
};

export function AuthField({ label, secureToggle, secureTextEntry, style, error, ...rest }: AuthFieldProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const isSecure = secureToggle ? !visible : secureTextEntry;

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={secureToggle ? styles.passwordRow : undefined}>
        <TextInput
          style={[
            styles.input,
            focused && styles.inputFocused,
            error && localStyles.inputError,
            secureToggle && styles.passwordInput,
            style,
          ]}
          placeholderTextColor={AppColors.textPlaceholder}
          secureTextEntry={isSecure}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {secureToggle && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setVisible(!visible)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {visible ? (
              <EyeOff size={18} color={AppColors.textPlaceholder} />
            ) : (
              <Eye size={18} color={AppColors.textPlaceholder} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={localStyles.errorText}>{error}</Text> : null}
    </View>
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

