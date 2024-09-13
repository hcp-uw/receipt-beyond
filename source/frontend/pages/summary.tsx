import { Text, View, Dimensions } from "react-native";
import React, { Component } from "react";
import { BarChart, PieChart } from "react-native-chart-kit";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { SummaryStackParamList } from "../app/StackParamList";
import {
  Colors,
  InnerStyledContainer,
  PageTitle,
  ScrollableContainer,
  Spacer,
} from "../components/style";

interface SummaryProps {
  navigation: NavigationProp<SummaryStackParamList, "Summary">;
  route: RouteProp<SummaryStackParamList, "Summary">;
}

interface SummaryState {
  month: string;
  date: string;
  pieData: any[];
}

export class Summary extends Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps) {
    super(props);
    this.state = {
      month: "",
      date: "",
      pieData: [],
    };
  }

  static categoryColors: { [key: string]: string } = {
    /**
     * TODO: Add more later
     * FURTURE: When a new catergory is add, choose a random color and add
     *          Might have to change the structure to a Map
     */
    Groceries: "#4CAF50", // Green
    Dining: "#FF9800", // Orange
    Gas: "#2196F3", // Blue
    Shopping: "#9C27B0", // Purple
  };

  componentDidMount(): void {
    this.props.navigation.addListener("focus", () => {
      this.fetchData();
    });
  }

  render = (): JSX.Element => {
    return (
      <ScrollableContainer>
        {/* export const PageTitle = styled.Text` font-size: 30px; text-align:
        center; font-weight: bold; color: ${Colors.secondary}; padding: 10px; `; */}

        <InnerStyledContainer
          style={{
            marginHorizontal: 10,
            width: Dimensions.get("window").width - 20,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              textAlign: "center",
              fontWeight: "bold",
              color: Colors.tertiary,
            }}
          >
            {this.state.month}
          </Text>
          <Spacer></Spacer>
          <Spacer></Spacer>

          <Text
            style={{
              fontSize: 15,
              textAlign: "left",
              fontWeight: "bold",
              color: Colors.primary,
            }}
          >
            Categorical Spending
          </Text>
          <PieChart
            data={this.state.pieData}
            width={Dimensions.get("window").width - 40} // from react-native
            height={220}
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"0"}
          />
        </InnerStyledContainer>
      </ScrollableContainer>
    );
  };

  // Need to give a date as a json but method is GET in backend.
  fetchData = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currDate = `${year}-${month}-${day}`;

    // For testing:
    // const currDate = `${2025}-${10}-${30}`;

    const monthName = date.toLocaleString("en-US", { month: "long" });
    this.setState({ month: monthName, date: currDate });

    const args = { date: currDate };
    fetch("https://receiptplus.pythonanywhere.com/api/month_cat_exp", {
      method: "POST",
      body: JSON.stringify(args),
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
        this.processData(data);
      });
    } else {
      console.error("Error receiving user info");
    }
  };

  processData = (data: { [key: string]: number }) => {
    const totalSpending = Object.values(data).reduce(
      (acc, amount) => acc + amount,
      0
    );

    // Transform the data into a format suitable for the PieChart
    const newData = Object.keys(data).map((category) => ({
      name: category,
      amount: Number(((data[category] / totalSpending) * 100).toFixed(2)),
      color: Summary.categoryColors[category] || this.getRandomColor(),
      legendFontColor: Colors.tertiary,
      legendFontSize: 15,
    }));

    // Update state
    this.setState({ pieData: newData });
  };

  getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
}
