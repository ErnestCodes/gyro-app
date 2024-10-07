import { View, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { windowHeight, windowWidth } from "@/utils/dimension";

interface CustomModalProps {
  setShowCustomModal: (show: boolean) => void;
  showCustomModal: boolean;
  children: React.ReactNode;
  color?: string;
  height?: any;
  margin?: number;
  opacity?: boolean;
  opacityNum?: any;
}

const CustomModal = ({
  setShowCustomModal,
  showCustomModal,
  children,
  color,
  height,
  margin,
  opacity,
  opacityNum,
}: CustomModalProps) => {
  const toggleView = () => {
    setShowCustomModal(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={showCustomModal}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: windowHeight,
            width: windowWidth,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View
            style={{
              bottom: 0,
              justifyContent: "flex-start",
              backgroundColor: color || Colors?.tint,
              height: height || "95%",
              width: windowWidth,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              // 0.89
              opacity: opacity && opacityNum,
            }}
          >
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                margin: margin || 0,
              }}
              onPress={toggleView}
            >
              <Ionicons
                name="close-sharp"
                size={30}
                color={color === "white" ? "black" : "white"}
              />
            </TouchableOpacity>

            <View style={{ flex: 1, backgroundColor: "#fff" }}>{children}</View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
