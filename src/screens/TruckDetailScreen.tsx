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
import { COLORS, SHADOWS, SPACING, RADIUS, FONT } from '../theme';

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
      return COLORS.success;
    case 'À l\'arrêt':
      return COLORS.warning;
    case 'En maintenance':
      return COLORS.danger;
  }
};

const getStatusBg = (status: TruckStatus): string => {
  switch (status) {
    case 'En service':
      return COLORS.successLight;
    case 'À l\'arrêt':
      return COLORS.warningLight;
    case 'En maintenance':
      return COLORS.dangerLight;
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
        <Text style={styles.notFoundText}>Camion non trouvé</Text>
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.plateRow}>
            <View style={[styles.colorDot, { backgroundColor: truck.color }]} />
            <Text style={styles.plateNumber}>{truck.plateNumber}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBg(truck.status) }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(truck.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(truck.status) }]}>
              {truck.status}
            </Text>
          </View>
        </View>
      </View>

      {oilChangeDue && (
        <View style={styles.oilChangeAlert}>
          <View style={styles.oilChangeIconContainer}>
            <Text style={styles.oilChangeAlertIcon}>!</Text>
          </View>
          <View style={styles.oilChangeContent}>
            <Text style={styles.oilChangeAlertTitle}>VIDANGE REQUISE</Text>
            <Text style={styles.oilChangeAlertText}>
              Le kilométrage actuel ({truck.mileage.toLocaleString()} km) a atteint ou dépassé le seuil ({truck.nextOilChangeMileage.toLocaleString()} km)
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Couleur</Text>
            <View style={styles.infoValueContainer}>
              <View style={[styles.colorDotSmall, { backgroundColor: truck.color }]} />
              <Text style={styles.infoValue}>{truck.color}</Text>
            </View>
          </View>

          <View style={styles.infoSeparator} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type de carburant</Text>
            <Text style={styles.infoValue}>{truck.fuelType}</Text>
          </View>

          <View style={styles.infoSeparator} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kilométrage</Text>
            <Text style={styles.infoValue}>{truck.mileage.toLocaleString()} km</Text>
          </View>

          <View style={styles.infoSeparator} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prochaine vidange</Text>
            <Text style={[styles.infoValue, oilChangeDue && styles.dangerText]}>
              {truck.nextOilChangeMileage.toLocaleString()} km
            </Text>
          </View>
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
                { backgroundColor: getStatusBg(status), borderColor: getStatusColor(status) },
                truck.status === status && styles.activeStatusButton,
              ]}
              onPress={() => handleStatusChange(status)}
              disabled={truck.status === status}
              activeOpacity={0.7}
            >
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(status) }]} />
              <Text style={[styles.statusButtonText, { color: getStatusColor(status) }]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditTruck', { truckId: truck.id })}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  notFoundText: {
    fontSize: FONT.medium,
    color: COLORS.textHint,
    textAlign: 'center',
    marginTop: SPACING.xxl * 2,
  },
  heroSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  heroContent: {
    alignItems: 'center',
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SPACING.md,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  plateNumber: {
    fontSize: FONT.large,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  oilChangeAlert: {
    flexDirection: 'row',
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  oilChangeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.warning,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  oilChangeAlertIcon: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  oilChangeContent: {
    flex: 1,
  },
  oilChangeAlertTitle: {
    color: COLORS.warning,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  oilChangeAlertText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT.semibold,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    letterSpacing: 0.2,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
  },
  infoLabel: {
    fontSize: FONT.regular,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: FONT.medium,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDotSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: SPACING.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  infoSeparator: {
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  dangerText: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: SPACING.xs,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStatusButton: {
    opacity: 0.4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs + 2,
  },
  statusButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING.xxl * 2,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: FONT.medium,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.danger,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.sm,
    marginLeft: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: FONT.medium,
    fontWeight: '700',
  },
});

export default TruckDetailScreen;
