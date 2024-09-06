import styled from "styled-components/native";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

// colors
export const Colors = {
  primary: "#ffffff",
  black: "#000000",
  tertiary: "#1F2937",
  darkLight: "#9CA3AF",
  blue: "#007AFF",
  green: "#10B981",
  red: "#EF4444",
};

const { primary, black, tertiary, darkLight } = Colors;

export const StartLogo = styled.Image`
  width: 150px;
  height: 150px;
`;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 30}px;
  background-color: ${Colors.primary};
`;

export const InnerContainer = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
`;

export const Container = styled.View`
  flex: 1;
  background-color: ${Colors.primary};
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${Colors.tertiary};
  padding: 10px;
`;

export const Spacer = styled.Text`
  font-size: 8px;
  margin-bottom: 10px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
`;

export const StyledFormArea = styled.View`
  width: 90%;
`;

// Suggestion: change height to 40px. Update the following icons and placeholder size as well.
// Change the style using FROSTED color pal
export const StyledTextInput = styled.TextInput`
  background-color: ${black};
  padding: 12px;
  padding-left: 55px;
  padding-right: 20px;
  border-radius: 15px;
  font-size: 17px;
  height: 50px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${primary};
`;

export const StyledInputLabel = styled.Text`
  color: ${tertiary};
  font-size: 15px;
  text-align: left;
`;

export const LeftIcon = styled.View`
  position: absolute;
  left: 15px;
  top: 33px;
  z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 33px;
  position: absolute;
  z-index: 1;
`;

export const MsgBox = styled.Text<{ type: string }>`
  text-align: center;
  font-size: 13px;
  color: ${(props) => (props.type == "ERROR" ? Colors.red : Colors.green)};
`;

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${darkLight};
  margin-vertical: 10px;
`;

export const CenteredView = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: center;
  marginTop: 22px;
`;

export const ModalView = styled.View`
  margin: 20px;
  backgroundColor: lightgreen;
  borderRadius: 20px;
  padding: 35px;
  alignItems: center;
  shadowColor: #000;
  shadowOpacity: 0.25;
  shadowRadius: 4px;
  elevation: 5;
`;

/**
 * 
  shadowOffset: {
    width: 0px,
    height: 2px,
  };
 */
