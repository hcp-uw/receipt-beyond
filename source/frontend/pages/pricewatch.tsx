import { Text, View } from "react-native";
import { StyledContainer, StyledText } from "../components/style";

export default function PriceWatch() {
  /**
   * Have corn and carrots data as testing
   * Backend implements only single item search
   * Frontend search tab with bar graph
   *  if the user types in a letter, 
   *  it shows a dropdown with all the items that starts with that letter 
   *  and the user could press it to see that item's prices
   */
  return (
    <StyledContainer>
      <StyledText>PriceWatch Screen</StyledText>
    </StyledContainer>
  );
}
