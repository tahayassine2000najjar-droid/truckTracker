import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTrucks } from '../context/TruckContext';
import { Truck, TruckStatus } from '../types/truck';
import TruckCard from '../components/TruckCard';
import { COLORS, SHADOWS, SPACING, RADIUS, FONT } from '../theme';

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
      <View style={styles.counterBar}>
        <Text style={styles.counterText}>
          {filteredTrucks.length} camion{filteredTrucks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {filteredTrucks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>🚛</Text>
          </View>
          <Text style={styles.emptyTitle}>Aucun camion</Text>
          <Text style={styles.emptySubtitle}>
            Aucun camion n'est actuellement dans cette catégorie
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddTruck} activeOpacity={0.8}>
            <Text style={styles.addButtonText}>+ Ajouter un camion</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTrucks}
          renderItem={renderTruck}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity style={styles.addButton} onPress={handleAddTruck} activeOpacity={0.8}>
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
    backgroundColor: COLORS.background,
  },
  counterBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  counterText: {
    fontSize: 13,
    color: COLORS.textHint,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: SPACING.sm,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl * 2,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: FONT.bold,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT.regular,
    color: COLORS.textHint,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.sm,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONT.medium,
    fontWeight: '600',
  },
});

export default TruckListScreen;
