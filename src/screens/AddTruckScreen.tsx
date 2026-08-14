import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { v4 as uuidv4 } from 'uuid';
import { useTrucks } from '../context/TruckContext';
import { TruckStatus } from '../types/truck';
import { COLORS, SHADOWS, SPACING, RADIUS, FONT } from '../theme';

type RootStackParamList = {
  TruckList: { status: TruckStatus };
  TruckDetail: { truckId: string };
  AddTruck: { status: TruckStatus };
  EditTruck: { truckId: string };
};

type AddTruckScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTruck'>;
type AddTruckScreenRouteProp = RouteProp<RootStackParamList, 'AddTruck'>;

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

const AddTruckScreen: React.FC = () => {
  const navigation = useNavigation<AddTruckScreenNavigationProp>();
  const route = useRoute<AddTruckScreenRouteProp>();
  const { addTruck } = useTrucks();

  const [plateNumber, setPlateNumber] = useState('');
  const [color, setColor] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [mileage, setMileage] = useState('');
  const [status, setStatus] = useState<TruckStatus>(route.params.status);
  const [nextOilChangeMileage, setNextOilChangeMileage] = useState('');

  const [errors, setErrors] = useState<{
    plateNumber?: string;
    color?: string;
    fuelType?: string;
    mileage?: string;
    nextOilChangeMileage?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!plateNumber.trim()) {
      newErrors.plateNumber = "L'immatriculation est requise";
    }

    if (!color.trim()) {
      newErrors.color = 'La couleur est requise';
    }

    if (!fuelType.trim()) {
      newErrors.fuelType = 'Le type de carburant est requis';
    }

    if (!mileage.trim()) {
      newErrors.mileage = 'Le kilométrage est requis';
    } else if (isNaN(Number(mileage)) || Number(mileage) < 0) {
      newErrors.mileage = 'Le kilométrage doit être un nombre valide';
    }

    if (!nextOilChangeMileage.trim()) {
      newErrors.nextOilChangeMileage = 'Le kilométrage de la prochaine vidange est requis';
    } else if (isNaN(Number(nextOilChangeMileage)) || Number(nextOilChangeMileage) < 0) {
      newErrors.nextOilChangeMileage = 'Le kilométrage doit être un nombre valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newTruck = {
      id: uuidv4(),
      plateNumber: plateNumber.trim(),
      color: color.trim(),
      fuelType: fuelType.trim(),
      mileage: Number(mileage),
      status,
      nextOilChangeMileage: Number(nextOilChangeMileage),
    };

    addTruck(newTruck);
    navigation.navigate('TruckList', { status });
  };

  const statuses: TruckStatus[] = ['En service', 'À l\'arrêt', 'En maintenance'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.title}>Nouveau camion</Text>
        <Text style={styles.subtitle}>Remplissez les informations ci-dessous</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Immatriculation *</Text>
          <TextInput
            style={[styles.input, errors.plateNumber && styles.inputError]}
            value={plateNumber}
            onChangeText={setPlateNumber}
            placeholder="AB-123-CD"
            placeholderTextColor={COLORS.textHint}
          />
          {errors.plateNumber && <Text style={styles.errorText}>{errors.plateNumber}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Couleur *</Text>
          <TextInput
            style={[styles.input, errors.color && styles.inputError]}
            value={color}
            onChangeText={setColor}
            placeholder="Ex: #2196F3 ou Bleu"
            placeholderTextColor={COLORS.textHint}
          />
          {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type de carburant *</Text>
          <TextInput
            style={[styles.input, errors.fuelType && styles.inputError]}
            value={fuelType}
            onChangeText={setFuelType}
            placeholder="Diesel, Essence, GPL..."
            placeholderTextColor={COLORS.textHint}
          />
          {errors.fuelType && <Text style={styles.errorText}>{errors.fuelType}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kilométrage initial *</Text>
          <TextInput
            style={[styles.input, errors.mileage && styles.inputError]}
            value={mileage}
            onChangeText={setMileage}
            placeholder="Ex: 50000"
            placeholderTextColor={COLORS.textHint}
            keyboardType="numeric"
          />
          {errors.mileage && <Text style={styles.errorText}>{errors.mileage}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Statut initial *</Text>
          <View style={styles.statusButtons}>
            {statuses.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusButton,
                  { backgroundColor: getStatusBg(s), borderColor: getStatusColor(s) },
                  status === s && styles.activeStatusButton,
                ]}
                onPress={() => setStatus(s)}
                activeOpacity={0.7}
              >
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(s) }]} />
                <Text style={[styles.statusButtonText, { color: getStatusColor(s) }]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kilométrage prévu pour la prochaine vidange *</Text>
          <TextInput
            style={[styles.input, errors.nextOilChangeMileage && styles.inputError]}
            value={nextOilChangeMileage}
            onChangeText={setNextOilChangeMileage}
            placeholder="Ex: 60000"
            placeholderTextColor={COLORS.textHint}
            keyboardType="numeric"
          />
          {errors.nextOilChangeMileage && (
            <Text style={styles.errorText}>{errors.nextOilChangeMileage}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Ajouter le camion</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
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
  form: {
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONT.title,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT.regular,
    color: COLORS.textHint,
    marginBottom: SPACING.xxl + SPACING.sm,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.lg,
    fontSize: FONT.medium,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: SPACING.xs,
    fontWeight: '500',
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
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.small,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONT.medium,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    marginTop: SPACING.md,
    backgroundColor: COLORS.surfaceAlt,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONT.medium,
    fontWeight: '600',
  },
});

export default AddTruckScreen;
