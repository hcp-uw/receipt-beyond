import { Text, View } from "react-native";
import {Account} from "../../pages/account";
import {EditProfile} from "../../pages/editprofile";
import React, {useState} from "react";

export default function AccountTab() {
  // return (
  //   <Stack>
  //     <Stack.Screen name="Account"  components="Account"/>
  //     <Stack.Screen name="EditProfile" options={{headerShown: false}}/>
  //   </Stack>
  // );
  const [view, setView] = useState<"account" | "email" | "password">("account");

  const handleChange = (newView: "account" | "email" | "password") => {
    setView(newView);
  }

  if (view === "account") {
    return <Account onClicked={handleChange}/>;
  } else {
    return <EditProfile view={view} onClicked={handleChange}/>;
  }
}
