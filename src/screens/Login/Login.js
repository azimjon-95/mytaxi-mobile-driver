import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "./styles";
import { useDispatch } from "react-redux";
import { setAuth } from "../../context/actions/authSlice";
import { useDriverLoginMutation } from "../../context/driverApi";

export default function DriverLoginScreen({ navigation }) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [secure, setSecure] = useState(true);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [driverLogin, { isLoading }] = useDriverLoginMutation();

    const handleLogin = async () => {
        if (!login || password.length < 4) {
            alert("Login yoki parol noto‘g‘ri");
            return;
        }

        try {
            setLoading(true);

            const res = await driverLogin({ login, password }).unwrap();

            await AsyncStorage.setItem("driverToken", res?.innerData?.token);
            await AsyncStorage.setItem("driverData", JSON.stringify(res?.innerData?.driver));

            dispatch(
                setAuth({
                    token: res.innerData.token,
                    driver: res.innerData.driver,
                })
            );
        } catch (err) {
            alert("Login yoki parol xato");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Shafyor uchun kirish</Text>
                <Text style={styles.subtitle}>
                    Login va parolingizni kiriting
                </Text>
            </View>

            {/* LOGIN INPUT */}
            <View style={styles.inputContainer}>
                <Icon name="person" size={22} color="rgb(0,255,127)" />
                <TextInput
                    style={styles.input}
                    placeholder="Login yoki telefon"
                    placeholderTextColor="#00ff8097"
                    value={login}
                    onChangeText={setLogin}
                    autoCapitalize="none"
                />
            </View>

            {/* PASSWORD INPUT */}
            <View style={styles.inputContainer}>
                <Icon name="lock" size={22} color="rgb(0,255,127)" />
                <TextInput
                    style={styles.input}
                    placeholder="Parol"
                    placeholderTextColor="#00ff8097"
                    secureTextEntry={secure}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)}>
                    <Icon
                        name={secure ? "visibility-off" : "visibility"}
                        size={22}
                        color="rgb(0,255,127)"
                    />
                </TouchableOpacity>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
                style={[
                    styles.btn,
                    (loading || !login || password.length < 4) &&
                    styles.btnDisabled,
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#101820" />
                ) : (
                    <Text style={styles.btnText}>Kirish</Text>
                )}
            </TouchableOpacity>

            {/* FOOTER */}
            <Text style={styles.disclaimer}>
                Muammo bo‘lsa диспетчер bilan bog‘laning
            </Text>
        </View>
    );
}
