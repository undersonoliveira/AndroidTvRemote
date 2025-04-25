import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';

// Screens
import DeviceDiscoveryScreen from '../screens/DeviceDiscoveryScreen';
import PairingScreen from '../screens/PairingScreen';
import RemoteControlScreen from '../screens/RemoteControlScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

// Context
import { ThemeContext } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function RemoteStack() {
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DeviceDiscovery" 
        component={DeviceDiscoveryScreen} 
        options={{ title: t('discovery.title') }} 
      />
      <Stack.Screen 
        name="Pairing" 
        component={PairingScreen} 
        options={{ title: t('pairing.title') }} 
      />
      <Stack.Screen 
        name="RemoteControl" 
        component={RemoteControlScreen} 
        options={{ 
          title: t('remote.title'),
          headerBackVisible: false,
        }} 
      />
      <Stack.Screen 
        name="Subscription" 
        component={SubscriptionScreen} 
        options={{ title: t('subscription.title') }} 
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="RemoteStack" 
        component={RemoteStack} 
        options={{
          tabBarLabel: t('tabs.remote'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="tv" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarLabel: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useContext(ThemeContext);
  
  return (
    <NavigationContainer
      theme={{
        dark: theme.dark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.notification,
        },
      }}
    >
      <MainTabs />
    </NavigationContainer>
  );
}
