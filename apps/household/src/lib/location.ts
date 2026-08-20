import * as Location from 'expo-location';

export type ResolvedLocation = { address: string; latitude: number; longitude: number };

/**
 * Requests foreground location permission (if not already granted), reads
 * the device's current position, and reverse-geocodes it into a readable
 * address string. Returns null if permission is denied — callers should
 * fall back to manual entry rather than throw.
 */
export async function getCurrentAddress(): Promise<ResolvedLocation | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const { latitude, longitude } = position.coords;

  const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
  const address = place
    ? [place.streetNumber, place.street, place.district ?? place.subregion, place.city ?? place.region]
        .filter(Boolean)
        .join(', ')
    : `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

  return { address: address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`, latitude, longitude };
}
