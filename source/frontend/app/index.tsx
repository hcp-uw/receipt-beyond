import { Text, View } from "react-native";
import React, { Component} from "react";
import {Redirect} from 'expo-router';
import {SignUp} from "../pages/signup";

// Research:
// import AsyncStorage from '@react-native-async-storage/async-storage';
// AsyncStorage is not safe since it is meant to only store simple things.
// Is loginStatus important to secure?
// Should I store the token with the corresponding loginStatus?
// import * as SecureStore from 'expo-secure-store';

/*
1. Start from Starting page that has a button for sign up and have login as a link.
2. Clicked signup => signup page automatically logins in and permantently stay logged in.
3. Clicked Login link => login page.
4. If User login => summarypage(summary tab)
*/

interface StartPageState {
  // Talk: 
  // Need the concept of NULL?
  loginStatus: boolean
};

export default class StartPage extends Component<{}, StartPageState> {

  constructor(props: {}) {
    super(props);
    this.state = {loginStatus: false};
  }

  render = (): JSX.Element => {
    if (!this.state.loginStatus) {
      return <SignUp onSignUp={this.updateStatus}/>;
    } else {
      return <Redirect href="/SummaryTab"/>;
    }
  }

  updateStatus = (): void => {
    this.setState({loginStatus: true});
  }
  // return (
  //   <View
  //     style={{
  //       flex: 1,
  //       justifyContent: "center",
  //       alignItems: "center",
  //     }}
  //   >
  //     <Text>Edit app/index.tsx to edit this screen.</Text>
  //   </View>
  // );
}
