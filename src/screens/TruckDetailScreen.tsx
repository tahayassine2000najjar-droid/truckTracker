import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTrucks } from '../context/TruckContext';
import { TruckStatus } from '../types/truck';

type RootStackParamList = {
  TruckList: { status: TruckStatus };
  TruckDetail: { truckId: string };
  AddTruck: { status: TruckStatus };
  EditTruck: { truckId: string };
};

type TruckDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TruckDetail'>;
type TruckDetailScreenRouteProp = RouteProp<RootStackParamList, 'TruckDetail'>;

const getStatusColor = (status: TruckStatus): string => {
  switch (status) {
    case 'En service':
      return '#4CAF50';
    case 'À l\'arrêt':
      return '#FF9800';
    case 'En maintenance':
      return '#F44336';
  }
};

const TruckDetailScreen: React.FC = () => {
  const navigation = useNavigation<TruckDetailScreenNavigationProp>();
  const route = useRoute<TruckDetailScreenRouteProp>();
  const { trucks, deleteTruck, changeStatus } = useTrucks();

  const truck = trucks.find((t) => t.id === route.params.truckId);

  if (!truck) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camion non trouvé</Text>
      </View>
    );
  }

  const oilChangeDue = truck.mileage >= truck.nextOilChangeMileage;

  const handleDelete = () => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce camion ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteTruck(truck.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleStatusChange = (newStatus: TruckStatus) => {
    changeStatus(truck.id, newStatus);
  };

  const statuses: TruckStatus[] = ['En service', 'À l\'arrêt', 'En maintenance'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.plateContainer}>
          <View style={[styles.colorDot, { backgroundColor: truck.color }]} />
          <Text style={styles.plateNumber}>{truck.plateNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(truck.status) }]}>
          <Text style={styles.statusText}>{truck.status}</Text>
        </View>
      </View>

      {oilChangeDue && (
        <View style={styles.oilChangeAlert}>
          <Text style={styles.oilChangeAlertText}>
            VIDANGE REQUISE - Kilometrage actuel ({truck.mileage.toLocaleString()} km) a atteint ou depasse le seuil ({truck.nextOilChangeMileage.toLocaleString()} km)
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Couleur</Text>
          <View style={styles.infoValueContainer}>
            <View style={[styles.colorDotSmall, { backgroundColor: truck.color }]} />
            <Text style={styles.infoValue}>{truck.color}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type de carburant</Text>
          <Text style={styles.infoValue}>{truck.fuelType}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Kilometrage</Text>
          <Text style={styles.infoValue}>{truck.mileage.toLocaleString()} km</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Prochaine vidange</Text>
          <Text style={[styles.infoValue, oilChangeDue && styles.dangerText]}>
            {truck.nextOilChangeMileage.toLocaleString()} km
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Changer le statut</Text>
        <View style={styles.statusButtons}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                { backgroundColor: getStatusColor(status) },
                truck.status === status && styles.activeStatusButton,
              ]}
              onPress={() => handleStatusChange(status)}
              disabled={truck.status === status}
            >
              <Text style={styles.statusButtonText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditTruck', { truckId: truck.id })}
        >
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  plateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  plateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  oilChangeAlert: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    padding: 12,
    margin: 16,
  },
  oilChangeAlertText: {
    color: '#E65100',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDotSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  dangerText: {
    color: '#F44336',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeStatusButton: {
    opacity: 0.5,
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TruckDetailScreen;
