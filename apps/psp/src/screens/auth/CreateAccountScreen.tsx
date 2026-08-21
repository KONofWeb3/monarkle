import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { register } from '../../lib/pspApi';
import { ApiError } from '../../lib/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAccount'>;

export default function CreateAccountScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canContinue = fullName.length > 1 && phone.length >= 7 && password.length >= 6 && vehicleType && plateNumber;

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await register({ fullName, phone, password, vehicleType, plateNumber });
      navigation.replace('ApplicationSubmitted');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not submit your application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Apply as a PSP" />
      <View style={{ marginBottom: spacing.xl }}>
        <Text style={styles.subtitle}>Tell us about you and your fleet. An admin will review your application.</Text>
      </View>

      <Input label="Full Name" placeholder="e.g. John Doe" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
      <Input label="Phone Number" placeholder="Enter your phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} secure />
      <Input label="Vehicle type" placeholder="e.g. Pickup Truck, Van" value={vehicleType} onChangeText={setVehicleType} />
      <Input label="Plate number" placeholder="e.g. LND-442-KJ" value={plateNumber} onChangeText={setPlateNumber} autoCapitalize="characters" />
      {error && <Text style={styles.error}>{error}</Text>}

      <Button label="Submit application" disabled={!canContinue} loading={loading} onPress={onSubmit} style={{ marginTop: spacing.md, marginBottom: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { ...typography.body, color: colors.textBody },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
});
