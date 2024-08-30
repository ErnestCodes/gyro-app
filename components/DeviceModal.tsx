import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useCallback } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Device } from "react-native-ble-plx";

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
};

type DeviceModalProps = {
  devices: Device[];
  connectToPeripheral: (device: Device) => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const { item, connectToPeripheral } = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
  }, [connectToPeripheral, item.item]);

  return (
    <TouchableOpacity onPress={connectAndCloseModal} style={styles.ctaButton}>
      <Text style={styles.ctaButtonText}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

const DeviceModal = (props: DeviceModalProps) => {
  const { devices, connectToPeripheral } = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
        />
      );
    },
    [connectToPeripheral]
  );

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 16 }}>Tap to connect to device</Text>
      <FlatList
        contentContainerStyle={styles.modalFlatlistContiner}
        data={devices}
        renderItem={renderDeviceModalListItem}
      />
    </View>
  );
};

export default DeviceModal;

const styles = StyleSheet.create({
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
