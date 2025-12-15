import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useUpdateDriverMutation } from "../../context/driverApi";
import { useGetServicesQuery } from "../../context/configApi";
import { Notification } from "../../components/Notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // agar expo bo‘lsa
import styles from "./styles/driverProfileStyles";

export default function DriverProfile() {
    const [driver, setDriver] = useState(null);
    const [updateDriver] = useUpdateDriverMutation();
    const { data: services } = useGetServicesQuery();
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const data = await AsyncStorage.getItem("driverData");
            if (data) setDriver(JSON.parse(data));
        })();
    }, []);

    const updateField = (key, value) => {
        setDriver({ ...driver, [key]: value });
    };

    const toggleService = (service) => {
        setDriver(prev => {
            const current = prev.additionalServices || [];
            const exists = current.some(item => item._id === service._id);

            if (exists) {
                return {
                    ...prev,
                    additionalServices: current.filter(item => item._id !== service._id)
                };
            } else {
                return {
                    ...prev,
                    additionalServices: [...current, service]
                };
            }
        });
    };
    const saveProfile = async () => {
        try {
            const res = await updateDriver({
                id: driver._id,  // Muhim: driver ID yuborilishi kerak
                body: {
                    firstName: driver.firstName,
                    lastName: driver.lastName,
                    phoneNumber: driver.phoneNumber,
                    address: driver.address,
                    login: driver.login,
                    password: driver.password || undefined, // bo'sh parol yuborilmasin (agar o'zgarmasa)
                    additionalServices: driver.additionalServices?.map(s => s._id) || [],
                },
            }).unwrap();
            await AsyncStorage.setItem("driverData", JSON.stringify(res?.innerData) || res);
            Notification("✅ Muvaffaqiyatli", "success");
        } catch (err) {
        }
        console.log(err);
    };
    const serviceList = services?.message || [];
    if (!driver) return null;

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.row, {
                alignItems: "center",
                marginBottom: 20,
            }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>

                <Text style={styles.title}>👤 Haydovchi profili</Text>
            </View>
            {/* EDITABLE */}
            <View style={styles.row}>
                <Input label="Ism" value={driver.firstName} onChange={v => updateField("firstName", v)} />
                <Input label="Familiya" value={driver.lastName} onChange={v => updateField("lastName", v)} />
            </View>

            <View style={styles.row}>
                <Input label="Tug‘ilgan sana" value={driver.birthDate.slice(0, 10)} />
                <Input label="Telefon" value={driver.phoneNumber} onChange={v => updateField("phoneNumber", v)} />
            </View>

            <View style={styles.row}>
                <Input label="Manzil" value={driver.address} onChange={v => updateField("address", v)} />
                <Input label="Login" value={driver.login} onChange={v => updateField("login", v)} />
            </View>

            <View style={styles.row}>
                <Input label="Parol" value={driver.password} secure onChange={v => updateField("password", v)} />
            </View>

            {/* ADDITIONAL SERVICES */}
            <Text style={styles.sectionTitle}>➕ Qo‘shimcha xizmatlar</Text>


            {serviceList?.map(s => {
                const active = driver?.additionalServices?.some(a => a?._id === s._id);
                return (
                    <TouchableOpacity
                        key={s._id}
                        style={[styles.serviceRow, active && styles.activeService]}
                        onPress={() => toggleService(s)}
                    >
                        <Text style={styles.serviceText}>{s.value} ({s?.price} so‘m)</Text>
                        <Text>{active ? "✅" : "➕"}</Text>
                    </TouchableOpacity>
                );
            })}

            {/* READ ONLY */}
            <Text style={styles.sectionTitle}>🚗 Avtomobil</Text>
            <View style={styles.row}>
                <Readonly label="Mashina" value={`${driver.car.make} ${driver.car.model}`} />
                <Readonly label="Yil" value={driver.car.year} />
            </View>
            <View style={styles.row}>
                <Readonly label="Rang" value={driver.car.color} />
                <Readonly label="Raqam" value={driver.car.plateNumber} />
            </View>
            <Readonly label="Tarif" value={driver.car.carType.label} />

            <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                <Text style={styles.saveText}>💾 Saqlash</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

function Input({ label, value, onChange, secure }) {
    return (
        <View style={styles.inputBoxHalf}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChange}
                secureTextEntry={secure}
                style={styles.input}
            />
        </View>
    );
}

function Readonly({ label, value }) {
    return (
        <View style={styles.inputBox}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.readonly}>{value}</Text>
        </View>
    );
}
