import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TruckListScreen from '../screens/TruckListScreen';
import TruckDetailScreen from '../screens/TruckDetailScreen';
import AddTruckScreen from '../screens/AddTruckScreen';
import EditTruckScreen from '../screens/EditTruckScreen';
import { TruckStatus } from '../types/truck';
import { COLORS, FONT } from '../theme';

type RootStackParamList = {
  TruckList: { status: TruckStatus };
  TruckDetail: { truckId: string };
  AddTruck: { status: TruckStatus };
  EditTruck: { truckId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface TruckStackNavigatorProps {
  status: TruckStatus;
}

const TruckStackNavigator: React.FC<TruckStackNavigatorProps> = ({ status }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: FONT.semibold,
          letterSpacing: 0.3,
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="TruckList"
        component={TruckListScreen}
        initialParams={{ status }}
        options={{
          title: `TruckTracker · ${status}`,
        }}
      />
      <Stack.Screen
        name="TruckDetail"
        component={TruckDetailScreen}
        options={{ title: 'Détail du camion' }}
      />
      <Stack.Screen
        name="AddTruck"
        component={AddTruckScreen}
        initialParams={{ status }}
        options={{ title: 'Ajouter un camion' }}
      />
      <Stack.Screen
        name="EditTruck"
        component={EditTruckScreen}
        options={{ title: 'Modifier le camion' }}
      />
    </Stack.Navigator>
  );
};

export default TruckStackNavigator;
