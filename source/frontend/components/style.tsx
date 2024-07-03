import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import Constants from 'expo-constants';


const StatusBarHeight = Constants.statusBarHeight;

// colors
export const Colors = {
  primary: '#ffffff',
  black: '#000000',
  tertiary: '#1F2937',
  darkLight: '#9CA3AF',
  aqua: '#0096FF',
  green: '#10B981',
  red: '#EF4444'
};

const { primary, black, tertiary, darkLight} = Colors;

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

export const StyledTextInput = styled.TextInput`
  background-color: ${black};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 15px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${primary};
`;

export const StyledInputLabel = styled.Text`
  color: ${tertiary};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcon = styled.View`
  left: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const MsgBox = styled.Text<{type: string}>`
  text-align: center;
  font-size: 13px;
  color: ${props => props.type == "ERROR" ? Colors.red : Colors.green};
`;