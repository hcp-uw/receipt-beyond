import { Text, View, Button, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import {
  Spacer,
  StyledText,
  StyledContainer,
  InnerContainer,
} from "../components/style";
import Feather from "@expo/vector-icons/Feather";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AccountStackParamList } from "../app/StackParamList";

interface AccountProps {
  navigation: NavigationProp<AccountStackParamList, "Account">;
  route: RouteProp<AccountStackParamList, "Account">;
}

interface AccountState {
  name: string;
  email: string;
  date_joined: string;
  loading: boolean;
}

export class Account extends Component<AccountProps, AccountState> {
  // Follow the design of Discord Account Page
  constructor(props: AccountProps) {
    super(props);
    this.state = {
      name: "",
      email: "",
      date_joined: "",
      loading: true,
    };
  }

  componentDidMount(): void {
    this.props.navigation.addListener("focus", () => {
      this.fetchUserData();
    });
  }

  render = (): JSX.Element => {
    // TODO: Show something when loading
    if (this.state.loading) {
      return <View></View>;
    }

    return (
      <StyledContainer>
        {/* <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 50,
          // width: "100%",
          backgroundColor: "#44576D",
          borderRadius: 8,
          padding: 14,
        }}
      > */}
        <StyledText>Name: {this.state.name}</StyledText>
        <Spacer></Spacer>
        <Spacer></Spacer>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <StyledText style={{ marginRight: 20 }}>
            {" "}
            Email: {this.state.email}{" "}
          </StyledText>
          <TouchableOpacity onPress={() => this.handleEdit("email")}>
            <Feather name="edit" size={24} color="#E6E6E6" />
          </TouchableOpacity>
        </View>

        <Spacer></Spacer>
        <Spacer></Spacer>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <StyledText style={{ marginRight: 20 }}>
            {" "}
            Password: ********{" "}
          </StyledText>
          <TouchableOpacity onPress={() => this.handleEdit("password")}>
            <Feather name="edit" size={24} color="#E6E6E6" />
          </TouchableOpacity>
        </View>
        <Spacer></Spacer>
        <Spacer></Spacer>

        <StyledText>Joined: {this.state.date_joined}</StyledText>
        {/* </View> */}
      </StyledContainer>
    );
  };

  fetchUserData = () => {
    fetch("https://receiptplus.pythonanywhere.com/api/user_info", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then(this.handleChange)
      .catch((error) => {
        console.error("Error fetching api/user_info");
      });
  };

  handleChange = (res: Response) => {
    if (res.ok) {
      res.json().then((data) => {
        this.setState({
          name: data.user_id,
          email: data.email,
          date_joined: data.date_joined,
          loading: false,
        });
      });
    } else {
      console.error("Error receiving user info");
    }
  };

  handleEdit = (newView: "email" | "password") => {
    this.props.navigation.navigate("EditProfile", {
      view: newView,
    });
  };
}
