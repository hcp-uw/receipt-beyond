import React from "react";
import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import {
  Entypo,
  MaterialIcons,
  Foundation,
  AntDesign,
} from "@expo/vector-icons";

// Import screens
import { Summary } from "@/pages/summary";
import PriceWatch from "@/pages/pricewatch";
import { UserValid } from "@/pages/uservalid";
import { History } from "@/pages/history";
import { Account } from "@/pages/account";
import { EditProfile } from "@/pages/editprofile";
import { DetailedHistory } from "@/pages/detailedhistory";
import { Capture } from "@/pages/capture";

import {
  SummaryStackParamList,
  PriceWatchStackParamList,
  // UserValidStackParamList,
  HistoryStackParamList,
  AccountStackParamList,
  CaptureStackParamList,
} from "./StackParamList";

const SummaryStack = createStackNavigator<SummaryStackParamList>();
const PriceWatchStack = createStackNavigator<PriceWatchStackParamList>();
// const UserValidStack = createStackNavigator<UserValidStackParamList>();
const HistoryStack = createStackNavigator<HistoryStackParamList>();
const AccountStack = createStackNavigator<AccountStackParamList>();
const CaptureStack = createStackNavigator<CaptureStackParamList>();
// Create stack navigators for each tab

/**
 * Errors: The error below can be fixed through having both navigation and route in the props
  * Type 'typeof Account' is not assignable to type 'ScreenComponentType<AccountStackParamList, "Account"> | undefined'.
    Type 'typeof Account' is not assignable to type 'ComponentClass<{}, any>'.
      Types of parameters 'props' and 'props' are incompatible.
        Property 'onClicked' is missing in type '{}' but required in type 'AccountProps'.ts(2322)
  account.tsx(7, 3): 'onClicked' is declared here.
  types.d.ts(318, 5): The expected type comes from property 'component' which is declared here on type 'IntrinsicAttributes & RouteConfig<AccountStackParamList,
 */

const defaultScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: "#768A96",
  },
  headerTintColor: "#E6E6E6",
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 22,
    fontFamily: "roboto",
  },
};

function SummaryStackNavigator() {
  return (
    <SummaryStack.Navigator screenOptions={defaultScreenOptions}>
      <SummaryStack.Screen
        name="Summary"
        component={Summary}
        options={{ title: "Summary" }}
      />
      {/* Add more screens if necessary */}
    </SummaryStack.Navigator>
  );
}

function PriceWatchStackNavigator() {
  return (
    <PriceWatchStack.Navigator screenOptions={defaultScreenOptions}>
      <PriceWatchStack.Screen
        name="PriceWatch"
        component={PriceWatch}
        options={{ title: "Price Watch" }}
      />
    </PriceWatchStack.Navigator>
  );
}

function CaptureStackNavigator() {
  return (
    <CaptureStack.Navigator screenOptions={defaultScreenOptions}>
      <CaptureStack.Screen
        name="Capture"
        component={Capture}
        options={{ title: "Add Receipt" }}
      />
      <CaptureStack.Screen
        name="UserValid"
        component={UserValid}
        options={{ title: "Validate Receipt" }}
      />
    </CaptureStack.Navigator>
  );
}

function HistoryStackNavigator() {
  return (
    <HistoryStack.Navigator screenOptions={defaultScreenOptions}>
      <HistoryStack.Screen
        name="History"
        component={History}
        options={{ title: "History" }}
      />
      <HistoryStack.Screen
        name="DetailedHistory"
        component={DetailedHistory}
        options={{ title: "Monthly History" }}
      />
    </HistoryStack.Navigator>
  );
}

function AccountStackNavigator() {
  return (
    <AccountStack.Navigator screenOptions={defaultScreenOptions}>
      <AccountStack.Screen
        name="Account"
        component={Account}
        options={{ title: "Account" }}
      />
      <AccountStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "Edit Profile" }}
      />
    </AccountStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#768A96", // Set the background color of the tab bar
        },
      }}
    >
      <Tab.Screen
        name="SummaryTab"
        component={SummaryStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={24}
              color={focused ? "#E6E6E6" : "#444444"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PriceWatchTab"
        component={PriceWatchStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="eye"
              size={24}
              color={focused ? "#E6E6E6" : "#444444"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CaptureTab"
        component={CaptureStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="camera"
              size={24}
              color={focused ? "#E6E6E6" : "#444444"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Foundation
              name="list-bullet"
              size={24}
              color={focused ? "#E6E6E6" : "#444444"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="account-circle"
              size={24}
              color={focused ? "#E6E6E6" : "#444444"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
