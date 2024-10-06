import { BlurView } from "expo-blur";
import React, { useState } from "react";
import DeviceModal from "@/components/DeviceModal";
import { useRouter } from "expo-router";
import useBle from "@/hooks/useBle";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

const connect = () => {
  const router = useRouter();
  const { connectToDevice, allDevices, scanForDevices } = useBle();
  const [action, setAction] = useState("Start scan");

  return (
    <BlurView
      intensity={80}
      tint={"dark"}
      style={{ flex: 1, paddingTop: 100, backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      {allDevices.length > 0 ? (
        <DeviceModal
          connectToPeripheral={connectToDevice}
          onCloseModal={() => router.back()}
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
    </BlurView>
  );
};

export default connect;

const styles = StyleSheet.create({
  btn: {
    marginVertical: 4,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 28,
    backgroundColor: "blue",
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
  },
});
