import { Text, View, Button, TouchableOpacity } from "react-native";
import React, { Component, ChangeEvent } from "react";
import {
  Colors,
  StartLogo,
  StyledContainer,
  InnerContainer,
  PageTitle,
  Spacer,
  StyledFormArea,
  StyledTextInput,
  StyledInputLabel,
  LeftIcon,
  RightIcon,
  MsgBox,
  Line,
} from "../components/style";
import { Octicons } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

/**
 * FUTURE:
 *      - Google Auth
 *      - Forgot Password
 */

interface LoginProps {
  onLogin: () => void;
}

interface LoginState {
  user_id: string;
  password: string;
  email: string;
  message: string;
  messageType: string;
  hidePassword: boolean;
}

export class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      user_id: "",
      password: "",
      email: "",
      message: "",
      messageType: "",
      hidePassword: true,
    };
  }

  render = (): JSX.Element => {
    return (
      <KeyboardAvoidingWrapper>
        <StyledContainer>
          <InnerContainer>
            {/** Replace the logo here */}
            <StartLogo
              resizeMode="cover"
              source={require("../assets/ReceiptBeyondTransparent.png")}
            />
            <PageTitle>Login</PageTitle>
            <Spacer></Spacer>
            <StyledFormArea>
              <View>
                <StyledInputLabel>User ID OR Email</StyledInputLabel>
                <LeftIcon>
                  <Octicons name="person" size={30} color={Colors.darkLight} />
                </LeftIcon>
                <StyledTextInput
                  placeholder="bob123 OR abc@gmail.com"
                  placeholderTextColor={Colors.darkLight}
                  value={this.state.user_id}
                  onChangeText={(value) => this.handleChange("user_id", value)}
                />
              </View>

              <View>
                <StyledInputLabel>Password</StyledInputLabel>
                <LeftIcon>
                  <Octicons name="lock" size={30} color={Colors.darkLight} />
                </LeftIcon>
                {/** Future Idea: Change the Icon as well if the eye is pressed (icon with a slash in the eye)*/}
                {/** Decrease the placeholder text size or update StyledTextInput */}
                <StyledTextInput
                  placeholder="********"
                  placeholderTextColor={Colors.darkLight}
                  value={this.state.password}
                  secureTextEntry={this.state.hidePassword}
                  onChangeText={(value) => this.handleChange("password", value)}
                />
                <RightIcon
                  onPress={() =>
                    this.handleChange("hidePassword", !this.state.hidePassword)
                  }
                >
                  <Octicons name="eye" size={30} color={Colors.darkLight} />
                </RightIcon>
              </View>

              <Spacer></Spacer>
              <Button title="Login" onPress={this.handleLogin} />
              <MsgBox type={this.state.messageType}>
                {this.state.message}
              </MsgBox>
            </StyledFormArea>
          </InnerContainer>
        </StyledContainer>
      </KeyboardAvoidingWrapper>
    );
  };

  handleChange = (name: keyof LoginState, value: string | boolean) => {
    this.setState({ [name]: value } as unknown as Pick<
      LoginState,
      keyof LoginState
    >);
  };

  validate = () => {
    {
      /** Add more cases if needed 
      1. Proper Email Format
      2. Stronger Password? (Future Idea)
      */
    }
    if (
      (this.state.user_id === "" && this.state.email === "") ||
      this.state.password === ""
    ) {
      this.setState({
        message: "Please fill in all fields",
        messageType: "ERROR",
      });
      return false;
    }

    if (this.state.user_id === "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.state.email)) {
        this.setState({
          message: "Please enter a valid email address (example@example.com)",
          messageType: "ERROR",
        });
        return false;
      }
    }

    if (this.state.password.length < 8) {
      this.setState({
        message: "Password must be at least 8 characters long",
        messageType: "ERROR",
      });
      return false;
    }

    return true;
  };

  handleLogin = () => {
    if (this.validate()) {
      // TODO: change this depending on how the backend is set up
      /**
       * const args1 = {user_id: this.state.user_id, password: this.state.password};
       * const args2 = {email: this.state.email, password: this.state.password};
       *
       * const args = (this.state.user_id !== "") ? args1 : args2;
       */
      // Use this for testing:

      // Could send the email as the user_id attribute
      const args = {
        user_id: this.state.user_id,
        password: this.state.password,
      };

      fetch("https://receiptplus.pythonanywhere.com/api/login", {
        method: "POST",
        body: JSON.stringify(args),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(this.handleResponse)
        .catch(() => this.handleError("failed to connect to the server"));
    }
  };

  handleResponse = (res: Response) => {
    // res.ok: 200 ~ 299
    if (res.ok) {
      console.log("success");
      return res.json().then((data) => {
        this.props.onLogin();
      });
    } else {
      // errorData is the object return from the Response for error status >= 400
      return res.json().then((errorData) => {
        this.handleError(errorData.error);
      });
    }
  };

  handleError = (errorMessage: string) => {
    this.setState({ message: errorMessage, messageType: "ERROR" });
  };
}
