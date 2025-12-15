import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import HomeScreen from "./screens/Home/HomeScreen";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Main() {
  const { height: screenHeight } = Dimensions.get("window");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#101820", color: "#fff" }}>
        <View style={{
          flex: 1,
          backgroundColor: "#101820",
          // paddingTop: 10,
          display: "flex",
          flexDirection: "column",
          height: screenHeight,
          justifyContent: "flex-end"

        }}>
          {/* HEADER & SIDEBAR */}
          <Header
            onHamburgerPress={(page) => { setSidebarVisible(true) }}
          />
          <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

          <HomeScreen />

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
