import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Truck, TruckStatus } from '../types/truck';

interface TruckCardProps {
  truck: Truck;
  onPress: () => void;
}

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

const TruckCard: React.FC<TruckCardProps> = ({ truck, onPress }) => {
  const oilChangeDue = truck.mileage >= truck.nextOilChangeMileage;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(truck.status) }]}>
          <Text style={styles.statusText}>{truck.status}</Text>
        </View>
        {oilChangeDue && (
          <View style={styles.oilChangeBadge}>
            <Text style={styles.oilChangeText}>VIDANGE</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <View style={[styles.colorDot, { backgroundColor: truck.color }]} />
          <Text style={styles.plateNumber}>{truck.plateNumber}</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Carburant</Text>
            <Text style={styles.detailValue}>{truck.fuelType}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Kilometrage</Text>
            <Text style={styles.detailValue}>{truck.mileage.toLocaleString()} km</Text>
          </View>
        </View>

        <View style={styles.oilChangeInfo}>
          <Text style={styles.oilChangeLabel}>
            Prochaine vidange: {truck.nextOilChangeMileage.toLocaleString()} km
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  oilChangeBadge: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  oilChangeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  body: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  plateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  oilChangeInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  oilChangeLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default TruckCard;
