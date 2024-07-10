import { Text, View } from "react-native";
import PriceWatch from "../../pages/pricewatch";

export default function PriceWatchTab() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <PriceWatch/>
    </View>
  );
}
