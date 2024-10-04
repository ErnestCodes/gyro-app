import { useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import RNBluetoothClassic from "react-native-bluetooth-classic"; // Import Bluetooth Classic

export interface Device {
  id: string; // The device's unique identifier
  name: string; // The device's name
  address: string; // The device's MAC address
  // You can add more properties as needed based on what the library returns
}

interface BluetoothClassicApi {
  requestPermissions(): Promise<boolean>;
  scanForDevices(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  objectTemperature: number;
  movementStatus: string;
  totalAcceleration: number;
  data: any[];
  obstacleDetected: string;
}

function useBle(): BluetoothClassicApi {
  const [allDevices, setAllDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any | null>(null);

  const [objectTemperature, setObjectTemperature] = useState<number>(0);
  const [movementStatus, setMovementStatus] = useState<string>("Searching..");
  const [totalAcceleration, setTotalAcceleration] = useState<number>(0);
  const [data, setData] = useState([{ value: 0 }, { value: 0 }]);
  const [obstacleDetected, setObstacleDetected] = useState<string>("No");

  // Request permissions (Android)
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Bluetooth Classic requires Location",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  };

  // Scan for nearby Bluetooth Classic devices
  const scanForDevices = async () => {
    try {
      const unpaired = await RNBluetoothClassic.startDiscovery();
      const paired = await RNBluetoothClassic.getBondedDevices();
      const devices = [...paired, ...unpaired];

      const hc05Devices = devices.filter(
        (device) =>
          device.name === "HC-05" || device.address === "98:D3:31:FC:43:F9" // Replace with actual MAC address if needed
      );

      setAllDevices(hc05Devices.length > 0 ? hc05Devices : []);
    } catch (error) {
      console.error("Error scanning for devices:", error);
    }
  };

  // Connect to the HC-05 device by ID
  const connectToDevice = async (connectedDevice: Device) => {
    try {
      const device = await RNBluetoothClassic.connectToDevice(
        connectedDevice?.id
      );
      setConnectedDevice(device);
      listenForData(device);
      Alert.alert("Device connected!");
    } catch (error) {
      Alert.alert("Error connecting to device");
      console.log("Error connecting to device:", error);
    }
  };

  // Disconnect from the connected device
  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      await RNBluetoothClassic.disconnectFromDevice(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  // Listen for incoming data from the HC-05
  const listenForData = (device: any) => {
    device.onDataReceived((data: any) => {
      console.log("Data received:", data.data);
      processData(data.data); // Process the data received from Arduino
    });
  };

  // Function to process the data coming from the HC-05
  const processData = (rawData: string) => {
    try {
      const userInfo = JSON.parse(rawData);
      let ax = Number(userInfo?.AccX) & 0x01;
      let ay = Number(userInfo?.AccY) & 0x01;

      let pX = Number(userInfo?.positionX) & 0x01;
      let pY = Number(userInfo?.positionY) & 0x01;

      let aTotal = Math.sqrt(ax * ax + ay * ay);

      setObstacleDetected(userInfo?.obstacleDetected);
      const data = [{ value: pX }, { value: pY }];
      setData(data);
      setTotalAcceleration(aTotal);
      setObjectTemperature(Number(userInfo?.objectTemperature) & 0x01);
      setMovementStatus(userInfo?.movement as string);
    } catch (error) {
      console.error("Error processing data:", error);
    }
  };

  return {
    scanForDevices,
    requestPermissions,
    connectToDevice,
    disconnectFromDevice,
    allDevices,
    connectedDevice,
    objectTemperature,
    movementStatus,
    totalAcceleration,
    data,
    obstacleDetected,
  };
}

export default useBle;
