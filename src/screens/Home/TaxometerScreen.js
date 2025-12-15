import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function TaxometerScreen() {
    const [seconds, setSeconds] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (!running) return;
        const i = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(i);
    }, [running]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>{seconds} s</Text>

            <TouchableOpacity onPress={() => setRunning(!running)}>
                <Text style={{ fontSize: 20, marginTop: 20 }}>
                    {running ? "⛔ To‘xtatish" : "▶️ Boshlash"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
