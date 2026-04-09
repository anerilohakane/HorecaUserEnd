/**
 * Get the user's current latitude and longitude using the browser's Geolocation API.
 * @returns A promise that resolves to an object with lat and lng, or null if denied/failed.
 */
export async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    console.warn("Geolocation is not supported by this browser.");
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}
