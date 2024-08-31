import React, { Component } from "react";
import { SignUp } from "./signup";
import { Login } from "./login";

interface StartPageState {
  loginStatus: boolean;
  showLogin: boolean;
}

export default class StartPage extends Component<{}, StartPageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loginStatus: false,
      showLogin: false,
    };
  }

  componentDidUpdate() {
    if (this.state.loginStatus) {
      this.props.navigation.replace("Main"); // Navigate to the main app
    }
  }

  render() {
    if (!this.state.showLogin) {
      return (
        <SignUp onSignUp={this.updateStatus} onToLogin={this.navigateToLogin} />
      );
    } else {
      return <Login onLogin={this.updateStatus} />;
    }
  }

  navigateToLogin = () => {
    this.setState({ showLogin: true });
  };

  updateStatus = () => {
    this.setState({ loginStatus: true });
  };
}
