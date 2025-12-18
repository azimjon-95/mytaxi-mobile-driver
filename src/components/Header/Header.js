import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Switch,
    Animated,
} from "react-native";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToggleDriverMutation } from "../../context/driverApi";
import getDistanceInMeters from "../../hooks/Distance";
import styles from "./styles";

export default function Header({ onHamburgerPress }) {
    const [isWorking, setIsWorking] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [nextValue, setNextValue] = useState(false);
    const lastLocationRef = useRef(null);
    const [isSendingLocation, setIsSendingLocation] = useState(false);

    const driverRef = useRef(null);
    const [toggleDriver] = useToggleDriverMutation();

    // Antena animatsiyasi
    const antennaScale = useRef(new Animated.Value(1)).current;
    const antennaOpacity = useRef(new Animated.Value(0.6)).current;

    // Location subscription ref
    const locationSubscriptionRef = useRef(null);

    // Driver ma'lumotlarini AsyncStorage-dan olish
    useEffect(() => {
        (async () => {
            const data = await AsyncStorage.getItem("driverData");
            const active = await AsyncStorage.getItem("driverActive");
            if (data) {
                driverRef.current = JSON.parse(data);
                setIsWorking(active ? JSON.parse(active) : false);
            }
        })();
    }, []);

    // Antena animatsiyasi
    useEffect(() => {
        if (isSendingLocation) {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(antennaScale, {
                        toValue: 1.2,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(antennaScale, {
                        toValue: 0.9,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(antennaOpacity, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(antennaOpacity, {
                        toValue: 0.6,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        }
    }, [isSendingLocation]);

    // Switch-ni bosganda confirm modal
    const handleSwitchPress = (value) => {
        setNextValue(value);
        setConfirmVisible(true);
    };

    // Confirm modaldagi action
    const confirmAction = async () => {
        try {
            const res = await toggleDriver({
                driverId: driverRef.current._id,
                isActive: nextValue,
            }).unwrap();

            await AsyncStorage.setItem(
                "driverActive",
                JSON.stringify(res?.innerData?.isActive || false)
            );

            setIsWorking(nextValue);

            // Agar ishni boshlash tasdiqlansa
            if (nextValue) startLocationTracking();
            else stopLocationTracking();
        } catch (err) {
            console.log("Driver toggle failed:", err?.data?.message || err);
        }

        setConfirmVisible(false);
    };

    // Location tracking boshlash
    const startLocationTracking = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        // Agar oldingi subscription bo‘lsa to‘xtatish
        if (locationSubscriptionRef.current) {
            locationSubscriptionRef.current.remove();
            locationSubscriptionRef.current = null;
        }

        locationSubscriptionRef.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                distanceInterval: 3, // faqat 3 metr siljiganida chaqiriladi
                timeInterval: 2000,  // 2 soniyadan tez chaqirmaydi
            },
            async (location) => {
                const { latitude, longitude, accuracy } = location.coords;

                // if (accuracy > 10) return;

                if (lastLocationRef.current) {
                    const distance = getDistanceInMeters(
                        lastLocationRef.current.latitude,
                        lastLocationRef.current.longitude,
                        latitude,
                        longitude
                    );
                    if (distance < 0) return;
                }

                lastLocationRef.current = { latitude, longitude };
                setIsSendingLocation(true);

                const token = await AsyncStorage.getItem("driverToken");
                await axios.post(
                    "/main/driver/location",
                    {
                        driverId: driverRef.current._id,
                        latitude,
                        longitude,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setIsSendingLocation(false);
            }
        );
    };

    // Location tracking to‘xtatish
    const stopLocationTracking = () => {
        if (locationSubscriptionRef.current) {
            locationSubscriptionRef.current.remove();
            locationSubscriptionRef.current = null;
        }
    };

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.hamburgerBtn}
                    onPress={onHamburgerPress}
                >
                    <View style={styles.hamburgerLine} />
                    <View style={styles.hamburgerLine} />
                    <View style={styles.hamburgerLine} />
                </TouchableOpacity>

                <View style={styles.workBox}>
                    {isWorking && (
                        <Animated.View
                            style={{
                                marginRight: 5,
                                transform: [{ scale: antennaScale }],
                                opacity: antennaOpacity,
                            }}
                        >
                            <MaterialIcons
                                name="cell-tower"
                                size={20}
                                color={isSendingLocation ? "#00ff7f" : "#888"}
                            />
                        </Animated.View>
                    )}

                    <Text style={styles.workText}>
                        {isWorking ? "Ishda" : "To'xtatilgan"}
                    </Text>
                    <Switch
                        value={isWorking}
                        onValueChange={handleSwitchPress}
                        trackColor={{ false: "#555", true: "#00ff7f" }}
                    />
                </View>
            </View>

            {/* CONFIRM MODAL */}
            <Modal transparent animationType="fade" visible={confirmVisible}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <MaterialIcons name="warning" size={42} color="#ffcc00" />
                        <Text style={styles.modalTitle}>
                            {nextValue ? "Ishni boshlaysizmi?" : "Ishni to'xtatasizmi?"}
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setConfirmVisible(false)}
                            >
                                <Text style={styles.cancelText}>Yo'q</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.okBtn}
                                onPress={confirmAction}
                            >
                                <Text style={styles.okText}>Ha</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}










// import React, { useState, useRef, useEffect } from "react";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     Modal,
//     Switch,
//     Animated,
// } from "react-native";
// import * as Location from "expo-location";
// import { MaterialIcons } from "@expo/vector-icons";
// import axios from "../../api";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useToggleDriverMutation } from "../../context/driverApi";
// import getDistanceInMeters from "../../hooks/Distance";
// import styles from "./styles";

// export default function Header({ onHamburgerPress }) {
//     const [isWorking, setIsWorking] = useState(false);
//     const [confirmVisible, setConfirmVisible] = useState(false);
//     const [nextValue, setNextValue] = useState(false);
//     const lastLocationRef = useRef(null);
//     const [isSendingLocation, setIsSendingLocation] = useState(false);

//     const driverRef = useRef(null);
//     const [toggleDriver] = useToggleDriverMutation();

//     // Antena animatsiyasi uchun
//     const antennaScale = useRef(new Animated.Value(1)).current;
//     const antennaOpacity = useRef(new Animated.Value(0.6)).current;

//     useEffect(() => {
//         (async () => {
//             const data = await AsyncStorage.getItem("driverData");
//             const active = await AsyncStorage.getItem("driverActive");
//             if (data) {
//                 driverRef.current = JSON.parse(data);
//                 setIsWorking(active ? JSON.parse(active) : false);
//             }
//         })();
//     }, []);

//     // Antena animatsiyasi
//     useEffect(() => {
//         if (isSendingLocation) {
//             Animated.parallel([
//                 Animated.sequence([
//                     Animated.timing(antennaScale, {
//                         toValue: 1.2,
//                         duration: 300,
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(antennaScale, {
//                         toValue: 0.9,
//                         duration: 300,
//                         useNativeDriver: true,
//                     }),
//                 ]),
//                 Animated.sequence([
//                     Animated.timing(antennaOpacity, {
//                         toValue: 1,
//                         duration: 300,
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(antennaOpacity, {
//                         toValue: 0.6,
//                         duration: 300,
//                         useNativeDriver: true,
//                     }),
//                 ]),
//             ]).start();
//         }
//     }, [isSendingLocation]);

//     useEffect(() => {
//         let locationInterval = null;

//         if (isWorking) {
//             getUserLocation();  // 1️⃣

//             locationInterval = setInterval(() => {
//                 getUserLocation(); // 2️⃣
//             }, 2000);
//         }

//         return () => {
//             if (locationInterval) clearInterval(locationInterval);
//         };
//     }, [isWorking]);

//     const getUserLocation = async () => {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") return;
//         const token = await AsyncStorage.getItem("driverToken");
//         Location.watchPositionAsync(
//             {
//                 accuracy: Location.Accuracy.High,
//                 distanceInterval: 3, // faqat 3 metr siljiganida chaqiriladi
//                 timeInterval: 2000,   // yoki 2 sekunddan tez chaqirmaydi
//             },
//             async (location) => {
//                 const { latitude, longitude, accuracy } = location.coords;

//                 // GPS ishonchsiz bo‘lsa yubormaymiz
//                 if (accuracy > 10) return;

//                 // Oldingi location bilan masofa tekshiruvi (optional)
//                 if (lastLocationRef.current) {
//                     const distance = getDistanceInMeters(
//                         lastLocationRef.current.latitude,
//                         lastLocationRef.current.longitude,
//                         latitude,
//                         longitude
//                     );
//                     if (distance < 3) return; // faqat 4+ metr bo‘lsa yuborish
//                 }

//                 // Yangi location-ni saqlaymiz
//                 lastLocationRef.current = { latitude, longitude };
//                 setIsSendingLocation(true);

//                 await axios.post(
//                     "/main/driver/location",
//                     {
//                         driverId: driverRef.current._id,
//                         latitude,
//                         longitude,
//                     },
//                     {
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 setIsSendingLocation(false);
//             }
//         );
//     };

//     const handleSwitchPress = (value) => {
//         setNextValue(value);
//         setConfirmVisible(true);
//     };

//     const confirmAction = async () => {
//         try {
//             const res = await toggleDriver({
//                 driverId: driverRef.current._id,
//                 isActive: nextValue, // 🔴 MUHIM
//             }).unwrap();

//             await AsyncStorage.setItem("driverActive", JSON.stringify(res?.innerData?.isActive) || false);

//             setIsWorking(nextValue); // UI bilan sinxron
//         } catch (err) {
//             console.log("Driver toggle failed:", err?.data?.message || err);
//         }

//         setConfirmVisible(false);
//     };

//     return (
//         <>
//             <View style={styles.header}>
//                 <TouchableOpacity
//                     style={styles.hamburgerBtn}
//                     onPress={onHamburgerPress}
//                 >
//                     <View style={styles.hamburgerLine} />
//                     <View style={styles.hamburgerLine} />
//                     <View style={styles.hamburgerLine} />
//                 </TouchableOpacity>

//                 <View style={styles.workBox}>
//                     {/* Antena Icon */}
//                     {isWorking && (
//                         <Animated.View
//                             style={{
//                                 marginRight: 5,
//                                 transform: [{ scale: antennaScale }],
//                                 opacity: antennaOpacity,
//                             }}
//                         >
//                             <MaterialIcons
//                                 name="cell-tower"
//                                 size={20}
//                                 color={isSendingLocation ? "#00ff7f" : "#888"}
//                             />
//                         </Animated.View>
//                     )}

//                     <Text style={styles.workText}>
//                         {isWorking ? "Ishda" : "To'xtatilgan"}
//                     </Text>
//                     <Switch
//                         value={isWorking}
//                         onValueChange={handleSwitchPress}
//                         trackColor={{ false: "#555", true: "#00ff7f" }}
//                     />
//                 </View>
//             </View>

//             {/* CONFIRM MODAL */}
//             <Modal transparent animationType="fade" visible={confirmVisible}>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalBox}>
//                         <MaterialIcons name="warning" size={42} color="#ffcc00" />
//                         <Text style={styles.modalTitle}>
//                             {nextValue ? "Ishni boshlaysizmi?" : "Ishni to'xtatasizmi?"}
//                         </Text>

//                         <View style={styles.modalActions}>
//                             <TouchableOpacity
//                                 style={styles.cancelBtn}
//                                 onPress={() => setConfirmVisible(false)}
//                             >
//                                 <Text style={styles.cancelText}>Yo'q</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={styles.okBtn}
//                                 onPress={confirmAction}
//                             >
//                                 <Text style={styles.okText}>Ha</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>

//         </>
//     );
// }