import { Text, View, Button, TouchableOpacity } from "react-native";
import React, { Component, ChangeEvent } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "../app/StackParamList";
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

interface SignUpProps {
  navigation: StackNavigationProp<AuthStackParamList, "SignUp">;

  route: RouteProp<AuthStackParamList, "SignUp">;
}

interface SignUpState {
  user_id: string;
  password: string;
  confirmPassword: string;
  email: string;
  message: string;
  messageType: string;
  hidePassword: boolean;
  hideconfirmPassword: boolean;
}

export class SignUp extends Component<SignUpProps, SignUpState> {
  constructor(props: SignUpProps) {
    super(props);
    this.state = {
      user_id: "",
      password: "",
      confirmPassword: "",
      email: "",
      message: "",
      messageType: "",
      hidePassword: true,
      hideconfirmPassword: true,
    };
  }

  //TODO: Figure out where the app is slowing down and how to optimize the perfomance
  //UPDATE: 7/10/2024 the speed is good

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
            <PageTitle>Sign-up</PageTitle>
            <Spacer></Spacer>
            <StyledFormArea>
              <View>
                <StyledInputLabel>User ID</StyledInputLabel>
                <LeftIcon>
                  <Octicons name="person" size={30} color={Colors.darkLight} />
                </LeftIcon>
                <StyledTextInput
                  placeholder="bob123"
                  placeholderTextColor={Colors.darkLight}
                  value={this.state.user_id}
                  onChangeText={(value) => this.handleChange("user_id", value)}
                />
              </View>

              <View>
                <StyledInputLabel>Email</StyledInputLabel>
                <LeftIcon>
                  <Octicons name="mail" size={30} color={Colors.darkLight} />
                </LeftIcon>
                <StyledTextInput
                  placeholder="bob123@gmail.com"
                  placeholderTextColor={Colors.darkLight}
                  value={this.state.email}
                  onChangeText={(value) => this.handleChange("email", value)}
                />
              </View>

              <View>
                <StyledInputLabel>Password</StyledInputLabel>
                <LeftIcon>
                  <Octicons name="lock" size={30} color={Colors.darkLight} />
                </LeftIcon>
                {/** Future Idea: Change the Icon as well if the eye is pressed (icon with a slash in the eye)*/}
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

              <View>
                <StyledInputLabel>Confirm Password</StyledInputLabel>
                <LeftIcon>
                  <Octicons name="lock" size={30} color={Colors.darkLight} />
                </LeftIcon>
                <StyledTextInput
                  placeholder="********"
                  placeholderTextColor={Colors.darkLight}
                  value={this.state.confirmPassword}
                  secureTextEntry={this.state.hideconfirmPassword}
                  onChangeText={(value) =>
                    this.handleChange("confirmPassword", value)
                  }
                />
                <RightIcon
                  onPress={() =>
                    this.handleChange(
                      "hideconfirmPassword",
                      !this.state.hideconfirmPassword
                    )
                  }
                >
                  <Octicons name="eye" size={30} color={Colors.darkLight} />
                </RightIcon>
              </View>

              <Spacer></Spacer>
              <Button
                title="Submit"
                onPress={this.handleSubmit}
                color={Colors.blue}
              />
              <MsgBox type={this.state.messageType}>
                {this.state.message}
              </MsgBox>

              <Line />
              <TouchableOpacity onPress={() => this.handleLink()}>
                <Text style={{ color: Colors.blue }}>
                  Already have an account?
                </Text>
              </TouchableOpacity>
            </StyledFormArea>
          </InnerContainer>
        </StyledContainer>
      </KeyboardAvoidingWrapper>
    );
  };

  handleChange = (name: keyof SignUpState, value: string | boolean) => {
    this.setState({ [name]: value } as unknown as Pick<
      SignUpState,
      keyof SignUpState
    >);
  };

  handleLink = () => {
    this.props.navigation.navigate("Login");
  };

  validate = () => {
    {
      /** Add more cases if needed 
      1. Proper Email Format
      2. Stronger Password? (Future Idea)
      */
    }
    if (
      this.state.user_id === "" ||
      this.state.password === "" ||
      this.state.confirmPassword === "" ||
      this.state.email === ""
    ) {
      this.setState({
        message: "Please fill in all fields",
        messageType: "ERROR",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.state.email)) {
      this.setState({
        message: "Please enter a valid email address (example@example.com)",
        messageType: "ERROR",
      });
      return false;
    }

    if (this.state.password.length < 8) {
      this.setState({
        message: "Password must be at least 8 characters long",
        messageType: "ERROR",
      });
      return false;
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        message: "Passwords do not matched",
        messageType: "ERROR",
      });
      return false;
    }

    return true;
  };

  handleSubmit = () => {
    if (this.validate()) {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const currDate = `${year}-${month}-${day}`;

      const args = {
        user_id: this.state.user_id,
        password: this.state.password,
        email: this.state.email,
        date: currDate,
      };
      fetch("https://receiptplus.pythonanywhere.com/api/register", {
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
      return res.json().then((data) => {
        // this.props.navigation.replace("Main");
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
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
