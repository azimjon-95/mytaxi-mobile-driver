import React, { useState } from "react";
import { View } from "react-native";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function MainLayout({ children }) {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: "#101820" }}>
            <Header onHamburgerPress={() => setSidebarVisible(true)} />

            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />

            <View style={{ flex: 1 }}>
                {children}
            </View>
        </View>
    );
}
