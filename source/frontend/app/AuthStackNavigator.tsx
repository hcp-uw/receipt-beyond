import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignUp } from "@/pages/signup";
import { Login } from "@/pages/login";
import { NavigationContainer } from "@react-navigation/native";
import MyTabs from "./MainNavigator";
import StartPage from "@/pages/startpage";
import { AuthStackParamList } from "../app/StackParamList";

const AuthStack = createStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Start"
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="Start" component={StartPage} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitleVisible: true,
          headerStyle: {
            backgroundColor: "#29353C", // Set the top banner background to black
            shadowOpacity: 0, // Remove shadow on iOS
          },
        }}
      />
      <AuthStack.Screen name="Main" component={MyTabs} />
    </AuthStack.Navigator>
  );
}

export default AuthStackNavigator;
