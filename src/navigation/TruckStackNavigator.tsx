import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TruckListScreen from '../screens/TruckListScreen';
import TruckDetailScreen from '../screens/TruckDetailScreen';
import AddTruckScreen from '../screens/AddTruckScreen';
import EditTruckScreen from '../screens/EditTruckScreen';
import { TruckStatus } from '../types/truck';

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
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="TruckList"
        component={TruckListScreen}
        initialParams={{ status }}
        options={{
          title: `TruckTracker - ${status}`,
        }}
      />
      <Stack.Screen
        name="TruckDetail"
        component={TruckDetailScreen}
        options={{ title: 'Detail du camion' }}
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
