import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';

// Context
import { RemoteLayoutContext, LAYOUTS } from '../context/RemoteLayoutContext';
import { ThemeContext } from '../context/ThemeContext';

export default function LayoutSelector({ onClose }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { 
    currentLayout, 
    changeLayout,
    resetToDefault,
  } = useContext(RemoteLayoutContext);

  const handleLayoutChange = (layoutName) => {
    changeLayout(layoutName);
    if (onClose) onClose();
  };

  const layoutOptions = [
    {
      id: LAYOUTS.STANDARD,
      name: t('layouts.standard'),
      icon: 'tv',
      description: t('layouts.standardDesc'),
    },
    {
      id: LAYOUTS.COMPACT,
      name: t('layouts.compact'),
      icon: 'minimize-2',
      description: t('layouts.compactDesc'),
    },
    {
      id: LAYOUTS.EXPANDED,
      name: t('layouts.expanded'),
      icon: 'maximize-2',
      description: t('layouts.expandedDesc'),
    },
    {
      id: LAYOUTS.CUSTOM,
      name: t('layouts.custom'),
      icon: 'edit-3',
      description: t('layouts.customDesc'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('layouts.selectLayout')}
        </Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Feather name="x" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {layoutOptions.map((layout) => (
          <TouchableOpacity
            key={layout.id}
            style={[
              styles.layoutOption,
              currentLayout === layout.id && { 
                backgroundColor: theme.colors.cardHighlight,
                borderColor: theme.colors.primary 
              }
            ]}
            onPress={() => handleLayoutChange(layout.id)}
          >
            <View style={styles.layoutContent}>
              <View style={[
                styles.layoutIcon, 
                { backgroundColor: theme.colors.primary }
              ]}>
                <Feather 
                  name={layout.icon} 
                  size={20} 
                  color={theme.colors.buttonText} 
                />
              </View>
              <View style={styles.layoutInfo}>
                <Text style={[styles.layoutName, { color: theme.colors.text }]}>
                  {layout.name}
                </Text>
                <Text style={[
                  styles.layoutDescription, 
                  { color: theme.colors.secondaryText }
                ]}>
                  {layout.description}
                </Text>
              </View>
            </View>
            {currentLayout === layout.id && (
              <Feather 
                name="check" 
                size={20} 
                color={theme.colors.primary} 
              />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.resetButton, { borderColor: theme.colors.border }]}
          onPress={() => {
            resetToDefault();
            if (onClose) onClose();
          }}
        >
          <Feather name="refresh-cw" size={16} color={theme.colors.text} />
          <Text style={[styles.resetText, { color: theme.colors.text }]}>
            {t('layouts.resetToDefault')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    maxHeight: '80%',
    width: '90%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  layoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  layoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  layoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  layoutInfo: {
    flex: 1,
  },
  layoutName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  layoutDescription: {
    fontSize: 14,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  resetText: {
    marginLeft: 8,
    fontSize: 14,
  },
});