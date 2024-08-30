import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignUp } from "@/pages/signup";
import { Login } from "@/pages/login";
import { NavigationContainer } from "@react-navigation/native";
import MyTabs from "./MainNavigator";
import StartPage from "@/pages/startpage";
const AuthStack = createStackNavigator();

function AuthStackNavigator() {
  console.log("hello");
  return (
    <AuthStack.Navigator
      initialRouteName="StartPage"
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="StartPage" component={StartPage} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Main" component={MyTabs} />
    </AuthStack.Navigator>
  );
}

export default AuthStackNavigator;
