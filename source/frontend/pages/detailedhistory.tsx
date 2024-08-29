import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ReceiptForm from "../components/receiptForm";

interface Receipt {
  category: string;
  date: string;
  location: string;
  purchases: { name: string; price?: number; quantity?: number }[];
  store: string;
  total: number;
}

interface DetailedHistoryProps {
  year_month: string;
}

interface DetailedHistoryState {
  receipts: Receipt[];
}

export default class DetailedHistory extends Component<
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
    const { year_month } = this.props;
    // console.log(year_month);
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
      <View style={styles.container}>
        <FlatList
          data={this.state.receipts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ReceiptForm receipt={item} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});
