import { Tabs } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default () => {
  // TODO: Bold the Icons when the user is on a specific screen
  return (
    <Tabs>
      <Tabs.Screen
        name="SummaryTab"
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo name="home" size={24} color={focused ? "black" : "gray"} />
          ),
        }}
      />
      <Tabs.Screen
        name="PriceWatchTab"
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign
              name="eye"
              size={24}
              color={focused ? "black" : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="UserValidTab"
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo
              name="camera"
              size={24}
              color={focused ? "black" : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="HistoryTab"
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <Foundation
              name="list-bullet"
              size={24}
              color={focused ? "black" : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="AccountTab"
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="account-circle"
              size={24}
              color={focused ? "black" : "gray"}
            />
          ),
        }}
      />
    </Tabs>
  );
};
