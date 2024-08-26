import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";

const HomeScreen = () => {
  const data = [{ value: 15 }, { value: 30 }, { value: 26 }, { value: 40 }];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topWrapper}>
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
              <Text style={{ fontSize: 14, fontWeight: "500" }}>324mph</Text>
              <Text style={{ fontSize: 14, fontWeight: "300" }}>Walking</Text>
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
              <Text style={{ fontSize: 14, fontWeight: "500" }}>288 c</Text>
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
              padding: 20,
              backgroundColor: "#F2F2F2",
              borderRadius: 20,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "600" }}>
              080776654340
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
});
