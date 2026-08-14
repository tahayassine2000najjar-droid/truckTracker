import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Truck, TruckStatus } from '../types/truck';
import { COLORS, SHADOWS, SPACING, RADIUS, FONT } from '../theme';

interface TruckCardProps {
  truck: Truck;
  onPress: () => void;
}

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

const TruckCard: React.FC<TruckCardProps> = ({ truck, onPress }) => {
  const oilChangeDue = truck.mileage >= truck.nextOilChangeMileage;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.statusBar, { backgroundColor: getStatusColor(truck.status) }]} />

      <View style={styles.content}>
        <View style={styles.header}>
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

        {oilChangeDue && (
          <View style={styles.oilChangeBanner}>
            <Text style={styles.oilChangeIcon}>!</Text>
            <Text style={styles.oilChangeText}>VIDANGE REQUISE</Text>
          </View>
        )}

        <View style={styles.details}>
          <View style={styles.detailCard}>
            <Text style={styles.detailIcon}>⛽</Text>
            <View>
              <Text style={styles.detailLabel}>Carburant</Text>
              <Text style={styles.detailValue}>{truck.fuelType}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailCard}>
            <Text style={styles.detailIcon}>📏</Text>
            <View>
              <Text style={styles.detailLabel}>Kilometrage</Text>
              <Text style={styles.detailValue}>{truck.mileage.toLocaleString()} km</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Prochaine vidange: {truck.nextOilChangeMileage.toLocaleString()} km
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  statusBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  plateNumber: {
    fontSize: FONT.bold,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    marginLeft: SPACING.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  oilChangeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  oilChangeIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.warning,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
    overflow: 'hidden',
  },
  oilChangeText: {
    color: COLORS.warning,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  detailCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textHint,
    fontWeight: '500',
    marginBottom: 1,
  },
  detailValue: {
    fontSize: FONT.medium,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  detailDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textHint,
    fontWeight: '500',
  },
});

export default TruckCard;
