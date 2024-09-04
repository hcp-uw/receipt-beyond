import { Text, View } from "react-native";
import React, {Component} from "react";

interface SummaryState {
  date: string
}


export class Summary extends Component<{}, SummaryState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      date: ""
    }
  }

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
  }
}
