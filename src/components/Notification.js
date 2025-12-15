import { useRef, useEffect, useState } from "react";
import { Animated, Text, StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

let globalShowNotification; // Global funksiya

export function NotificationProvider({ children }) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const [message, setMessage] = useState("");
    const [type, setType] = useState("success");
    const [visible, setVisible] = useState(false);

    const showNotification = (msg, notificationType = "success") => {
        setMessage(msg);
        setType(notificationType);
        setVisible(true);

        Animated.sequence([
            Animated.timing(translateY, {
                toValue: 20, // tepada
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 10, // o‘rta
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -100, // yuqoriga ketadi
                duration: 500,
                delay: 1000,
                useNativeDriver: true,
            }),
        ]).start(() => setVisible(false));
    };

    useEffect(() => {
        globalShowNotification = showNotification;
    }, []);

    return (
        <>
            {children}
            {visible && (
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ translateY }],
                            backgroundColor: type === "success" ? "#4BB543" : "#FF4D4D",
                        },
                    ]}
                >
                    <Text style={styles.text}>{message}</Text>
                </Animated.View>
            )}
        </>
    );
}

export function Notification(msg, type = "success") {
    if (globalShowNotification) {
        globalShowNotification(msg, type);
    } else {
        console.warn("NotificationProvider topilmadi!");
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 10,
        right: 10,
        alignSelf: "center",   // markazda turadi
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 10,
        zIndex: 9999,
        elevation: 999,
        alignItems: "center",
        maxWidth: "85%",       // uzun text ekran chetidan chiqmasin
    },
    text: {
        color: "rgb(16, 24, 32)",
        fontWeight: "bold",
    },
});
