// utils/dataMerger.js

export function mergeWithExistingData(existingData, newData) {
  for (const category in newData.data) {
    if (!existingData.data[category]) {
      existingData.data[category] = newData.data[category];
    } else {
      newData.data[category].forEach((newDevice) => {
        const existingDeviceIndex = existingData.data[category].findIndex(
          (existingDevice) => existingDevice.Model === newDevice.Model
        );

        if (existingDeviceIndex === -1) {
          existingData.data[category].push(newDevice);
        } else {
          const existingDevice = existingData.data[category][existingDeviceIndex];
          existingDevice.Price = newDevice.Price;
        }
      });
    }
  }
  return existingData;
}
