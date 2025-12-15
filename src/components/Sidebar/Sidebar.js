import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    ScrollView,
    Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import sidebarStyles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PhoneNumberFormat } from "../../hooks/NumberFormat";

export default function Sidebar({ visible, onClose, navigation }) {
    const slideAnim = useState(new Animated.Value(-300))[0];
    const [driverData, setDriverData] = useState(null);

    useEffect(() => {
        const loadDriver = async () => {
            const value = await AsyncStorage.getItem("driverData");
            if (value) setDriverData(JSON.parse(value));
        };
        loadDriver();
    }, []);

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const handleLogout = async () => {
        await AsyncStorage.clear();
        onClose();
        navigation.replace("login");
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <Pressable style={sidebarStyles.sidebarOverlay} onPress={onClose}>
                <Animated.View
                    style={[
                        sidebarStyles.sidebar,
                        { transform: [{ translateX: slideAnim }] },
                    ]}
                    onStartShouldSetResponder={() => true}
                >
                    <ScrollView>

                        <DriverInfoBtn onClose={onClose}>
                            <View style={sidebarStyles.userSection}>
                                <View style={sidebarStyles.avatar}>
                                    <Text style={sidebarStyles.avatarText}>
                                        {driverData?.firstName?.[0]}
                                        {driverData?.lastName?.[0]}
                                    </Text>
                                </View>

                                <Text style={sidebarStyles.userName}>
                                    {driverData?.firstName} {driverData?.lastName}
                                </Text>

                                <Text style={sidebarStyles.userPhone}>
                                    {PhoneNumberFormat(driverData?.phoneNumber)}
                                </Text>

                                <Text style={sidebarStyles.menuSubtext}>
                                    🚗 {driverData?.car?.make} {driverData?.car?.model}
                                </Text>
                                <Text style={sidebarStyles.menuSubtext}>
                                    📄 {driverData?.car?.plateNumber}
                                </Text>
                            </View>
                        </DriverInfoBtn>



                        {/* BALANCE */}
                        <TouchableOpacity
                            style={sidebarStyles.menuItem}
                            onPress={() => {
                                onClose();
                                navigation.navigate("Balance");
                            }}
                        >
                            <Text style={sidebarStyles.menuIcon}>💳</Text>
                            <View>
                                <Text style={sidebarStyles.menuText}>Balans</Text>
                                <Text style={sidebarStyles.cashbackAmount}>
                                    {driverData?.balance} so‘m
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* DRIVER MENU */}
                        <View style={sidebarStyles.historySection}>
                            <Text style={sidebarStyles.historyTitle}>🚕 Haydovchi menyusi</Text>

                            <MenuBtn icon="⏱️" text="Taxometr" screen="Taxometer" />
                            <MenuBtn icon="📋" text="Buyurtmalar" screen="DriverOrders" />
                            <MenuBtn icon="📊" text="Daromadlar" screen="Earnings" />
                            <MenuBtn icon="⚙️" text="Sozlamalar" screen="DriverSettings" />
                        </View>

                        {/* LOGOUT */}
                        <TouchableOpacity
                            style={[sidebarStyles.menuItem, sidebarStyles.logoutItem]}
                            onPress={handleLogout}
                        >
                            <Text style={sidebarStyles.menuIcon}>🚪</Text>
                            <Text style={[sidebarStyles.menuText, sidebarStyles.logoutText]}>
                                Chiqish
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </Animated.View>
            </Pressable>
        </Modal>
    );

    function MenuBtn({ icon, text, screen, onClose, onPress }) {
        const navigation = useNavigation();

        const handlePress = () => {
            if (onClose) onClose();         // sidebarni yopish
            if (onPress) onPress(screen);   // parentga screen nomini yuborish
            navigation.navigate(screen);    // router orqali o'tish
        };

        return (
            <TouchableOpacity
                style={sidebarStyles.menuItem}
                onPress={handlePress}
            >
                <Text style={sidebarStyles.menuIcon}>{icon}</Text>
                <Text style={sidebarStyles.menuText}>{text}</Text>
            </TouchableOpacity>
        );
    }
    function DriverInfoBtn({ children, onClose }) {
        const navigation = useNavigation();

        const handlePress = () => {
            if (onClose) onClose();

            setTimeout(() => {
                navigation.navigate("DriverProfile");
            }, 150);
        };

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePress}
            >
                {children}
            </TouchableOpacity>
        );
    }

}
