import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Entypo,
  MaterialIcons,
  Foundation,
  AntDesign,
} from "@expo/vector-icons";

// Import screens
import Summary from "@/pages/summary";
import PriceWatch from "@/pages/pricewatch";
import UserValid from "@/pages/uservalid";
import History from "@/pages/history";
import { Account } from "@/pages/account";
import DetailedHistory from "@/pages/detailedhistory";
import {
  SummaryStackParamList,
  PriceWatchStackParamList,
  UserValidStackParamList,
  HistoryStackParamList,
  AccountStackParamList,
} from "./StackParamList";

const SummaryStack = createStackNavigator<SummaryStackParamList>();
const PriceWatchStack = createStackNavigator<PriceWatchStackParamList>();
const UserValidStack = createStackNavigator<UserValidStackParamList>();
const HistoryStack = createStackNavigator<HistoryStackParamList>();
const AccountStack = createStackNavigator<AccountStackParamList>();

// Create stack navigators for each tab
function SummaryStackNavigator() {
  return (
    <SummaryStack.Navigator>
      <SummaryStack.Screen name="Summary" component={Summary} />
      {/* Add more screens if necessary */}
    </SummaryStack.Navigator>
  );
}

function PriceWatchStackNavigator() {
  return (
    <PriceWatchStack.Navigator>
      <PriceWatchStack.Screen name="PriceWatch" component={PriceWatch} />
    </PriceWatchStack.Navigator>
  );
}

function UserValidStackNavigator() {
  return (
    <UserValidStack.Navigator>
      <UserValidStack.Screen name="UserValidation" component={UserValid} />
    </UserValidStack.Navigator>
  );
}

function HistoryStackNavigator() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name="History" component={History} />
      <HistoryStack.Screen name="DetailedHistory" component={DetailedHistory} />
    </HistoryStack.Navigator>
  );
}

function AccountStackNavigator() {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen name="Account" component={Account} />
    </AccountStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Disable the header in the tab navigator
      }}
    >
      <Tab.Screen
        name="SummaryTab"
        component={SummaryStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Entypo name="home" size={24} color={focused ? "black" : "gray"} />
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
              color={focused ? "black" : "gray"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="UserValidTab"
        component={UserValidStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="camera"
              size={24}
              color={focused ? "black" : "gray"}
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
              color={focused ? "black" : "gray"}
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
              color={focused ? "black" : "gray"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
