import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { HistoryStackParamList } from "@/app/StackParamList";
import ReceiptForm from "../components/receiptForm";
import { DetailedHistoryStyledContainer } from "@/components/style";
// import { Container } from "../components/style";

interface Receipt {
  category: string;
  date: string;
  location: string;
  purchases: { name: string; price?: number; quantity?: number }[];
  store: string;
  total: number;
}

// Define props to include navigation and route
interface DetailedHistoryProps {
  navigation: NavigationProp<HistoryStackParamList, "DetailedHistory">;
  route: RouteProp<HistoryStackParamList, "DetailedHistory">;
}

interface DetailedHistoryState {
  receipts: Receipt[];
}

export class DetailedHistory extends Component<
  DetailedHistoryProps,
  DetailedHistoryState
> {
  constructor(props: DetailedHistoryProps) {
    super(props);
    this.state = {
      receipts: [],
    };
  }

  componentDidMount() {
    this.fetchReceipts();
  }

  fetchReceipts = async () => {
    const { year_month } = this.props.route.params;
    try {
      const response = await fetch(
        `https://receiptplus.pythonanywhere.com/api/get_receipts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ year_month }),
          credentials: "include",
        }
      );
      const data = await response.json();
      this.setState({ receipts: data });
    } catch (error) {
      console.error("Error fetching receipts:", error);
    }
  };

  render() {
    return (
      // <View style={styles.container}>
      <DetailedHistoryStyledContainer>
        <FlatList
          data={this.state.receipts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ReceiptForm receipt={item} />}
        />
      </DetailedHistoryStyledContainer>

      // </View>
    );
  }
}
