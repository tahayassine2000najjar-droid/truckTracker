import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTrucks } from '../context/TruckContext';
import { Truck, TruckStatus } from '../types/truck';
import TruckCard from '../components/TruckCard';

type RootStackParamList = {
  TruckList: { status: TruckStatus };
  TruckDetail: { truckId: string };
  AddTruck: { status: TruckStatus };
  EditTruck: { truckId: string };
};

type TruckListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TruckList'>;
type TruckListScreenRouteProp = RouteProp<RootStackParamList, 'TruckList'>;

const TruckListScreen: React.FC = () => {
  const navigation = useNavigation<TruckListScreenNavigationProp>();
  const route = useRoute<TruckListScreenRouteProp>();
  const { trucks } = useTrucks();
  const status = route.params.status;

  const filteredTrucks = trucks.filter((truck) => truck.status === status);

  const handleTruckPress = (truck: Truck) => {
    navigation.navigate('TruckDetail', { truckId: truck.id });
  };

  const handleAddTruck = () => {
    navigation.navigate('AddTruck', { status });
  };

  const renderTruck = ({ item }: { item: Truck }) => (
    <TruckCard truck={item} onPress={() => handleTruckPress(item)} />
  );

  return (
    <View style={styles.container}>
      {filteredTrucks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun camion dans cette catégorie</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddTruck}>
            <Text style={styles.addButtonText}>+ Ajouter un camion</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTrucks}
          renderItem={renderTruck}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <TouchableOpacity style={styles.addButton} onPress={handleAddTruck}>
              <Text style={styles.addButtonText}>+ Ajouter un camion</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TruckListScreen;
