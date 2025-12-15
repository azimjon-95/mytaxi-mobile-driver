import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Switch,
    Linking,
} from "react-native";
import { useDispatch } from 'react-redux';
import { requestPlay } from '../../context/actions/soundSlice';
import Icon from "react-native-vector-icons/MaterialIcons";
import Geolocation from "@react-native-community/geolocation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";

export default function Header({ onHamburgerPress }) {
    const [isWorking, setIsWorking] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [nextValue, setNextValue] = useState(false);
    const [gpsModalVisible, setGpsModalVisible] = useState(false);
    const driverRef = useRef(null);
    const dispatch = useDispatch();
    const watchId = useRef(null);
    const lastSentTime = useRef(0);

    const handleSwitchPress = (value) => {
        setNextValue(value);
        setConfirmVisible(true);
    };

    const checkGPS = () =>
        new Promise((resolve) => {
            Geolocation.getCurrentPosition(
                () => resolve(true),
                () => resolve(false),
                { enableHighAccuracy: true, timeout: 5000 }
            );
        });


    useEffect(() => {
        (async () => {
            const data = await AsyncStorage.getItem("driverData");
            if (data) driverRef.current = JSON.parse(data);
        })();
    }, []);

    // --- useEffect yordamida driverActive ni AsyncStorage ga saqlash ---
    useEffect(() => {
        const saveDriverActive = async () => {
            try {
                await AsyncStorage.setItem(
                    "driverActive",
                    JSON.stringify(isWorking)
                );
            } catch (err) {
                console.log("Driver active save error:", err.message);
            }
        };

        saveDriverActive();
    }, [isWorking]); // isWorking o‘zgarganda trigger bo‘ladi

    const sendLocationToServer = async (lat, lng) => {
        if (!driverRef.current?._id) return;

        try {
            await fetch("https://YOUR_API_URL/api/driver/location", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    latitude: lat,
                    longitude: lng,
                    driverId: driverRef.current._id,
                }),
            });

        } catch (err) {
            console.log("GPS send failed:", err.message);
        }
    };


    // GPS WATCH BOSHLASH
    const startTracking = () => {

        watchId.current = Geolocation.watchPosition(
            (pos) => {
                const now = Date.now();

                // ⏱ har 2 sekundda
                if (now - lastSentTime.current < 2000) return;
                lastSentTime.current = now;

                const { latitude, longitude } = pos.coords;
                sendLocationToServer(latitude, longitude);
            },
            (err) => console.log("GPS watch error:", err),
            {
                enableHighAccuracy: true,
                distanceFilter: 5,
            }
        );
    };

    // GPS WATCH TO‘XTATISH
    const stopTracking = () => {
        if (watchId.current !== null) {
            Geolocation.clearWatch(watchId.current);
            watchId.current = null;
        }
    };

    const confirmAction = async () => {
        if (nextValue) {
            dispatch(requestPlay())
            const gpsEnabled = await checkGPS();
            if (!gpsEnabled) {
                setConfirmVisible(false);
                setGpsModalVisible(true);
                return;
            }
            startTracking();
        } else {
            stopTracking();
        }

        setIsWorking(nextValue);
        setConfirmVisible(false);
    };

    // COMPONENT UNMOUNT
    useEffect(() => {
        return () => stopTracking();
    }, []);

    return (
        <>
            {/* HEADER */}
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
                    <Text style={styles.workText}>
                        {isWorking ? "Ishda" : "To‘xtatilgan"}
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
                        <Icon name="warning" size={42} color="#ffcc00" />
                        <Text style={styles.modalTitle}>
                            {nextValue
                                ? "Ishni boshlaysizmi?"
                                : "Ishni to‘xtatasizmi?"}
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setConfirmVisible(false)}
                            >
                                <Text style={styles.cancelText}>Yo‘q</Text>
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

            {/* GPS MODAL */}
            <Modal transparent animationType="fade" visible={gpsModalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Icon name="location-off" size={48} color="#ff4d4d" />
                        <Text style={styles.modalTitle}>GPS o‘chiq</Text>
                        <Text style={styles.gpsText}>
                            Ishni boshlash uchun GPS yoqilishi kerak
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setGpsModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Bekor</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.okBtn}
                                onPress={() => {
                                    setGpsModalVisible(false);
                                    Linking.openSettings();
                                }}
                            >
                                <Icon
                                    name="location-on"
                                    size={18}
                                    color="#101820"
                                />
                                <Text
                                    style={[
                                        styles.okText,
                                        { marginLeft: 6 },
                                    ]}
                                >
                                    GPS ni yoqish
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}
