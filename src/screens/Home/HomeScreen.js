import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    Animated,
    TouchableOpacity,
    Vibration,
    Platform,
    Linking
} from "react-native";
import socket from "../../socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import { useSelector } from 'react-redux';
import { useGetOrderByDriverIdQuery, useAssignDriverByClientMutation } from '../../context/orderApi';
import { useGetDriverlocationByIdQuery } from '../../context/driverApi';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TimeSelectionModal from "./TimeSelectionModal";
import styles from "./styles/Home";

export default function Main({ navigation, setHasDriver }) {

    /* ===================== STATES ===================== */
    const [modalVisible, setModalVisible] = useState(false);
    const playRequest = useSelector(state => state.sound.playRequest);
    const [riverData, setDriverData] = useState(null);
    const [driverIsActive, setDriverIsActive] = useState(false);
    const [assignDriver, { isLoading }] = useAssignDriverByClientMutation();
    const soundRef = useRef(null);

    // const { data: driverLocation, refetch: driverLocationRefetch } = useGetDriverlocationByIdQuery(riverData);
    // useEffect(() => {
    //     const eventName = `driverLocationUpdated`;

    //     socket.on(eventName, () => {
    //         driverLocationRefetch();
    //     });
    //     return () => socket.off(eventName);
    // }, [driverLocationRefetch]);
    // console.log(driverLocation);


    /* ===================== LOAD DRIVER STATUS ===================== */
    useEffect(() => {
        (async () => {
            const driver = JSON.parse(await AsyncStorage.getItem("driverData"));
            const active = JSON.parse(await AsyncStorage.getItem("driverActive"));
            setDriverData(driver?._id);
            setDriverIsActive(active);
        })();
    }, []);

    const { data, refetch } = useGetOrderByDriverIdQuery(riverData);

    useEffect(() => {
        const eventName = `driver:${riverData}`;

        socket.on(eventName, () => {
            refetch();
        });
        return () => socket.off(eventName);
    }, [refetch]);


    /* ===================== LOAD SOUND ONCE ===================== */
    useEffect(() => {
        (async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/NOTIFICATIOM.mp3')
            );
            soundRef.current = sound;
        })();
    }, []);

    useEffect(() => {
        if (playRequest && soundRef.current) {
            soundRef.current.replayAsync(); // signal kelgan zahoti chaladi
        }
    }, [playRequest]);


    const handleAssignDriver = async (order) => {
        if (!riverData) {
            console.log("Driver topilmadi");
            return;
        }
        if (!order?.location || !data?.innerData?.driverLocation) {
            console.log("Location topilmadi");
            return;
        }

        try {
            const response = await assignDriver({
                orderId: order._id,
                driverId: riverData,
                driverLocation: data.innerData.driverLocation,
                clientLocation: order.location
            }).unwrap(); // unwrap → promise resolve qilinadi yoki xatolik throw qilinadi

            console.log("Driver assigned successfully:", response);
        } catch (err) {
            console.error("Assign driver error:", err);
        }
    };

    /* ===================== OPEN ROUTE ===================== */
    const handleOpenRoute = async (order) => {
        const driverLocation = data?.innerData?.driverLocation;
        if (!driverLocation || !order?.location) {
            console.log("Location topilmadi");
            return;
        }

        const startLat = driverLocation.latitude;
        const startLng = driverLocation.longitude;
        const endLat = order.location.latitude;
        const endLng = order.location.longitude;

        let url = "";
        let fallbackUrl = "";

        if (Platform.OS === "android") {
            url = `google.navigation:q=${endLat},${endLng}&mode=d`;
            fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${endLat},${endLng}`;
        } else if (Platform.OS === "ios") {
            url = `yandexmaps://maps.yandex.com/?rtext=${startLat},${startLng}~${endLat},${endLng}&rtt=auto`;
            fallbackUrl = `https://yandex.com/maps/?rtext=${startLat},${startLng}~${endLat},${endLng}&rtt=auto`;
        }
        else {
            // ✅ WINDOWS / WEB → Browser orqali Yandex Maps
            url = `https://yandex.com/maps/?rtext=${startLat},${startLng}~${endLat},${endLng}&rtt=auto`;
        }

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                await Linking.openURL(fallbackUrl);
            }
        } catch (err) {
            console.error("Map open error:", err);
        }
    };


    /* ===================== ORDER CARD ===================== */
    const OrderCard = ({ order }) => {

        return (
            <Animated.View style={styles.orderCard} >
                {/* HEADER */}
                <View >
                    <View style={styles.orderHeader}>
                        <View style={styles.customerBadge}>
                            <Icon name="person" size={18} color="#fff" />
                            <Text style={styles.customerName}>{order?.clientId.name} {order?.clientId.surname}</Text>
                        </View>

                        <View style={styles.distanceBadge}>
                            <Icon name="directions-car" size={16} color="#fff" />
                            <Text style={styles.distanceText}>{order.distance} km</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={() => handleOpenRoute(order)}
                        >
                            <Icon name="map" size={20} color="#2ecc71" />
                        </TouchableOpacity>

                    </View>

                    {/* FOOTER */}
                    <View style={styles.orderFooter}>
                        <View style={styles.routeContainer}>
                            <Text style={styles.locationText}>{order?.service ? `${order?.service.value}  - ` : ""} {order.to}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.routeBtn}
                            disabled={isLoading}
                            loading={isLoading}
                            onPress={() => handleAssignDriver(order)}
                        >
                            <Icon name="check-circle" size={18} color="#1e293be2" />
                            <Text style={styles.btnText}>Qabul qilish</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    };

    /* ===================== RENDER ===================== */
    return (
        <View style={styles.container}>

            {driverIsActive === false && (
                <View style={styles.inactiveBanner}>
                    <Text style={styles.inactiveText}>
                        🚨 Siz hozir faol emassiz
                    </Text>
                </View>
            )}
            {driverIsActive === true && (
                <>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {data?.innerData?.orders.map((order, index) => (
                            <OrderCard key={index} order={order} />
                        ))}
                    </ScrollView>

                    <TimeSelectionModal
                        visible={modalVisible}
                        setHasDriver={setHasDriver}
                        onClose={() => setModalVisible(false)}
                    />
                </>)}

        </View>
    );
}
