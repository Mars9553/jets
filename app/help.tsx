import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import {
  HelpCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  ExternalLink,
  Search,
  Flag,
  Info,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { BottomTabs, BOTTOM_TAB_HEIGHT } from '@/components/board/BottomTabs';
import { Layout, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function HelpSupportScreen() {
  const { user } = useUser();
  const { colors } = useTheme();
  const { isConnected } = useNetworkStatus();
  const s = useMemo(() => styles(colors), [colors]);

  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    {
      id: '1',
      question: 'How do I receive notifications?',
      answer: 'Ensure push notifications are enabled in your device settings and in the app preferences under Profile > Preferences. You will receive alerts for urgent notices and new events.',
    },
    {
      id: '2',
      question: 'Can I access notices offline?',
      answer: 'Yes. All notices you have viewed are automatically cached. You can read them anytime without an internet connection.',
    },
    {
      id: '3',
      question: 'How do I update my profile information?',
      answer: 'Go to Profile > Personal Information. If your MAT number or department is incorrect, please contact the admin for verification.',
    },
    {
      id: '4',
      question: 'Who can post notices and events?',
      answer: 'Only authorized faculty members and the administration can publish notices and events. Students can view, search, and comment on them.',
    },
    {
      id: '5',
      question: 'How do I report a technical issue?',
      answer: 'Use the Support Ticket form below or send an email to e-board_admin@gmail.com. Include your MAT number and a description of the issue.',
    },
    {
      id: '6',
      question: 'How do I report inappropriate content?',
      answer: 'Use the Report Content section below. Select the notice or event, choose a reason, and submit. The admin will review it within 24 hours.',
    },
    {
      id: '7',
      question: 'Is my data safe?',
      answer: 'Yes. Your profile information is stored securely. We do not share your data with third parties. You can request data deletion by contacting the admin.',
    },
  ];

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
    );
  }, [searchQuery, faqs]);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleEmailAdmin = () => {
    const subject = encodeURIComponent('E-Board Support Request');
    const body = encodeURIComponent(`Hello,\n\nI need assistance with the following:\n\n`);
    Linking.openURL(`mailto:e-board_admin@gmail.com?subject=${subject}&body=${body}`);
  };

  const handleSubmitTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert('Missing Info', 'Please fill in both subject and message.');
      return;
    }

    setSubmitting(true);
    const subject = encodeURIComponent(`[Support Ticket] ${ticketSubject}`);
    const body = encodeURIComponent(
      `Student: ${user?.fullName || 'Unknown'} (${user?.matNumber || 'N/A'})\n\nMessage:\n${ticketMessage}\n\n---\nSent from E-Board Help & Support`
    );
    await Linking.openURL(`mailto:e-board_admin@gmail.com?subject=${subject}&body=${body}`);
    setTicketSubject('');
    setTicketMessage('');
    setSubmitting(false);
    Alert.alert('Ticket Sent', 'Your support ticket has been sent to the admin. You will receive a response via email.');
  };

  const handleReportContent = () => {
    const subject = encodeURIComponent('[Content Report] Inappropriate Content');
    const body = encodeURIComponent(
      `Student: ${user?.fullName || 'Unknown'} (${user?.matNumber || 'N/A'})\n\nPlease describe the inappropriate content:\n\nLink/Title:\nReason:\n\n---\nSent from E-Board Help & Support`
    );
    Linking.openURL(`mailto:e-board_admin@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <BoardNavbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scrollContent,
          Platform.OS !== 'web' && { paddingBottom: BOTTOM_TAB_HEIGHT + Spacing.lg },
        ]}
      >
        <View style={s.page}>
          {/* Hero Header */}
          <View style={[s.heroCard, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.text }]}>
            <View style={[s.heroIcon, { backgroundColor: colors.primaryLight }]}>
              <HelpCircle size={28} color={colors.primary} />
            </View>
            <Text style={[s.pageTitle, { color: colors.text }]}>Help & Support</Text>
            <Text style={[s.pageSubtitle, { color: colors.textMuted }]}>
              Find answers to common questions or reach out to our support team for assistance.
            </Text>
          </View>

          {/* Getting Started */}
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>Getting Started</Text>
          <View style={[s.guideCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={s.guideRow}>
              <View style={[s.guideBullet, { backgroundColor: colors.primary }]} />
              <Text style={[s.guideText, { color: colors.textSecondary }]}>
                Browse notices on the <Text style={{ fontWeight: '700' }}>Notice Board</Text> tab. Use the search bar to filter by keyword or category.
              </Text>
            </View>
            <View style={[s.guideDivider, { backgroundColor: colors.borderLight }]} />
            <View style={s.guideRow}>
              <View style={[s.guideBullet, { backgroundColor: colors.primary }]} />
              <Text style={[s.guideText, { color: colors.textSecondary }]}>
                Check the <Text style={{ fontWeight: '700' }}>Events</Text> tab for upcoming SUG activities, career fairs, and seminars.
              </Text>
            </View>
            <View style={[s.guideDivider, { backgroundColor: colors.borderLight }]} />
            <View style={s.guideRow}>
              <View style={[s.guideBullet, { backgroundColor: colors.primary }]} />
              <Text style={[s.guideText, { color: colors.textSecondary }]}>
                Enable{' '}
                <Text style={{ fontWeight: '700' }}>Push Notifications</Text>
                {' '}in Profile &gt; Preferences so you never miss urgent updates.
              </Text>
            </View>
            <View style={[s.guideDivider, { backgroundColor: colors.borderLight }]} />
            <View style={s.guideRow}>
              <View style={[s.guideBullet, { backgroundColor: colors.success }]} />
              <Text style={[s.guideText, { color: colors.textSecondary }]}>
                View content <Text style={{ fontWeight: '700' }}>offline</Text> — previously opened notices and events are cached automatically.
              </Text>
            </View>
          </View>

          {/* FAQ Section */}
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>Frequently Asked Questions</Text>
          <View style={[s.searchWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Search size={18} color={colors.textPlaceholder} />
            <TextInput
              style={[s.searchInput, { color: colors.textSecondary }]}
              placeholder="Search FAQs..."
              placeholderTextColor={colors.textPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={s.faqContainer}>
            {filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <TouchableOpacity
                  key={faq.id}
                  style={[s.faqItem, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
                  onPress={() => toggleFaq(faq.id)}
                  activeOpacity={0.7}
                >
                  <View style={s.faqHeader}>
                    <Text style={[s.faqQuestion, { color: colors.textSecondary }]}>{faq.question}</Text>
                    {isOpen ? (
                      <ChevronUp size={18} color={colors.textPlaceholder} />
                    ) : (
                      <ChevronDown size={18} color={colors.textPlaceholder} />
                    )}
                  </View>
                  {isOpen && (
                    <View style={[s.faqDivider, { backgroundColor: colors.borderLight }]}>
                      <Text style={[s.faqAnswer, { color: colors.textMuted }]}>{faq.answer}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {filteredFaqs.length === 0 && (
            <Text style={[s.noResults, { color: colors.textMuted }]}>No matching questions found.</Text>
          )}

          {/* Report Content */}
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>Report Content</Text>
          <TouchableOpacity
            style={[s.reportCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
            onPress={handleReportContent}
            activeOpacity={0.7}
          >
            <View style={[s.reportIcon, { backgroundColor: '#fef9c3' }]}>
              <Flag size={20} color="#ca8a04" />
            </View>
            <View style={s.reportInfo}>
              <Text style={[s.reportTitle, { color: colors.textSecondary }]}>Report Inappropriate Content</Text>
              <Text style={[s.reportValue, { color: colors.textMuted }]}>
                Spam, offensive material, or incorrect information
              </Text>
            </View>
            <ExternalLink size={18} color={colors.textPlaceholder} />
          </TouchableOpacity>

          {/* Contact Admin Section */}
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>Contact Admin</Text>
          <TouchableOpacity
            style={[s.contactCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
            onPress={handleEmailAdmin}
            activeOpacity={0.7}
          >
            <View style={[s.contactIcon, { backgroundColor: colors.primaryLight }]}>
              <Mail size={20} color={colors.primary} />
            </View>
            <View style={s.contactInfo}>
              <Text style={[s.contactTitle, { color: colors.textSecondary }]}>Email Admin</Text>
              <Text style={[s.contactValue, { color: colors.textMuted }]}>e-board_admin@gmail.com</Text>
            </View>
            <ExternalLink size={18} color={colors.textPlaceholder} />
          </TouchableOpacity>

          {/* Support Ticket Section */}
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>Support Ticket</Text>
          <View style={[s.ticketCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={s.ticketHeader}>
              <View style={[s.ticketIcon, { backgroundColor: colors.primaryLight }]}>
                <MessageSquare size={20} color={colors.primary} />
              </View>
              <View style={s.ticketHeaderText}>
                <Text style={[s.ticketTitle, { color: colors.textSecondary }]}>Submit a Support Ticket</Text>
                <Text style={[s.ticketSubtitle, { color: colors.textMuted }]}>
                  Describe your issue and we will get back to you.
                </Text>
              </View>
            </View>

            <View style={[s.divider, { backgroundColor: colors.borderLight }]} />

            <View style={s.formGroup}>
              <Text style={[s.label, { color: colors.textSecondary }]}>Subject</Text>
              <TextInput
                style={[s.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textSecondary }]}
                placeholder="Brief description of your issue"
                placeholderTextColor={colors.textPlaceholder}
                value={ticketSubject}
                onChangeText={setTicketSubject}
              />
            </View>

            <View style={s.formGroup}>
              <Text style={[s.label, { color: colors.textSecondary }]}>Message</Text>
              <TextInput
                style={[s.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textSecondary }]}
                placeholder="Please provide details about your issue..."
                placeholderTextColor={colors.textPlaceholder}
                value={ticketMessage}
                onChangeText={setTicketMessage}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[s.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmitTicket}
              activeOpacity={0.8}
              disabled={submitting}
            >
              <Send size={16} color={colors.surface} />
              <Text style={[s.submitText, { color: colors.surface }]}>
                {submitting ? 'Sending...' : 'Submit Ticket'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>App Info</Text>
          <View style={[s.infoCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={s.infoRow}>
              <View style={[s.infoIcon, { backgroundColor: colors.primaryLight }]}>
                <Info size={18} color={colors.primary} />
              </View>
              <View style={s.infoContent}>
                <Text style={[s.infoLabel, { color: colors.textPlaceholder }]}>Version</Text>
                <Text style={[s.infoValue, { color: colors.textSecondary }]}>1.0.0</Text>
              </View>
            </View>
            <View style={[s.infoDivider, { backgroundColor: colors.borderLight }]} />
            <View style={s.infoRow}>
              <View style={[s.infoIcon, { backgroundColor: colors.primaryLight }]}>
                {isConnected ? (
                  <Wifi size={18} color={colors.primary} />
                ) : (
                  <WifiOff size={18} color={colors.textMuted} />
                )}
              </View>
              <View style={s.infoContent}>
                <Text style={[s.infoLabel, { color: colors.textPlaceholder }]}>Connection Status</Text>
                <Text style={[s.infoValue, { color: isConnected ? colors.success : colors.textMuted }]}>
                  {isConnected ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          </View>

          <BoardFooter />
        </View>
      </ScrollView>

      <BottomTabs active="profile" />
    </SafeAreaView>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
  },
  page: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? Layout.maxWidthContent : '100%',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  heroCard: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadow.card,
    borderWidth: 1,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 500,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    paddingLeft: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    gap: 10,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
      default: {},
    }),
  },
  guideCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: Spacing.sm,
  },
  guideBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    flexShrink: 0,
  },
  guideText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  guideDivider: {
    height: 1,
    marginLeft: 20,
  },
  faqContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  noResults: {
    fontSize: 13,
    marginBottom: Spacing.lg,
    paddingLeft: 4,
  },
  faqItem: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  faqDivider: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 20,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 12,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  reportValue: {
    fontSize: 13,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 12,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
  },
  ticketCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.sm,
  },
  ticketIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketHeaderText: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  ticketSubtitle: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.md,
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: 14,
  },
  textArea: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: 14,
    minHeight: 100,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radius.md,
    gap: 8,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },
});
