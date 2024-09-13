import React from "react";
import {
  Button,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { StyledTextDark } from "../components/style";

interface DateButton {
  dateString: string;
  onPress: () => void;
}

const DateBracketButton: React.FC<DateButton> = ({ dateString, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <StyledTextDark>{dateString}</StyledTextDark>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    paddingVertical: 10,
    // paddingHorizontal: 100,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    marginTop: 14,
    marginHorizontal: 14,
    // width: "100%",
  },
});

export default DateBracketButton;
