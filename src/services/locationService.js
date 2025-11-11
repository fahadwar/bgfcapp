export function requestLocationPermission() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      resolve({ granted: false, message: 'Location is not supported in this environment.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ granted: true, coords: position.coords });
      },
      (error) => {
        resolve({ granted: false, message: error.message });
      },
      { timeout: 10000 }
    );
  });
}

export function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
