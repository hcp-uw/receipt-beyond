import { Text, View, Dimensions } from "react-native";
import React, { Component } from "react";
import { PieChart } from "react-native-chart-kit";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
} from "victory-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { SummaryStackParamList } from "../app/StackParamList";

// Future: Add a horizontal scroll bar for the line graph

import {
  Colors,
  InnerStyledContainer,
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
  lineData: any[];
  maxY: number;
  loading: boolean;
  totalAmount: number;
}

export class Summary extends Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps) {
    super(props);
    this.state = {
      month: "",
      date: "",
      pieData: [],
      lineData: [],
      maxY: 0,
      loading: true,
      totalAmount: 0,
    };
  }

  static categoryColors: { [key: string]: string } = {
    /**
     * FURTURE: When a new catergory is add, choose a random color and add to category colors
     *          Might have to change the structure to a Map
     */
    Groceries: "#4CAF50", // Green
    Dining: "#FF9800", // Orange
    Gas: "#2196F3", // Blue
    Shopping: "#9C27B0", // Purple
    Food: "#FF4545", // Red
  };

  componentDidMount(): void {
    this.fetchData();

    this.props.navigation.addListener("focus", () => {
      this.fetchData();
    });
  }

  render = (): JSX.Element => {
    if (
      this.state.loading ||
      this.state.pieData.length == 0 ||
      this.state.lineData.length == 0
    ) {
      return <View></View>;
    }

    return (
      <ScrollableContainer>
        <InnerStyledContainer
          style={{
            marginHorizontal: 10,
            width: Dimensions.get("window").width - 20,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              textAlign: "center",
              fontWeight: "bold",
              color: Colors.tertiary,
            }}
          >
            {this.state.month}
          </Text>
          <Spacer></Spacer>

          <Text
            style={{
              fontSize: 15,
              textAlign: "left",
              fontWeight: "bold",
              color: Colors.tertiary,
            }}
          >
            Categorical Spending
          </Text>

          <PieChart
            data={this.state.pieData}
            width={Dimensions.get("window").width - 30}
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
          <Spacer></Spacer>

          <Text
            style={{
              fontSize: 15,
              textAlign: "left",
              fontWeight: "bold",
              color: Colors.tertiary,
            }}
          >
            Total Spending
          </Text>
          <Spacer></Spacer>

          <View
            style={{
              alignItems: "center",
              marginLeft: -20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                position: "absolute",
                right: 30,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Total: ${this.state.totalAmount.toFixed(2)}
            </Text>

            <VictoryChart
              width={Dimensions.get("window").width - 20}
              height={300}
              scale={{ x: "linear", y: "linear" }}
              theme={VictoryTheme.material}
              padding={{ top: 50, bottom: 50, left: 70, right: 20 }}
              domain={{
                x: [1, this.state.lineData.length],
                y: [0, this.state.maxY * 1.1],
              }}
              domainPadding={{ y: 10 }}
            >
              <VictoryAxis
                label="Day"
                style={{
                  axis: { stroke: "#756f6a" },
                  axisLabel: { padding: 30, fontSize: 16 },
                }}
              />
              <VictoryAxis
                dependentAxis
                label="Spending ($)"
                style={{
                  axis: { stroke: "#756f6a" },
                  axisLabel: { padding: 40, fontSize: 16 },
                }}
              />
              <VictoryLine
                data={this.state.lineData}
                labels={({ datum }) => datum.y}
                labelComponent={<VictoryLabel renderInPortal dy={-20} />}
                style={{
                  data: { stroke: "#44576D", strokeWidth: 2 },
                  parent: { border: "1px solid #ccc" },
                }}
              ></VictoryLine>
            </VictoryChart>
          </View>
        </InnerStyledContainer>
      </ScrollableContainer>
    );
  };

  fetchData = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currDate = `${year}-${month}-${day}`;

    const monthName = date.toLocaleString("en-US", { month: "long" });
    this.setState({ month: monthName, date: currDate });

    const args = { date: "2024-10-30" };
    fetch("https://receiptplus.pythonanywhere.com/api/month_cat_exp", {
      method: "POST",
      body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => this.handleChange(res, "pie"))
      .catch((error) => {
        console.error("Error fetching api/month_cat_exp");
      });

    fetch("https://receiptplus.pythonanywhere.com/api/month_exp", {
      method: "POST",
      body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => this.handleChange(res, "line"))
      .catch((error) => {
        console.error("Error fetching api/month_exp");
      });
  };

  handleChange = (res: Response, graph: string) => {
    if (res.ok) {
      res.json().then((data) => {
        if (graph === "pie") {
          console.log(data);
          this.processPieData(data);
        } else if (graph === "line") {
          this.processLineData(data);
        }
      });
    } else {
      console.error("Error receiving user info");
      // this.setState({ loading: false }); // Stop loading if there's an error
    }
  };

  processPieData = (data: { [key: string]: number }) => {
    // if (Object.keys(data).length === 0) {
    //   // Handle empty data case
    //   this.setState({ pieData: [], loading: false });
    //   return;
    // }

    const totalSpending = Object.values(data).reduce(
      (acc, amount) => acc + amount,
      0
    );
    console.log(totalSpending);

    // Transform the data into a format suitable for the PieChart
    const newData = Object.keys(data).map((category) => ({
      name: category,
      amount: Number(((data[category] / totalSpending) * 100).toFixed(2)),
      color: Summary.categoryColors[category] || this.getRandomColor(),
      legendFontColor: Colors.tertiary,
      legendFontSize: 15,
    }));

    this.setState({ pieData: newData, loading: false });
  };

  processLineData = (data: { x: number; y: number }[]) => {
    const validY = data.map((point) => point.y).filter((y) => y != null);
    const max = Math.max(...validY);

    const total = data.reduce((sum, point) => sum + point.y, 0);

    this.setState({
      lineData: data,
      loading: false,
      maxY: max === 0 ? 1 : max, // Set maxY to 1 if max is 0
      totalAmount: total,
    });
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
