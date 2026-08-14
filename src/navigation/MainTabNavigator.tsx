import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import TruckStackNavigator from './TruckStackNavigator';
import { TruckStatus } from '../types/truck';

type TabParamList = {
  'En service': { status: TruckStatus };
  "À l'arrêt": { status: TruckStatus };
  'En maintenance': { status: TruckStatus };
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon: React.FC<{ label: string; color: string; focused: boolean }> = ({
  label,
  color,
  focused,
}) => (
  <View style={styles.tabIcon}>
    <Text style={[styles.tabIconText, { color }]}>{focused ? '●' : '○'}</Text>
    <Text style={[styles.tabLabel, { color }]}>{label}</Text>
  </View>
);

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 80,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="En service"
        component={TruckStackNavigator}
        initialParams={{ status: 'En service' }}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="En service" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="À l'arrêt"
        component={TruckStackNavigator}
        initialParams={{ status: "À l'arrêt" }}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="À l'arrêt" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="En maintenance"
        component={TruckStackNavigator}
        initialParams={{ status: 'En maintenance' }}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="En maintenance" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
  },
  tabIconText: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default MainTabNavigator;
