import { Text, View } from "react-native";
import React, { Component} from "react";
import {Redirect} from 'expo-router';
import {SignUp} from "../pages/signup";
import {Login} from "../pages/login";

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

// Suggestion:
// Start with the Welcome Page that contains the explanation of the the app to the new users. (Use swipe function to show the text/img)
// Last page shows a button of "Let's get started" that leads to SignUp Page

interface StartPageState {
  // Talk: 
  // Need the concept of NULL?
  loginStatus: boolean
  showLogin: boolean
};

export default class StartPage extends Component<{}, StartPageState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      loginStatus: false,
      showLogin: false
    };
  }

  render = (): JSX.Element => {
    if (this.state.loginStatus) {
      return <Redirect href="/SummaryTab"/>;
    }

    if (!this.state.showLogin) {
      return <SignUp onSignUp={this.updateStatus} onToLogin={this.navigateToLogin}/>;
    } else {
      return <Login onLogin={this.updateStatus}/>
    }
  }

  navigateToLogin = () => {
    this.setState({showLogin: true});
  }

  updateStatus = () => {
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
