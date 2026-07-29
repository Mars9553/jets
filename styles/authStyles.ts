import { Platform, StyleSheet } from 'react-native';
import { AppColors, Layout, Radius, Spacing } from '@/constants/theme';

export const authStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xl,
    alignSelf: 'center',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? Layout.maxWidthAuth : undefined,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm + 4,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.text,
    letterSpacing: -0.2,
  },
  brandTagline: {
    fontSize: 13,
    color: AppColors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  cardHeader: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.textMuted,
    lineHeight: 21,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: Radius.sm + 2,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 12,
    fontSize: 15,
    color: AppColors.text,
    backgroundColor: AppColors.surface,
    ...Platform.select({
      web: { outlineStyle: 'none' as const },
      default: {},
    }),
  },
  inputFocused: {
    borderColor: AppColors.primary,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
  },
  columnHalf: { flex: 1 },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
  },
  checkboxChecked: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  checkmark: {
    color: AppColors.surface,
    fontSize: 11,
    fontWeight: '700',
  },
  rememberText: {
    fontSize: 13,
    color: AppColors.textMuted,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    borderRadius: Radius.sm + 2,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  primaryButtonText: {
    color: AppColors.surface,
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.borderLight,
    marginVertical: Spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: AppColors.textMuted,
  },
  linkText: {
    color: AppColors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: Radius.sm + 2,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 12,
    backgroundColor: AppColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerText: {
    fontSize: 15,
    color: AppColors.text,
  },
  dropdownPlaceholder: {
    color: AppColors.textPlaceholder,
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: Radius.sm + 2,
    backgroundColor: AppColors.surface,
    marginTop: Spacing.xs,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  dropdownItemSelected: {
    backgroundColor: AppColors.primaryLight,
  },
  dropdownItemText: {
    fontSize: 15,
    color: AppColors.textSecondary,
  },
  dropdownItemTextSelected: {
    color: AppColors.primary,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
