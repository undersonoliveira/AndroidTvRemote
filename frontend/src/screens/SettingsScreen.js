import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  Linking
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Application from 'expo-application';

// Components
import ThemeToggle from '../components/ThemeToggle';

// Context
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';

// Services
import { resetAppData } from '../services/subscriptionManager';

const supportedLanguages = [
  { code: 'en', name: '🇬🇧 English' },
  { code: 'pt', name: '🇧🇷 Português' },
  { code: 'es', name: '🇪🇸 Español' },
  { code: 'fr', name: '🇫🇷 Français' },
  { code: 'ru', name: '🇷🇺 Русский' },
  { code: 'de', name: '🇩🇪 Deutsch' },
  { code: 'zh', name: '🇨🇳 简体中文' },
  { code: 'ja', name: '🇯🇵 日本語' },
];

export default function SettingsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  
  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode);
    i18n.changeLanguage(languageCode);
  };
  
  const handleResetData = () => {
    Alert.alert(
      t('settings.resetConfirmTitle'),
      t('settings.resetConfirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('settings.resetConfirm'),
          style: 'destructive',
          onPress: async () => {
            await resetAppData();
            Alert.alert(
              t('settings.resetSuccessTitle'),
              t('settings.resetSuccessMessage')
            );
          }
        }
      ]
    );
  };
  
  const handleContactSupport = () => {
    Linking.openURL('mailto:support@wifiremote.app');
  };
  
  const handlePrivacyPolicy = () => {
    Linking.openURL('https://wifiremote.app/privacy');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('settings.appearance')}
          </Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLabelContainer}>
              <Feather name="moon" size={20} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                {t('settings.darkMode')}
              </Text>
            </View>
            <ThemeToggle />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('settings.language')}
          </Text>
          
          {supportedLanguages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem, 
                { 
                  borderBottomColor: theme.colors.border,
                  backgroundColor: language === lang.code ? theme.colors.selected : 'transparent' 
                }
              ]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <Text style={[styles.languageText, { color: theme.colors.text }]}>
                {lang.name}
              </Text>
              {language === lang.code && (
                <Feather name="check" size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('settings.account')}
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('Subscription')}
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="star" size={20} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                {t('settings.subscription')}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
            onPress={handleResetData}
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="trash-2" size={20} color={theme.colors.error} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.error }]}>
                {t('settings.resetData')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('settings.help')}
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
            onPress={handleContactSupport}
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="mail" size={20} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                {t('settings.contactSupport')}
              </Text>
            </View>
            <Feather name="external-link" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
            onPress={handlePrivacyPolicy}
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="shield" size={20} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                {t('settings.privacyPolicy')}
              </Text>
            </View>
            <Feather name="external-link" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={[styles.versionText, { color: theme.colors.secondaryText }]}>
            {t('settings.version', { version: Application.nativeApplicationVersion || '1.0.0' })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
  },
  languageText: {
    fontSize: 16,
  },
  appInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
  },
});
