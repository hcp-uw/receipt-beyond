import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import DateBracketButton from "../components/dateButton"; // Adjust the path
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { HistoryStackParamList } from "../app/StackParamList";
import { Container, ScrollableContainer } from "../components/style";

interface HistoryProps {
  navigation: NavigationProp<HistoryStackParamList, "History">;

  route: RouteProp<HistoryStackParamList, "History">;
}

interface HistoryState {
  dateBrackets: string[];
}

export default class History extends Component<HistoryProps, HistoryState> {
  constructor(props: HistoryProps) {
    super(props);
    this.state = {
      dateBrackets: [],
    };
  }

  componentDidMount() {
    this.fetchDateBrackets();
  }

  fetchDateBrackets = async () => {
    try {
      const response = await fetch(
        "https://receiptplus.pythonanywhere.com/api/receipt_date_brackets",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      this.setState({ dateBrackets: data });
    } catch (error) {
      console.error("Error fetching date brackets:", error);
    }
  };

  handleButtonPress = (dateString: string) => {
    // Navigate to DetailedHistory screen and pass the date
    this.props.navigation.navigate("DetailedHistory", {
      year_month: dateString,
    });
  };

  render() {
    return (
      <ScrollableContainer>
        {this.state.dateBrackets.map((dateString, index) => (
          <DateBracketButton
            key={index}
            dateString={dateString}
            onPress={() => this.handleButtonPress(dateString)}
          />
        ))}
      </ScrollableContainer>
    );
  }
}
