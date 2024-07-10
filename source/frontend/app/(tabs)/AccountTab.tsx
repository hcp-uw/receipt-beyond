import { Text, View } from "react-native";
import Account from "../../pages/account";

export default function AccountTab() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Account/>
    </View>
  );
}
