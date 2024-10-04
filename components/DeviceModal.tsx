import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useCallback } from "react";
import { Device } from "react-native-ble-plx";

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: Device[];
  connectToPeripheral: (device: Device) => void;
  onCloseModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const { item, connectToPeripheral, closeModal } = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [connectToPeripheral, item.item]);

  return (
    <TouchableOpacity onPress={connectAndCloseModal} style={styles.ctaButton}>
      <Text style={styles.ctaButtonText}>HC-05</Text>
    </TouchableOpacity>
  );
};

const DeviceModal = (props: DeviceModalProps) => {
  const { devices, connectToPeripheral, onCloseModal } = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={onCloseModal}
        />
      );
    },
    [connectToPeripheral]
  );

  const emptyState = () => (
    <View>
      <Text style={{ fontStyle: "italic" }}>No device found...</Text>
    </View>
  );
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: 500 }}>
        Tap to connect device
      </Text>
      <FlatList
        contentContainerStyle={styles.modalFlatlistContiner}
        data={devices}
        renderItem={renderDeviceModalListItem}
        ListEmptyComponent={emptyState}
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
    backgroundColor: "green",
    marginVertical: 4,
    height: 50,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 28,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
