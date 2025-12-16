import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { NotificationProvider } from "./src/components/Notification";
import MainLayout from "./src/components/layouts/MainLayout";
import { setAuth } from "./src/context/actions/authSlice";

import Login from "./src/screens/Login/Login";
import Home from "./src/screens/Home/HomeScreen";
import UserInfoScreen from "./src/screens/UserInfo/UserInfoScreen";
import TaxometerScreen from "./src/screens/Home/TaxometerScreen";
import DriverProfile from "./src/screens/Home/DriverProfile";
import { useSelector, useDispatch } from "react-redux";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    const bootstrap = async () => {
      const token = await AsyncStorage.getItem("driverToken");
      const driver = await AsyncStorage.getItem("driverData");

      if (token && driver) {
        dispatch(setAuth({ token, driver: JSON.parse(driver) }));
      }

      setIsLoading(false);
    };

    bootstrap();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#101820" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NotificationProvider>
      <StatusBar style="light" backgroundColor="#101820" />
      <View style={{ height: 34, backgroundColor: "#101820" }} />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* 🔐 AUTH */}
          {!isAuth ? (
            <>
              <Stack.Screen name="login" component={Login} />
            </>
          ) : (
            <>
              {/* 🧱 BARCHA SAHIFALAR LAYOUT ICHIDA */}
              <Stack.Screen name="Home">
                {(props) => (
                  <MainLayout>
                    <Home {...props} />
                  </MainLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="UserInfo">
                {(props) => (
                  <MainLayout>
                    <UserInfoScreen {...props} />
                  </MainLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="Taxometer">
                {(props) => (
                  <MainLayout>
                    <TaxometerScreen {...props} />
                  </MainLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="DriverProfile">
                {(props) => (
                  <MainLayout>
                    <DriverProfile {...props} />
                  </MainLayout>
                )}
              </Stack.Screen>
            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  );
}
