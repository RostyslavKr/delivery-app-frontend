export const getBrovserLocation = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude: lat, longitude: lng } = pos.coords;
          resolve({ lat, lng });
        },
        () => {
          reject(null);
        }
      );
    } else {
      reject(null);
    }
  });
};
