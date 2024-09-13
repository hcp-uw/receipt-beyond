import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "../app/StackParamList";
import {
  InnerStyledContainer,
  StyledContainer,
  StyledTextDark,
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
      <StyledContainer>
        <InnerStyledContainer>
          <StyledTextDark>Welcome to Receipt Beyond</StyledTextDark>
          <Button title="Get Started" onPress={this.navigateToSignUp} />
        </InnerStyledContainer>
      </StyledContainer>
    );
  }

  navigateToSignUp = () => {
    this.props.navigation.replace("SignUp");
  };
}
