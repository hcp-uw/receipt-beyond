import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { SignUp } from "./signup";
import { Login } from "./login";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "../app/StackParamList";
import {
  ScrollableContainerVerticallyCentered,
  StyledText,
} from "../components/style";

interface StartPageProps {
  navigation: StackNavigationProp<AuthStackParamList, "Start">;

  route: RouteProp<AuthStackParamList, "Start">;
}

interface StartPageState {
  loginStatus: boolean;
}

export default class StartPage extends Component<
  StartPageProps,
  StartPageState
> {
  constructor(props: StartPageProps) {
    super(props);
    this.state = {
      loginStatus: false,
    };
  }

  render() {
    return (
      <ScrollableContainerVerticallyCentered>
        <StyledText>Welcome to Receipt Beyond</StyledText>
        <Button title="Get Started" onPress={this.navigateToSignUp} />
      </ScrollableContainerVerticallyCentered>
    );
  }

  navigateToSignUp = () => {
    this.props.navigation.replace("SignUp");
  };
}
