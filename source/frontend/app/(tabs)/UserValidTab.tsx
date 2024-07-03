import { Text, View } from "react-native";
import UserValid from "../../pages/uservalid";

export default function UserValidTab() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <UserValid/>
    </View>
  );
}
