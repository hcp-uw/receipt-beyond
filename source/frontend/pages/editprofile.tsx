import { Text, View, Button, TextInput, TouchableOpacity} from "react-native";
import React, {Component} from "react";
import {Ionicons, Octicons} from '@expo/vector-icons';
import {Colors, Spacer, StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, MsgBox, Container, TopBar} from "../components/style";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

interface EditProfileProps {
  onClicked: (newView: "account") => void
  view: "email" | "password"
}

interface EditProfileState {
  view:"email" | "password",
  newEmail: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  message: string,
  messageType: string,
  hideOldPass: boolean,
  hideNewPass: boolean,
  hideConfirmPass: boolean
}

export class EditProfile extends Component<EditProfileProps, EditProfileState> {
  constructor(props: EditProfileProps) {
    super(props);
    this.state = {
      view:props.view,
      newEmail: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      message: "",
      messageType: "",
      hideOldPass: true,
      hideNewPass: true,
      hideConfirmPass: true
    };
  }

  render = (): JSX.Element =>  {
    return (
      <KeyboardAvoidingWrapper>
        <Container>
          {/** STYLE: Might need to change the color of the Text Font. Ex) color: #... */}
          {/** Top Bar */}
          <TopBar>
            <TouchableOpacity
              onPress={this.handleBack}>
              <Ionicons name="arrow-back" size={30} color="black"/>
            </TouchableOpacity>

            <Text style={{fontSize:22, fontWeight: "bold"}}>Profile</Text>

            <TouchableOpacity onPress={this.handleSave}>
                <Text style={{fontSize: 18, fontWeight: "bold"}}>Save</Text>
            </TouchableOpacity>
          </TopBar>

          {/** Content */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: 25
            }}
          >
            {/** Edit Email View */}
            {this.state.view === "email" && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  width: "100%",
                  paddingVertical: 200
                }}
              >
                <View>
                  <StyledInputLabel>Email</StyledInputLabel>
                  <LeftIcon>
                    <Octicons name="mail" size={30} color={Colors.darkLight}/>
                  </LeftIcon>
                  <StyledTextInput 
                    placeholder="Enter your new email"
                    placeholderTextColor={Colors.darkLight}
                    value={this.state.newEmail}
                    onChangeText={(value) => this.handleChange('newEmail', value)}
                  />
                </View>
              </View>
            )}

            {/** Edit Password View */}
            {this.state.view === "password" && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  width: "90%",
                  paddingVertical: 120
                }}
              >
                <View>
                  <StyledInputLabel>Old Password</StyledInputLabel>
                  <LeftIcon>
                    <Octicons name="lock" size={30} color={Colors.darkLight}/>
                  </LeftIcon>
                  <StyledTextInput
                    placeholder="********"
                    placeholderTextColor={Colors.darkLight}
                    value={this.state.oldPassword}
                    secureTextEntry={this.state.hideOldPass}
                    onChangeText={(value) => this.handleChange('oldPassword', value)}
                  />
                  <RightIcon onPress={() => this.handleChange("hideOldPass", !this.state.hideOldPass)}>
                    <Octicons name="eye" size={30} color={Colors.darkLight}/>
                  </RightIcon>
                </View>
                <Spacer></Spacer>
                <Spacer></Spacer>

                <View>
                  <StyledInputLabel>New Password</StyledInputLabel>
                  <LeftIcon>
                    <Octicons name="lock" size={30} color={Colors.darkLight}/>
                  </LeftIcon>
                  <StyledTextInput
                    placeholder="********"
                    placeholderTextColor={Colors.darkLight}
                    value={this.state.newPassword}
                    secureTextEntry={this.state.hideNewPass}
                    onChangeText={(value) => this.handleChange('newPassword', value)}
                  />
                  <RightIcon onPress={() => this.handleChange("hideNewPass", !this.state.hideNewPass)}>
                    <Octicons name="eye" size={30} color={Colors.darkLight}/>
                  </RightIcon>
                </View>
                <Spacer></Spacer>
                <Spacer></Spacer>

                <View>
                  <StyledInputLabel>Confirm New Password</StyledInputLabel>
                  <LeftIcon>
                    <Octicons name="lock" size={30} color={Colors.darkLight}/>
                  </LeftIcon>
                  <StyledTextInput
                    placeholder="********"
                    placeholderTextColor={Colors.darkLight}
                    value={this.state.confirmPassword}
                    secureTextEntry={this.state.hideConfirmPass}
                    onChangeText={(value) => this.handleChange('confirmPassword', value)}
                  />
                  <RightIcon onPress={() => this.handleChange("hideConfirmPass", !this.state.hideConfirmPass)}>
                    <Octicons name="eye" size={30} color={Colors.darkLight}/>
                  </RightIcon>
                </View>
              </View>
            )}

            <MsgBox type={this.state.messageType}>{this.state.message}</MsgBox>
          </View>
        </Container>
      </KeyboardAvoidingWrapper>
    );
  }

  handleBack = () => {
    this.props.onClicked("account");
  }

  handleChange = (name: keyof EditProfileState, value:string|boolean) => {
    this.setState({[name] : value} as unknown as Pick<EditProfileState, keyof EditProfileState>);
  }

  validate = (): boolean => {
    if (this.state.view === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.state.newEmail)) {
        this.setState({message: "Please enter a valid email address \n (example@example.com)", messageType:"ERROR"});
        return false;
      }

      return true;

    } else {
      if (this.state.oldPassword === "" || this.state.newPassword === "" || this.state.confirmPassword === "") {
        this.setState({message: "Please fill in all fields", messageType:"ERROR"});
        return false;
      }

      if (this.state.newPassword.length < 8) {
        this.setState({message: "New password must be at least 8 characters long", messageType:"ERROR"});
        return false;
      }

      if (this.state.newPassword !== this.state.confirmPassword) {
        this.setState({message: "new and confirm passwords do not matched", messageType:"ERROR"});
        return false;
      }

      return true;
    }
  }

  handleSave = () => {
    if (this.validate()) {
      let args;
      let url;

      if (this.state.view === "email") {
        args = {new_email:this.state.newEmail};
        url = "https://receiptplus.pythonanywhere.com/api/change_user_email";
      } else {
        args = {current_password: this.state.oldPassword, new_password: this.state.newPassword};
        url = "https://receiptplus.pythonanywhere.com/api/change_user_password";
      }

      fetch(url, {
        method: "POST", body: JSON.stringify(args),
        headers: {"Content-Type": "application/json"},
        credentials: "include"
      })
      .then(this.handleResponse)
      .catch(() => this.handleError("failed to connect to the server"));
    }
  }

  handleResponse = (res:Response) => {
    if (res.ok) {
      return res.json().then(data => {
        this.props.onClicked("account");
      });
    } else {
      return res.json().then(errorData => {
        this.handleError(errorData.error);
      });
    }
  }

  handleError = (errorMessage:string) => {
    this.setState({message:errorMessage, messageType:"ERROR"});
  }
}
