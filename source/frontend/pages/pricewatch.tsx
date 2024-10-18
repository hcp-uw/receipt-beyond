import { Text, View, Dimensions, FlatList, TouchableOpacity, Button} from "react-native";
import React, {Component} from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { PriceWatchStackParamList } from "../app/StackParamList";
import { InnerStyledContainer, StyledContainer, Colors, Spacer} from "../components/style";
import { TextInput } from "react-native-gesture-handler";
import {VictoryChart, VictoryTheme, VictoryBar, VictoryAxis} from "victory-native";

interface PriceWatchProps {
  navigation: NavigationProp<PriceWatchStackParamList, "PriceWatch">;
  route: RouteProp<PriceWatchStackParamList, "PriceWatch">;
}

interface PriceWatchState {
  item: string;
  itemList: any[];
  filterList: any[];
  zipCode: string;
  barData: any[]
}

export class PriceWatch extends Component<PriceWatchProps, PriceWatchState> {
  constructor(props: PriceWatchProps) {
    super(props);
    this.state = {
      item: "",
      itemList: [],
      filterList: [],
      zipCode: "",
      barData: []
    };
  }

  render = () => {
    return (
      <StyledContainer>
        <InnerStyledContainer
          style={{
            marginHorizontal: 10,
            width: Dimensions.get("window").width - 20,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              textAlign: "left",
              fontWeight: "bold",
              color: Colors.primary,
            }}
          >
            Search Items
          </Text>
          <Spacer/>
          <Spacer/>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20
            }}
          >
            <Text
              style={{
                fontSize: 15,
                paddingHorizontal: 15,
                width: 100
              }}
            >
              Zip Code:
            </Text>
            <TextInput
              placeholder="Type your Zip Code"
              value={this.state.zipCode}
              onChangeText={(value) => this.handleZipCode(value)}
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
                flex: 1
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20
            }}
          >
            <Text
              style={{
                fontSize: 15,
                paddingHorizontal: 15,
                width: 100
              }}
            >
              Items:
            </Text>
            <TextInput
              placeholder="Type to search..."
              value={this.state.item}
              onChangeText={(value) => this.handleSearchInput(value)}
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
                flex: 1
              }}
              />
          </View>

          <Button
            title="Search"
            onPress={this.fetchBarData}
            color={Colors.blue}
          />

          {this.state.filterList.length > 0 && 
            <FlatList
            data={this.state.filterList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.setState({ item: item, filterList: [] })}>
                <Text 
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgray"
                  }}
                  >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            style={{
              maxHeight: 150,
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 5,
              position: "absolute",
              zIndex: 1,
              width: "68.5%",
              backgroundColor: "white",
              top: 186,
              left: 124,
            }}
            />
          }

          <Spacer/>
          <Spacer/>
          <Spacer/>
          {this.state.barData.length > 0 &&
          <View
            style={{
              alignItems: "center",
              marginLeft: 10
            }}
          >
            <VictoryChart
              width={Dimensions.get("window").width}
              height={300}
              scale={{x: "linear", y: "linear"}}
              theme={VictoryTheme.material}
              padding={{top: 50, bottom: 50, left: 70, right: 30}}
              domainPadding={{x: 80, y:10}}
            >
              <VictoryAxis
                label="STORES"
                style={{
                  axis: {stroke: "#756f6a"},
                  axisLabel: {padding: 30, fontSize: 16}
                }}
              />
              <VictoryAxis
              dependentAxis
                label="PRICE"
                style={{
                  axis: {stroke: "#756f6a"},
                  axisLabel: {padding: 40, fontSize: 16}
                }}
              />
              <VictoryBar
                style={{data: {fill: "#44576D"}}}
                data={this.state.barData}
                barWidth={20}
                labels={({datum}) => datum.y}
                sortKey={"y"}
              />
            </VictoryChart>
          </View>
          }
        </InnerStyledContainer>
      </StyledContainer>
    );
  }

  handleZipCode = (value: string) => {
    this.setState({zipCode: value}, () => {
      if (value.length == 5) {
        this.fetchItemList();
      }
    });
  };

  fetchItemList = () => {

    const args= {zip_code: this.state.zipCode};

    fetch("https://receiptplus.pythonanywhere.com/api/get_items_by_zipcode", {
      method: "POST",
      body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    .then(this.handleSearch)
    .catch((error) => {
      console.error("Error fetching api/get_items_by_zipcode")
    });
  }

  handleSearch = (res: Response) => {
    if (res.ok) {
      res.json().then((data) => {

        this.setState({itemList: data});
      })
    } else {
      console.error("Error receiving item list");
    }
  }

  handleSearchInput = (value: string) => {
    this.setState({item: value});

    const filter = this.state.itemList.filter((item) => 
      item.toLowerCase().startsWith(value.toLowerCase())
    );

    this.setState({filterList: filter});
  }

  fetchBarData = () => {

    const args = {zip_code: this.state.zipCode, item_name: this.state.item};

    fetch("https://receiptplus.pythonanywhere.com/api/receipt_info", {
      method: "POST",
      body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    .then(this.handleBarData)
    .catch((error) => {
      console.error("Error fetching api/receipt_date_brackets")
    });
  }

  handleBarData = (res: Response) => {
    if (res.ok) {
      res.json().then((data) => {
        this.processBarData(data);
      })
    } else {
      console.error("Error receiving price information");
    }
  }

  processBarData = (data: {address:string, data:string, 
                            price:number, store_name:string}[]) => {
    
    const newData = data.map(({store_name, price}) => ({
      x: store_name,
      y: price
    }));

    this.setState({barData: newData});
  }
}
