import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackNavigator from "./app/AuthStackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthStackNavigator />
    </NavigationContainer>
  );
}
