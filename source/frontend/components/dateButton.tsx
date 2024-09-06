import React from "react";
import {
  Button,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

interface DateButton {
  dateString: string;
  onPress: () => void;
}

const DateBracketButton: React.FC<DateButton> = ({ dateString, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{dateString}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#AAC7D8",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    margin: 4,
    // width: "100%",
  } as ViewStyle,
  buttonText: {
    color: "#29353C",
    fontWeight: "bold",
  },
});

export default DateBracketButton;
