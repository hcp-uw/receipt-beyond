import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { Component } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { UserValidStackParamList } from "../app/StackParamList";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import {
  StyledContainer,
  InnerContainer,
  Spacer,
  MsgBox,
  InnerStyledContainer,
  Colors,
} from "@/components/style";

interface Item {
  name: string,
  price: string | number,
  quantity: string | number
}

interface UserValidProps {
  navigation: StackNavigationProp<UserValidStackParamList, "UserValidation">;

  route: RouteProp<UserValidStackParamList, "UserValidation">;
}

interface UserValidState {
  store: string;
  address: string;
  date: string;
  total: string | number;
  category: string;
  items: Item[];
  message: string;
  messageType: string;
}

export class UserValid extends Component<UserValidProps, UserValidState> {
  constructor(props: UserValidProps) {
    super(props);

    this.state = {
      store: "",
      address: "",
      date: "",
      total: "",
      category: "",
      items: [{name: "", price: "", quantity: ""}],
      message: "",
      messageType: "",
    };
  }

  componentDidMount(): void {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.handleSave} style={{ marginRight: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }

  render = (): JSX.Element => {
    return (
      <KeyboardAvoidingWrapper>
        <ScrollView>
          <StyledContainer>
            <InnerStyledContainer>
              <View
                style={{
                  marginBottom: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Store: </Text>
                  <TextInput
                    placeholder="Green Valley Market"
                    placeholderTextColor={"gray"}
                    value={this.state.store}
                    onChangeText={(value) => this.handleChange("store", value)}
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Address: </Text>
                  <TextInput
                    placeholder="123 Greenway Ave, Springfield, IL 62701"
                    placeholderTextColor={"gray"}
                    value={this.state.address}
                    onChangeText={(value) =>
                      this.handleChange("address", value)
                    }
                    style={{
                      borderBottomWidth: 1,
                      marginBottom: 10,
                      marginLeft: 10,
                      flex: 1,
                      minHeight: 60,
                      textAlignVertical: "top",
                    }}
                    multiline
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Date: </Text>
                  <TextInput
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={"gray"}
                    value={this.state.date}
                    onChangeText={(value) => this.handleChange("date", value)}
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Total: </Text>
                  <TextInput
                    placeholder="25.33"
                    placeholderTextColor={"gray"}
                    value={String(this.state.total)}
                    onChangeText={(value) => this.handleChange("total", value)}
                    style={{ borderBottomWidth: 1, marginBottom: 10}}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Category: </Text>
                  <TextInput
                    placeholder="Groceries"
                    placeholderTextColor={"gray"}
                    value={this.state.category}
                    onChangeText={(value) =>
                      this.handleChange("category", value)
                    }
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                  />
                </View>
              </View>

              {/** Items section */}
              <Text
                style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}
              >
                Items
              </Text>
              {this.state.items.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    placeholder="Item Name"
                    placeholderTextColor={"gray"}
                    value={item.name}
                    onChangeText={(value) =>
                      this.handleItemChange(index, "name", value)
                    }
                    style={{
                      flex: 3,
                      borderWidth: 1,
                      padding: 10,
                      marginRight: 5,
                    }}
                  />
                  <TextInput
                    placeholder="Price"
                    placeholderTextColor={"gray"}
                    value={String(item.price)}
                    onChangeText={(value) => this.handleItemChange(index, 'price', value)}
                    style={{ flex: 2, borderWidth: 1, padding: 10, marginRight: 5 }}
                    keyboardType="numeric"
                  />
                  <TextInput
                    placeholder="Qty"
                    placeholderTextColor={"gray"}
                    value={String(item.quantity)}
                    onChangeText={(value) => this.handleItemChange(index, 'quantity', value)}
                    style={{ flex: 1, borderWidth: 1, padding: 10, marginRight: 5 }}
                    keyboardType="numeric"
                  />
                </View>
              ))}
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      items: [
                        ...this.state.items,
                        { name: "", price: "", quantity: ""},
                      ],
                    })
                  }
                  style={{
                    padding: 10,
                    backgroundColor: Colors.blue,
                    justifyContent: "center", // Center vertically
                    alignItems: "center", // Center horizontally
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              <Spacer></Spacer>
              <MsgBox type={this.state.messageType}>
                {this.state.message}
              </MsgBox>
            </InnerStyledContainer>
          </StyledContainer>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    );
  };

  // handleAddItem = () => {

  //   /**
  //    * IDEA:
  //    * 1. Add a conditional where the name, price, quantity has to have
  //    *     some sort of an input before adding a new item row
  //    * 2. Create a limit of numbers of empty items that could be created
  //   */

  //   this.setState({
  //     items: [...this.state.items, { name: '', price: 0, quantity: 0 }],  // Add new item to list
  //   });
  // };

  handleChange = (name: keyof UserValidState, value: string) => {
    this.setState({ [name]: value } as unknown as Pick<
      UserValidState,
      keyof UserValidState
    >);
  };

  handleItemChange = (index: number, field: string, value: string) => {
    const items = [...this.state.items];
    // if (field === 'quantity' || field === 'price') {
    //   items[index] = { ...items[index], [field]: parseFloat(value) || 0 };
    // } else {
    //   items[index] = { ...items[index], [field]: value };
    // }
    items[index] = { ...items[index], [field]: value };
    this.setState({ items });
  };

  validate = (): boolean => {
    if (
      this.state.store === "" ||
      this.state.address === "" ||
      this.state.date === "" ||
      this.state.total === "" ||
      this.state.category === "" ||
      this.state.items.length === 0
    ) {
      this.setState({
        message: "Please fill in all fields",
        messageType: "ERROR",
      });
      return false;
    }

    const date = new Date(this.state.date);
    if (isNaN(date.getTime())) {
      this.setState({
        message: "Invalid date",
        messageType: "ERROR",
      });
      return false;
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currDate = `${year}-${month}-${day}`;
    this.setState({ date: currDate });

    const totalAsNumber = Number(this.state.total);
    if (isNaN(totalAsNumber)) {
      this.setState({
        message: "Total amount is not a number",
        messageType: "ERROR"
      });
      return false;
    }

    if (totalAsNumber < 0) {
      this.setState({
        message: "Total amount can not be a negative value",
        messageType: "ERROR"
      });
      return false;
    }

    this.setState({total: totalAsNumber})

    for (const item of this.state.items) {
      if (item.name === "" || item.price === "" || item.quantity === "") {
        this.setState({
          message: "Please fill all the fields of the Items",
          messageType: "ERROR",
        });
        return false;
      } 

      const priceAsNumber = parseFloat(item.price as string);
      const quantityAsNumber = parseFloat(item.quantity as string);
      
      if (isNaN(priceAsNumber)) {
        this.setState({
          message: "Price is not a number",
          messageType: "ERROR"
        });
        return false;
      } else if (isNaN(quantityAsNumber)) {
        this.setState({
          message: "Quantity is not a number",
          messageType: "ERROR"
        });
        return false;
      }

      item.price = priceAsNumber;
      item.quantity = quantityAsNumber;
    }
    return true;
  };

  handleSave = () => {
    if (this.validate()) {
      const args = {
        receipt_date: this.state.date,
        category: this.state.category,
        total: this.state.total,
        store: this.state.store,
        location: this.state.address,
        purchases: this.state.items,
      };
      fetch("https://receiptplus.pythonanywhere.com/api/receipts", {
        method: "POST",
        body: JSON.stringify(args),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(this.handleResponse)
        .catch(() => this.handleError("failed to connect to the server"));
    }
  };

  handleResponse = (res: Response) => {
    // res.ok: 200 ~ 299
    if (res.ok) {
      return res.json().then((data) => {
        this.setState({
          message: data.message,
          messageType: "SUCCESS",
        });
        this.resetForm();
      });
    } else {
      // errorData is the object return from the Response for error status >= 400
      return res.json().then((errorData) => {
        this.handleError(errorData.error);
      });
    }
  };

  handleError = (errorMessage: string) => {
    this.setState({ message: errorMessage, messageType: "ERROR" });
  };

  resetForm = () => {
    this.setState({
      store: "",
      address: "",
      date: "",
      total: "",
      category: "",
      items: [{name: "", price: "", quantity: ""}],
      message: "",
      messageType: ""
    });
  }
}
