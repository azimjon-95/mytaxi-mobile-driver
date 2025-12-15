import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    Pressable,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import { setActiveOrder, setOrderLoading } from "../../context/actions/orderSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCreateOrderMutation } from "../../context/orderApi";
import Icon from 'react-native-vector-icons/Ionicons';
import dayjs from "dayjs";
import styles from "./styles/SliderStyles";
import { Notification } from "../../components/Notification";

// 🔥 Conditional import for native platforms only
// let MapView, Marker, PROVIDER_GOOGLE;
// if (Platform.OS !== 'web') {
//     const Maps = require('react-native-maps');
//     MapView = Maps.default;
//     Marker = Maps.Marker;
//     PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
// }

const carTypes = [
    {
        label: "Ekanom",
        value: "econom",
        image: require("../../assets/cars/ekanom.png"),
    },
    {
        label: "Komfort",
        value: "comfort",
        image: require("../../assets/cars/kamfort.png"),
    },
    {
        label: "Damas",
        value: "damas",
        image: require("../../assets/cars/damas.png"),
    },
    {
        label: "Labo",
        value: "labo",
        image: require("../../assets/cars/04.png"),
    },
];

const TimeSelectionModal = ({ visible, onClose, setTimeSelected, setHasDriver }) => {
    const dispatch = useDispatch();
    const timeOptions = [
        { label: "Chaqirish", value: "waiting" },
    ];
    const [selectedService, setSelectedService] = useState(null);
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedCar, setSelectedCar] = useState("econom");
    const [userLocation, setUserLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const mapRef = useRef(null);

    // 🔥 Get user location when modal opens
    useEffect(() => {
        if (visible) {
            getUserLocation();
        }
    }, [visible]);

    // 🔥 ADDITIONAL SERVICES LIST
    const additionalServices = [
        { value: "Dastavka", price: 15000 },
        { value: "Perimichka", price: 20000 },
        { value: "Shatak", price: 50000 },
        { value: "Bagaj", price: 15000 },
        { value: "Benzin", price: 15000 },
    ];

    const getUserLocation = async () => {
        try {
            setLoadingLocation(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Notification("Location ruxsat berilmadi", "error");
                setLoadingLocation(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setUserLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15,
            });
            setLoadingLocation(false);
        } catch (error) {
            console.error("Location error:", error);
            Notification("Location olishda xatolik", "error");
            setLoadingLocation(false);
        }
    };

    const sendOrder = async (timeOption) => {
        setSelectedTime(timeOption.label);
        dispatch(setOrderLoading(true));

        try {
            const userJson = await AsyncStorage.getItem("userData");
            const user = userJson ? JSON.parse(userJson) : null;
            if (!user) {
                Notification("Foydalanuvchi ma'lumotlari topilmadi", "error");
                setSelectedTime(null);
                return;
            }

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Notification("Location ruxsat berilmadi", "error");
                setSelectedTime(null);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            const coords = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            };

            const orderPrice = Math.floor(Math.random() * 30000) + 15000;
            const orderCashback = Math.floor(orderPrice * 0.1);

            let orderTime = dayjs();
            if (timeOption.value === "created") {
                if (timeOption.label === 1) {
                    orderTime = orderTime.add(1, "hour");
                } else {
                    orderTime = orderTime.add(timeOption.label, "minute");
                }
            }
            const formattedTime = orderTime.format("HH:mm");

            const newOrder = {
                id: Date.now(),
                clientId: user?._id,
                date: dayjs().format("YYYY-MM-DD"),
                time: formattedTime,
                from: user.address,
                to: "Manzil " + Math.floor(Math.random() * 100),
                price: orderPrice,
                cashback: orderCashback,
                when: timeOption.value,
                location: coords,
                phoneId: user.phone,
                carType: selectedCar,
                service: selectedService
            };

            const response = await createOrder(newOrder).unwrap();
            console.log(response);
            setHasDriver("availableDrivers");
            await AsyncStorage.setItem(
                "activeOrderStatus",
                JSON.stringify({
                    status: true, order: response?.innerData
                })
            );

            dispatch(setActiveOrder(response?.innerData));
            setTimeSelected(true);
            Notification("Buyurtma muvaffaqiyatli yaratildi", "success");

        } catch (e) {
            Notification(`Buyurtma yuborishda xatolik: ${e?.data.message}`, "error");
            setSelectedTime(null);
        } finally {
            setSelectedTime(null);
            dispatch(setOrderLoading(false));
            onClose();
        }
    };

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.015, // juda yaqin
                longitudeDelta: 0.015, // juda yaqin
            }, 1000); // 1 soniya animatsiya bilan
        }
    }, [userLocation]);
    // 🔥 Render Map Component
    const renderMap = () => {
        if (loadingLocation) {
            return (
                <View style={styles.mapLoading}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.mapLoadingText}>Joylashuv aniqlanmoqda...</Text>
                </View>
            );
        }

        if (!userLocation) {
            return (
                <View style={styles.mapError}>
                    <Text style={styles.mapErrorText}>Xarita yuklanmadi</Text>
                </View>
            );
        }

        // 🔥 For Web Platform - Use Yandex Map (No API key needed)
        // if (Platform.OS !== 'web') {
        const { latitude, longitude } = userLocation;

        return (
            <View style={styles.webLocationInfo}>
                <iframe
                    src={`https://yandex.uz/map-widget/v1/?ll=${longitude}%2C${latitude}&z=16&l=map&pt=${longitude},${latitude},pm2rdm`}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 0,
                        borderRadius: 15,
                    }}
                    allowFullScreen
                    loading="lazy"
                />
            </View>
        );
        // }

        // 🔥 For Native Platforms - Use react-native-maps
        // return (
        //     <View style={styles.webLocationInfo}>
        //         <MapView
        //             ref={mapRef}
        //             provider={PROVIDER_GOOGLE}
        //             style={styles.map}
        //             initialRegion={{
        //                 latitude: userLocation.latitude,
        //                 longitude: userLocation.longitude,
        //                 latitudeDelta: 0.007, // juda yaqin
        //                 longitudeDelta: 0.007, // juda yaqin
        //             }}
        //             showsMyLocationButton={true} // lokatsiya tugmasi qoladi
        //             showsUserLocation={false}    // default ko‘k nuqta yo‘q
        //             loadingEnabled={true}
        //             mapType="standard"
        //         >
        //             <Marker
        //                 coordinate={{
        //                     latitude: userLocation.latitude,
        //                     longitude: userLocation.longitude,
        //                 }}
        //                 title="Sizning joylashuvingiz"
        //                 description="Taksi shu yerga keladi"

        //             >
        //                 <Image
        //                     source={require("../../assets/you.png")} // marker uchun icon
        //                     style={{
        //                         width: 35,         // marker kengligi
        //                         height: 35,        // marker bo‘yi
        //                         resizeMode: "contain", // rasmni proportsional saqlash
        //                         marginBottom: 10,  // marker tipini koordinataga moslashtirish
        //                         shadowOffset: { width: 0, height: 2 },
        //                         shadowOpacity: 0.3,
        //                         shadowRadius: 2,
        //                         elevation: 5,       // Android uchun soya
        //                     }}
        //                 />
        //             </Marker>
        //         </MapView>
        //     </View>
        // );
    };

    return (
        <Modal animationType="slide" transparent visible={visible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                    {/* 🔥 MAP CONTAINER */}
                    <View style={styles.mapContainer}>
                        {renderMap()}
                    </View>

                    <Text style={styles.modalTitle}>Taksi turi</Text>

                    {/* CAR TYPE SLIDER */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {carTypes.map((car, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedCar(car.value)}
                                style={[
                                    styles.card,
                                    selectedCar === car.value && styles.activeCard,
                                ]}
                            >
                                <Image source={car.image} style={styles.image} />
                                <Text
                                    style={[
                                        styles.label,
                                        selectedCar === car.value && styles.activeLabel,
                                    ]}
                                >
                                    {car.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* QO‘ShIMChA XIZMATLAR */}
                    <Text style={[styles.modalTitle, { marginTop: 10 }]}>Qo'shimcha xizmatlar</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ marginBottom: 10 }}
                    >
                        {additionalServices.map((service) => {
                            const isSelected = selectedService?.value === service.value;

                            return (
                                <TouchableOpacity
                                    key={service.value}
                                    onPress={() => setSelectedService(isSelected ? null : service)}
                                    style={[
                                        styles.picker_li,
                                        isSelected && styles.activeCard_li,
                                    ]}
                                >
                                    <Text style={[styles.serviceText_li, isSelected && styles.activeLabel_li]}>
                                        {service.value}
                                    </Text>
                                    <Text style={[styles.priceText_li, isSelected && styles.activeLabel_li]}>
                                        {service.price.toLocaleString()} so‘m
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.timeContainer}>

                        {/* CANCEL BUTTON */}
                        <Pressable
                            style={[styles.cancelBtn, selectedTime && { opacity: 0.6 }]}
                            onPress={onClose}
                            disabled={!!selectedTime}
                        >
                            <Icon name="close" size={25} color="#ff3b3b" />
                        </Pressable>

                        {/* TIME BUTTONS */}
                        {timeOptions.map((t, i) => (
                            <Pressable
                                key={i}
                                style={[
                                    styles.timeBtn,
                                    selectedTime && selectedTime !== t.label && { opacity: 0.6 }
                                ]}
                                onPress={() => sendOrder(t)}
                                disabled={!!selectedTime}
                            >
                                {selectedTime === t.label && isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.timeBtnText}>
                                        {t.value === "created" && t.label === 1
                                            ? "1 soat"
                                            : t.value === "created"
                                                ? `${t.label} minut`
                                                : t.label}
                                    </Text>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default TimeSelectionModal;
