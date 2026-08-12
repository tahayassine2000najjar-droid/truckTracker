export type TruckStatus = 'En service' | 'À l\'arrêt' | 'En maintenance';

export interface Truck {
  id: string;
  plateNumber: string;
  color: string;
  fuelType: string;
  mileage: number;
  status: TruckStatus;
  nextOilChangeMileage: number;
}
