import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBLE from "@/hooks/useBle";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import CustomModal from "@/components/CustomModal";
import DeviceModal from "@/components/DeviceModal";

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [action, setAction] = useState<string>("Start scan");

  const {
    requestPermissions,
    connectedDevice,
    px,
    py,
    obstacleDetected,
    movementStatus,
    caneHeld,
    stepCount,
    allDevices,
    scanForDevices,
    connectToDevice,
  } = useBLE();

  const router = useRouter();

  useEffect(() => {
    if (obstacleDetected === "Object detected") {
      Vibration.vibrate();
      Speech.speak("Obstacle Detected");

      const timeoutId = setTimeout(() => {
        Speech.stop();
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      return;
    }
  }, [obstacleDetected]);

  const scanDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForDevices();
      setShowModal(true);
      // router.navigate("/(modals)/connect" as any);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
            <MaterialIcons name="directions-walk" size={24} color="black" />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "500" }}>
                {stepCount}mph
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "300" }}>
                {movementStatus}
              </Text>
            </View>
          </View>

          <View style={styles.reportContent}>
            <MaterialCommunityIcons name="fire" size={24} color="black" />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "500" }}>35 c</Text>
              <Text style={{ fontSize: 14, fontWeight: "300" }}>
                Temperature
              </Text>
            </View>
          </View>

          <View style={styles.reportContent}>
            <MaterialIcons name="touch-app" size={24} color="black" />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "500" }}>
                {caneHeld === "Yes" ? "Cane Held" : "Not Held"}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "300" }}>Status</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartWrapper}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 15 }}>
            Navigation Chart
          </Text>
          <View style={{ marginTop: 5 }}>
            <LineChart
              data={[{ value: px }, { value: py }]}
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
          <TouchableOpacity style={styles.btn} onPress={scanDevices}>
            <Text style={styles.btnPrimaryText}>Connect to device</Text>
          </TouchableOpacity>
        )}
      </View>
      {showModal && (
        <CustomModal
          showCustomModal={showModal}
          setShowCustomModal={setShowModal}
          height={"95%"}
          color="white"
          opacityNum={0.2}
        >
          {allDevices.length > 0 ? (
            <DeviceModal
              connectToPeripheral={connectToDevice}
              onCloseModal={() => {
                setShowModal(!showModal);
              }}
              devices={allDevices}
            />
          ) : (
            <View
              style={{
                paddingHorizontal: 10,
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  setAction("Scanning...");
                  scanForDevices();
                }}
              >
                <Text style={styles.btnPrimaryText}>{action}</Text>
              </TouchableOpacity>
            </View>
          )}
        </CustomModal>
      )}
    </ScrollView>
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
