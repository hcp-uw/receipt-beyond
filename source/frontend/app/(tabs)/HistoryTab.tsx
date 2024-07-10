import { Text, View } from "react-native";
import History from "../../pages/history";

export default function HistoryTab() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <History/>
    </View>
  );
}
