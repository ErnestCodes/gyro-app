import { BlurView } from "expo-blur";
import React from "react";
import DeviceModal from "@/components/DeviceModal";
import { useRouter } from "expo-router";
import useBle from "@/hooks/useBle";

const connect = () => {
  const router = useRouter();
  const { connectToDevice, allDevices } = useBle();

  return (
    <BlurView
      intensity={80}
      tint={"dark"}
      style={{ flex: 1, paddingTop: 100, backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <DeviceModal
        connectToPeripheral={connectToDevice}
        onCloseModal={() => router.back()}
        devices={allDevices}
      />
    </BlurView>
  );
};

export default connect;
