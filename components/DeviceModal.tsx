import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useCallback } from "react";
import { Device } from "@/hooks/useBle";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

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
      <Text style={styles.ctaButtonText}>{item.item.name}</Text>
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
    <BottomSheetFlatList
      scrollEnabled={true}
      contentContainerStyle={styles.modalFlatlistContiner}
      showsVerticalScrollIndicator={false}
      data={devices}
      renderItem={renderDeviceModalListItem}
      maxToRenderPerBatch={3}
      ListEmptyComponent={emptyState}
      keyExtractor={(item) => item.id}
      windowSize={7}
    />
  );
};

export default DeviceModal;

const styles = StyleSheet.create({
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
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
