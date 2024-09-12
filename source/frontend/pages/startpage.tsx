import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "../app/StackParamList";
import { StyledContainerCentered, StyledText } from "../components/style";

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
      <StyledContainerCentered>
        <StyledText>Welcome to Receipt Beyond</StyledText>
        <Button title="Get Started" onPress={this.navigateToSignUp} />
      </StyledContainerCentered>
    );
  }

  navigateToSignUp = () => {
    this.props.navigation.replace("SignUp");
  };
}
