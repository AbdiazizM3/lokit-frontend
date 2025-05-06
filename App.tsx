import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthProvider } from "./src/context/AuthContext";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { UserIdProvider } from './src/context/UserIdContext';

import SignUp from "./src/screens/SignUp";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import MyEvents from "./src/screens/MyEvents";
import Profile from "./src/screens/Profile";
import EventScreen from "./src/screens/EventScreen";
import TaskScreen from "./src/screens/TaskScreen";
import CreateEvent from "./src/screens/CreateEvent";
import CreateTask from "./src/screens/CreateTask";
import EditEvent from "./src/screens/EditEvent";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2D336B',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="MyEvents" 
        component={MyEvents}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return () => unsubscribe();
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <UserIdProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {user ? (
                <>
                  <Stack.Screen name="Main" component={TabNavigator} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                </>
              )}
              <Stack.Screen name="Event" component={EventScreen} />
              <Stack.Screen name="Task" component={TaskScreen} />
              <Stack.Screen name="CreateEvent" component={CreateEvent} />
              <Stack.Screen name="CreateTask" component={CreateTask} />
              <Stack.Screen name="EditEvent" component={EditEvent} />
            </Stack.Navigator>
          </NavigationContainer>
        </UserIdProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
} 