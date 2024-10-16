import { Text, View, Dimensions, ScrollView } from "react-native";
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

// TODO:
/**
 * 1. Fix the Scale of the height. This can be done by finding the maxY (highest amount)
 *    and setting the domain of the y-axis in VictoryChart (domain={{ y: [0, maxY * 1.1] }})
 * 2. Make the horizontal scoll where the graph moves based on the scroll
 *    ***Idea:
 *            1. Set the scale of the graph shown to be about 10 days and scroll through
 *            2. Make a button or tab when it is pressed, it shows the entire Day 1 ~ Curr Date View
 *               Ex) Google Stock graph view
 *               Also discuss about getting rid of the label components
 * 3. Talk to backend that there is an Error receiving user info that is happening? Why? Retest it before talking
 */

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
     * TODO: Add more later
     * FURTURE: When a new catergory is add, choose a random color and add
     *          Might have to change the structure to a Map
     */
    Groceries: "#4CAF50", // Green
    Dining: "#FF9800", // Orange
    Gas: "#2196F3", // Blue
    Shopping: "#9C27B0", // Purple
    Food: "#FF4545", // Red
  };

  componentDidMount(): void {
    //For testing
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

    // return (
    //   <View>
    //     <ScrollView
    //       horizontal
    //       showsHorizontalScrollIndicator={true}
    //       contentContainerStyle={{flexGrow: 1}}
    //     >
    //       <VictoryChart
    //         width={Dimensions.get("window").width - 40}
    //         height={300}
    //         scale={{x: "linear", y: "linear"}}
    //         theme={VictoryTheme.material}
    //         padding={{ top: 50, bottom: 50, left: 70, right: 20 }}

    //         domain={{x: [1, this.state.lineData.length], y: [0, this.state.maxY * 1.1]}}
    //       >
    //         <VictoryLine
    //           data={this.state.lineData}
    //           labels={({ datum }) => datum.y}
    //           labelComponent={<VictoryLabel renderInPortal dy={-20}/>}
    //           style={{
    //             data: { stroke: "#c43a31" },
    //             parent: { border: "1px solid #ccc"}
    //           }}
    //         >
    //         </VictoryLine>
    //       </VictoryChart>
    //     </ScrollView>
    //   </View>
    // );
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
          <Spacer></Spacer>
          <Text
            style={{
              fontSize: 15,
              textAlign: "left",
              fontWeight: "bold",
              color: Colors.primary,
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
              Total: {this.state.totalAmount}
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
                label="DAYS"
                style={{
                  axis: { stroke: "#756f6a" },
                  axisLabel: { padding: 30, fontSize: 16 },
                  tickLabels: { fontSize: 12 },
                }}
              />
              <VictoryAxis
                dependentAxis
                label="AMOUNTS"
                style={{
                  axis: { stroke: "#756f6a" },
                  axisLabel: { padding: 40, fontSize: 16 },
                  tickLabels: { fontSize: 12 },
                }}
              />
              <VictoryLine
                data={this.state.lineData}
                labels={({ datum }) => datum.y}
                labelComponent={<VictoryLabel renderInPortal dy={-20} />}
                style={{
                  data: { stroke: "#c43a31" },
                  parent: { border: "1px solid #ccc" },
                }}
              ></VictoryLine>
            </VictoryChart>
          </View>
        </InnerStyledContainer>
      </ScrollableContainer>
    );
  };

  // Need to give a date as a json but method is GET in backend.
  fetchData = () => {
    console.log("fetchData");
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currDate = `${year}-${month}-${day}`;

    const monthName = date.toLocaleString("en-US", { month: "long" });
    this.setState({ month: monthName, date: currDate });

    // const args = { date: currDate };
    // For testing
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
          this.processPieData(data);
        } else if (graph === "line") {
          this.processlineData(data);
        }
      });
    } else {
      console.error("Error receiving user info");
    }
  };

  processPieData = (data: { [key: string]: number }) => {
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
    this.setState({ pieData: newData, loading: false });
  };

  processlineData = (data: { x: number; y: number }[]) => {
    const validY = data.map((point) => point.y).filter((y) => y != null);
    const max = Math.max(...validY);

    const total = data.reduce((sum, point) => sum + point.y, 0);

    this.setState({
      lineData: data,
      loading: false,
      maxY: max,
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
