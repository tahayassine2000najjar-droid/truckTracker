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

type RootStackParamList = {
  TruckList: { status: TruckStatus };
  TruckDetail: { truckId: string };
  AddTruck: { status: TruckStatus };
  EditTruck: { truckId: string };
};

type AddTruckScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTruck'>;
type AddTruckScreenRouteProp = RouteProp<RootStackParamList, 'AddTruck'>;

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
      newErrors.mileage = 'Le kilometrage est requis';
    } else if (isNaN(Number(mileage)) || Number(mileage) < 0) {
      newErrors.mileage = 'Le kilometrage doit etre un nombre valide';
    }

    if (!nextOilChangeMileage.trim()) {
      newErrors.nextOilChangeMileage = 'Le kilometrage de la prochaine vidange est requis';
    } else if (isNaN(Number(nextOilChangeMileage)) || Number(nextOilChangeMileage) < 0) {
      newErrors.nextOilChangeMileage = 'Le kilometrage doit etre un nombre valide';
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
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Ajouter un camion</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Immatriculation *</Text>
          <TextInput
            style={[styles.input, errors.plateNumber && styles.inputError]}
            value={plateNumber}
            onChangeText={setPlateNumber}
            placeholder="AB-123-CD"
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
          />
          {errors.fuelType && <Text style={styles.errorText}>{errors.fuelType}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kilometrage initial *</Text>
          <TextInput
            style={[styles.input, errors.mileage && styles.inputError]}
            value={mileage}
            onChangeText={setMileage}
            placeholder="Ex: 50000"
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
                  status === s && styles.activeStatusButton,
                ]}
                onPress={() => setStatus(s)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === s && styles.activeStatusButtonText,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kilometrage prevu pour la prochaine vidange *</Text>
          <TextInput
            style={[styles.input, errors.nextOilChangeMileage && styles.inputError]}
            value={nextOilChangeMileage}
            onChangeText={setNextOilChangeMileage}
            placeholder="Ex: 60000"
            keyboardType="numeric"
          />
          {errors.nextOilChangeMileage && (
            <Text style={styles.errorText}>{errors.nextOilChangeMileage}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Ajouter le camion</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
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
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  activeStatusButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  statusButtonText: {
    fontSize: 12,
    color: '#333',
  },
  activeStatusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default AddTruckScreen;
