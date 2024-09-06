import { Text, View } from "react-native";
import React, {Component} from "react";
import { BarChart, PieChart } from 'react-native-chart-kit';
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { SummaryStackParamList } from "../app/StackParamList";

interface SummaryProps {
  navigation: NavigationProp<SummaryStackParamList, "Summary">;
  route: RouteProp<SummaryStackParamList, "Summary">;
}

interface SummaryState {
  date: string,
  pieData: any[]
}

export class Summary extends Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps) {
    super(props);
    this.state = {
      date: "",
      pieData: []
    };
  };

  componentDidMount(): void {
    //TODO: Test if the start of the page considered as a change of the screen
    this.props.navigation.addListener("focus", () => {
      this.fetchData();
    });
  };

  render = (): JSX.Element => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      <Text>Summary Screen</Text>
      </View>
    );
  };

  // Need to give a date as a json but method is GET in backend.
  fetchData = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currDate = `${year}-${month}-${day}`;

    this.setState({date: currDate});

    const args = {date: currDate};
    fetch("https://receiptplus.pythonanywhere.com/api/month_cat_exp", {
      method: "POST", body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    .then(this.handleChange)
    .catch((error) => {
      console.error("Error fetching api/user_info");
    });
  };
}
