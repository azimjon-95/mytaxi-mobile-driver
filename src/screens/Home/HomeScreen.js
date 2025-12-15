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
import { useGetOrderByDriverIdQuery } from '../../context/orderApi';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TimeSelectionModal from "./TimeSelectionModal";
import styles from "./styles/Home";

export default function Main({ navigation, setHasDriver }) {

    /* ===================== STATES ===================== */
    const [modalVisible, setModalVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const playRequest = useSelector(state => state.sound.playRequest);
    const [riverData, setDriverData] = useState(null);


    const soundRef = useRef(null);

    /* ===================== LOAD DRIVER STATUS ===================== */
    useEffect(() => {
        (async () => {
            const driver = JSON.parse(await AsyncStorage.getItem("driverData"));
            setDriverData(driver?._id);
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

    /* ===================== PLAY NOTIFICATION ===================== */
    const playNotificationSound = async () => {
        try {
            // if (!soundRef.current) return;
            await soundRef.current.replayAsync();
            Vibration.vibrate(100);
        } catch (e) {
            console.log("Play error:", e);
        }
    };


    /* ===================== ACCEPT ORDER ===================== */
    const handleAcceptOrder = async (order) => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert("Lokatsiyaga ruxsat berilmadi");
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setOrders(prev =>
                prev.map(o =>
                    o.id === order.id
                        ? {
                            ...o,
                            accepted: true,
                            driverLocation: {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }
                        }
                        : o
                )
            );
        } catch (e) {
            console.log("Accept error:", e);
        }
    };

    /* ===================== OPEN ROUTE ===================== */
    const handleOpenRoute = (order) => {
        if (!order.driverLocation) return;

        const { latitude, longitude } = order.location;
        const destination = encodeURIComponent(order.to);

        const url = Platform.select({
            android: `google.navigation:q=${destination}&mode=d`,
            ios: `maps://?saddr=${latitude},${longitude}&daddr=${destination}`,
        });

        Linking.openURL(url);
    };

    /* ===================== ORDER CARD ===================== */
    const OrderCard = ({ order }) => {
        // const anims = animatedValues.current[order._id];
        const anims = order;

        return (
            <Animated.View
                style={[
                    styles.orderCard,
                    {
                        transform: [
                            { translateX: anims.translateX },
                            { translateY: anims.translateY },
                            { scale: anims.scale },
                        ],
                        opacity: anims.opacity,
                    }
                ]}
            >
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
                        <View style={styles.acceptBtn} onPress={() => handleOpenRoute(order)}>
                            <Icon name="map" size={20} color="#2ecc71" />
                        </View>
                    </View>

                    {/* FOOTER */}
                    <View style={styles.orderFooter}>
                        <View style={styles.routeContainer}>
                            <Text style={styles.locationText}>{order?.service ? `${order?.service.value}  - ` : ""} {order.to}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.routeBtn}
                            // disabled={order.accepted}
                            onPress={() => handleAcceptOrder(order)}
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

            {!data?.innerData?.isActive && (
                <View style={styles.inactiveBanner}>
                    <Text style={styles.inactiveText}>
                        🚨 Siz hozir faol emassiz
                    </Text>
                </View>
            )}

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
        </View>
    );
}
