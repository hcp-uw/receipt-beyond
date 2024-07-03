import { Text, View } from "react-native";
import Summary from "../../pages/summary";

export default function SummaryTab() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Summary/>
    </View>
  );
}
