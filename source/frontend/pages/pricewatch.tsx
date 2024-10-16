import { Text, View } from "react-native";
import React, {Component} from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { PriceWatchStackParamList } from "../app/StackParamList";
import { StyledContainer, StyledText } from "../components/style";

/**
 * Have corn and carrots data as testing
 * Backend implements only single item search
 * Frontend search tab with bar graph
 *  if the user types in a letter, 
 *  it shows a dropdown with all the items that starts with that letter 
 *  and the user could press it to see that item's prices
 */


interface PriceWatchProps {
  navigation: NavigationProp<PriceWatchStackParamList, "PriceWatch">;
  route: RouteProp<PriceWatchStackParamList, "PriceWatch">;
}

interface PriceWatchState {
  search: any[];
}

export class PriceWatch extends Component<PriceWatchProps, PriceWatchState> {
  constructor(props: PriceWatchProps) {
    super(props);
    this.state = {
      search: []
    }
  }

  render = () => {
    return (
      <View>
        <Text>
          PriceWatch Screen
        </Text>
      </View>
    );
  } 
}
