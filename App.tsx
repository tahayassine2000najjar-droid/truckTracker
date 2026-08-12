import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TrucksProvider } from './src/context/TruckContext';
import MainTabNavigator from './src/navigation/MainTabNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <TrucksProvider>
        <NavigationContainer>
          <MainTabNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </TrucksProvider>
    </SafeAreaProvider>
  );
}
