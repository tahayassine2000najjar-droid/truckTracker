import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import TruckStackNavigator from './TruckStackNavigator';
import { TruckStatus } from '../types/truck';
import { COLORS, SPACING } from '../theme';

type TabParamList = {
  'En service': { status: TruckStatus };
  "À l'arrêt": { status: TruckStatus };
  'En maintenance': { status: TruckStatus };
};

const Tab = createBottomTabNavigator<TabParamList>();

const TruckIcon: React.FC<{ color: string; focused: boolean }> = ({ color, focused }) => (
  <Text style={[styles.icon, { color, opacity: focused ? 1 : 0.5 }]}>🚛</Text>
);

const StopIcon: React.FC<{ color: string; focused: boolean }> = ({ color, focused }) => (
  <Text style={[styles.icon, { color, opacity: focused ? 1 : 0.5 }]}>⏸️</Text>
);

const WrenchIcon: React.FC<{ color: string; focused: boolean }> = ({ color, focused }) => (
  <Text style={[styles.icon, { color, opacity: focused ? 1 : 0.5 }]}>🔧</Text>
);

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textHint,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 85,
          paddingTop: SPACING.sm,
        },
      }}
    >
      <Tab.Screen
        name="En service"
        component={TruckStackNavigator}
        initialParams={{ status: 'En service' }}
        options={{
          tabBarIcon: ({ color, focused }) => <TruckIcon color={color} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="À l'arrêt"
        component={TruckStackNavigator}
        initialParams={{ status: "À l'arrêt" }}
        options={{
          tabBarIcon: ({ color, focused }) => <StopIcon color={color} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="En maintenance"
        component={TruckStackNavigator}
        initialParams={{ status: 'En maintenance' }}
        options={{
          tabBarIcon: ({ color, focused }) => <WrenchIcon color={color} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 22,
  },
});

export default MainTabNavigator;
