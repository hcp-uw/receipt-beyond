import React, { Component } from "react";
import {View, Text, Button} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import { AuthStackParamList } from "../app/StackParamList";

interface StartPageProps {
  navigation: StackNavigationProp<AuthStackParamList, "Start">;

  route: RouteProp<AuthStackParamList, "Start">;
}

interface StartPageState {
  loginStatus: boolean;
}

export default class StartPage extends Component<StartPageProps, StartPageState> {
  constructor(props: StartPageProps) {
    super(props);
    this.state = {
      loginStatus: false
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Welcome to Receipt & Beyond</Text>
        <Button title="Get Started" onPress={this.navigateToSignUp} />
      </View>
    );
  }

  navigateToSignUp = () => {
    this.props.navigation.replace("SignUp");
  };
}
