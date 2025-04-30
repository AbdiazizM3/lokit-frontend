import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import Home from "./app/screens/Home";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

const InsideStackScreen = () => {
    return (
        <InsideStack.Navigator>
            <InsideStack.Screen name="Home" component={Home} />
        </InsideStack.Navigator>
    )
}

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setUser(user);
            if (initializing) setInitializing(false);
        });

        return unsubscribe;
    }, []);

    if (initializing) {
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            </GestureHandlerRootView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {user ? (
                        <Stack.Screen name="Inside" component={InsideStackScreen} />
                    ) : (
                        <Stack.Screen name="Login" component={Login} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    )
} 