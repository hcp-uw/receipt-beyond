import { Text, View } from "react-native";
import React, { Component} from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import { UserValidStackParamList } from "../app/StackParamList";

interface UserValidProps {
  navigation: StackNavigationProp<UserValidStackParamList, "UserValidation">;

  route: RouteProp<UserValidStackParamList, "UserValidation">;
}

interface UserValidState {

}

export class UserValid extends Component<UserValidProps, UserValidState> {

  render = (): JSX.Element => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      <Text>UserValid Screen</Text>
      </View>
    );
  }
}
