import { Text, View, Button} from "react-native";
import React, {Component, ChangeEvent} from "react";
import {Colors, StartLogo, StyledContainer, InnerContainer, PageTitle, Spacer, StyledFormArea, StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, MsgBox} from "../components/style";
import { TextInput } from "react-native-gesture-handler";
import { Octicons } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

interface SignUpProps {
  onSignUp: () => void
}

interface SignUpState {
  user_id: string,
  password: string,
  confirmPassword: string,
  email: string,
  message: string,
  messageType: string
  hidePassword: boolean
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
      hidePassword: true
    };
  }

  // render = (): JSX.Element => {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //     <Text>SignUp Screen</Text>
  //     </View>
  //   );
  // }

  render = (): JSX.Element => {
    return (
      <KeyboardAvoidingWrapper>
        <StyledContainer>
          <InnerContainer>
            {/** Replace the logo here */}
            <StartLogo resizeMode="cover" source={require('../ZIgnore/assets/images/react-logo.png')}/>
            <PageTitle>SIGN UP</PageTitle>
            <Spacer></Spacer>
            <StyledFormArea>
            <View>
              <StyledInputLabel>User ID</StyledInputLabel>
              <LeftIcon>
                <Octicons name="person" size={30} color={Colors.darkLight}/>
              </LeftIcon>
              <StyledTextInput
                placeholder="bob123"
                placeholderTextColor={Colors.darkLight}
                value={this.state.user_id}
                onChangeText={(value) => this.handleChange('user_id', value)}
              />
            </View>
            <View>
              <StyledInputLabel>Password</StyledInputLabel>
              <LeftIcon>
                <Octicons name="lock" size={30} color={Colors.darkLight}/>
              </LeftIcon>
              {/** Idea: Create an EYE Icon to the right of the text input and when pressed, change secureTextEntry to false*/}
              <StyledTextInput
                placeholder="********"
                placeholderTextColor={Colors.darkLight}
                value={this.state.password}
                secureTextEntry={this.state.hidePassword}
                onChangeText={(value) => this.handleChange('password', value)}
              />
              <RightIcon onPress={() => this.handlePassword(!this.state.hidePassword)}>
                <Octicons name={"eye"} size={30} color={Colors.darkLight}/>
              </RightIcon>
            </View>
            <View>
            <StyledInputLabel>Confirm Password</StyledInputLabel>
              <LeftIcon>
                <Octicons name="lock" size={30} color={Colors.darkLight}/>
              </LeftIcon>
              <StyledTextInput
                placeholder="********"
                placeholderTextColor={Colors.darkLight}
                value={this.state.confirmPassword}
                secureTextEntry={this.state.hidePassword}
                onChangeText={(value) => this.handleChange('confirmPassword', value)}
              />
              <RightIcon onPress={() => this.handlePassword(!this.state.hidePassword)}>
                <Octicons name="eye" size={30} color={Colors.darkLight}/>
              </RightIcon>
            </View>
            <View>
            <StyledInputLabel>Email</StyledInputLabel>
              <LeftIcon>
                <Octicons name="mail" size={30} color={Colors.darkLight}/>
              </LeftIcon>
              <StyledTextInput
                placeholder="bob123@gmail.com"
                placeholderTextColor={Colors.darkLight}
                value={this.state.email}
                onChangeText={(value) => this.handleChange('email', value)}
                
              />
            </View>
            <Spacer></Spacer>
            <Button title="Submit" onPress={this.handleSubmit}/>
            <MsgBox type={this.state.messageType}>{this.state.message}</MsgBox>

            {/** TODO: Create a link to Login Page */}
            </StyledFormArea>
          </InnerContainer>
        </StyledContainer>
      </KeyboardAvoidingWrapper>
    );
  }

  handlePassword = (value: boolean) => {
    this.setState({hidePassword: value});
  }

  handleChange = (name: keyof SignUpState, value:string) => {
    this.setState({ [name]: value } as unknown as Pick<SignUpState, keyof SignUpState>);
  }

  validate = () => {
    {/** Add more cases if needed 
      1. Proper Email Format
      2. UserID exists? (error code 400)
      3. Is it okay for a user to create multiple accounts? Should we also check if an email exists?
      4. Stronger Password? (more than 8 characters, numbers needed, at least 1 captial & lower case)
      */}
    if (this.state.email === "" || this.state.password === "" || this.state.confirmPassword === "" || this.state.email === "") {
      this.setState({message: "Please fill in all fields", messageType:"ERROR"});
      return false;
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({message: "Passwords do not matched", messageType:"ERROR"});
      return false;
    }

    return true;
  }

  handleSubmit = () => {
    if (this.validate()) {
      this.props.onSignUp();
    }
  }

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//     <Text>SignUp Screen</Text>
//     </View>
//   );
}
