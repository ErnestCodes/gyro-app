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
  obstacleDetected: string;
  stepCount: number;
  caneHeld: string;
  px: number;
  py: number;
}

function useBle(): BluetoothClassicApi {
  const [allDevices, setAllDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any | null>(null);

  const [objectTemperature, setObjectTemperature] = useState<number>(0);
  const [movementStatus, setMovementStatus] = useState<string>("Searching..");
  const [totalAcceleration, setTotalAcceleration] = useState<number>(0);
  const [obstacleDetected, setObstacleDetected] = useState<string>("No");
  const [stepCount, setStepCount] = useState<number>(0);
  const [px, setPx] = useState<number>(0);
  const [py, setPy] = useState<number>(0);
  const [caneHeld, setCaneHeld] = useState<string>("No");

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

      // const hc05Devices = devices.filter(
      //   (device) =>
      //     device.name === "HC-05" || device.address === "98:D3:31:FC:43:F9" // Replace with actual MAC address if needed
      // );

      setAllDevices(devices);
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
      // Alert.alert("Device connected!");
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
      let ax = userInfo?.AccX;
      let ay = userInfo?.AccY;

      let aTotal = Math.sqrt(ax * ax + ay * ay);

      setObstacleDetected(userInfo?.obstacleDetected);
      setPx(10);
      setPy(5);
      setTotalAcceleration(80);
      setObjectTemperature(35);
      setCaneHeld(userInfo?.caneHeld as string);
      setStepCount(8);
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
    obstacleDetected,
    stepCount,
    caneHeld,
    px,
    py,
  };
}

export default useBle;
