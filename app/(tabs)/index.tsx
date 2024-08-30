import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBLE from "@/hooks/useBle";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Speech from "expo-speech";
import DeviceModal from "@/components/DeviceModal";

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["35%"], []);
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    data,
    objectTemperature,
    obstacleDetected,
    movementStatus,
    totalAcceleration,
    // disconnectFromDevice,
  } = useBLE();

  useEffect(() => {
    if (obstacleDetected === "Yes") {
      Vibration.vibrate();
      Speech.speak("Object Detected");
    } else {
      return;
    }
  }, [obstacleDetected]);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
      bottomSheetModalRef.current?.present();
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <View style={[styles.topWrapper, { marginTop: top }]}>
          <Text style={styles.topWrapperText}>Let's start your day</Text>

          <TouchableOpacity
            style={{
              position: "relative",
            }}
          >
            <Image
              style={{ height: 50, width: 50 }}
              source={require("../../assets/images/profile.png")}
            />
            <View style={styles.notifier} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingHorizontal: 20,
            marginTop: 18,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 15 }}>
            Your Report
          </Text>
          <View style={styles.reportWrapper}>
            <View style={styles.reportContent}>
              <MaterialIcons name="directions-walk" size={35} color="black" />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "500" }}>
                  {totalAcceleration}mph
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "300" }}>
                  {movementStatus}
                </Text>
              </View>
            </View>

            <View style={styles.reportContent}>
              <MaterialCommunityIcons name="fire" size={35} color="black" />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "500" }}>
                  {objectTemperature} c
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "300" }}>
                  Temperature
                </Text>
              </View>
            </View>

            <View style={styles.reportContent}>
              <MaterialCommunityIcons
                name="battery-high"
                size={35}
                color="black"
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "500" }}>58%</Text>
                <Text style={{ fontSize: 14, fontWeight: "300" }}>Battery</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartWrapper}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 15 }}>
              Navigation Chart
            </Text>
            <View style={{ marginTop: 5 }}>
              <LineChart
                data={data}
                color={"#177AD5"}
                width={300}
                thickness={3}
                dataPointsColor={"#000"}
                showArrows={true}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.footerText}>Emergency Contact</Text>
              <Text style={[styles.footerText, { color: "#2F80ED" }]}>
                Change
              </Text>
            </View>
            <TouchableOpacity
              style={{
                padding: 18,
                backgroundColor: "#F2F2F2",
                borderRadius: 20,
              }}
              onPress={() => {
                const phoneNumber = "tel:080776654340";
                Linking.openURL(phoneNumber);
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "600" }}>
                080776654340
              </Text>
            </TouchableOpacity>
          </View>

          {!connectedDevice && (
            <TouchableOpacity style={styles.btn} onPress={scanForDevices}>
              <Text style={styles.btnPrimaryText}>Connect to device</Text>
            </TouchableOpacity>
          )}
        </View>
        <BottomSheetModal
          handleIndicatorStyle={{
            width: 35,
            backgroundColor: "#BAC3CC",
          }}
          handleStyle={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
          backdropComponent={renderBackdrop}
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          enableOverDrag={false}
          index={0}
          enablePanDownToClose
        >
          <BottomSheetView>
            <DeviceModal
              connectToPeripheral={connectToDevice}
              devices={allDevices}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  topWrapperText: { fontSize: 24, fontWeight: "700" },
  notifier: {
    position: "absolute",
    padding: 5,
    backgroundColor: "#2F80ED",
    borderRadius: 50,
    right: 3,
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    marginTop: 28,
  },
  footerText: { fontSize: 16, fontWeight: "600", marginBottom: 15 },
  chartWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    marginTop: 18,
  },
  reportContent: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  reportWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 0.9,
    borderColor: "#a3a3a3",
    borderRadius: 15,
    paddingVertical: 30,
  },
  btn: {
    marginVertical: 4,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 28,
    backgroundColor: "red",
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
  },
});
