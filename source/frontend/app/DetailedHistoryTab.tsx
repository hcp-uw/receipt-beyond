import React from "react";
import { View } from "react-native";
import DetailedHistory from "../pages/detailedhistory";
import { useLocalSearchParams } from "expo-router";

export default function DetailedHistoryTab() {
  const params = useLocalSearchParams();
  const year_month =
    typeof params.year_month === "string" ? params.year_month : "";
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DetailedHistory year_month={year_month} />
    </View>
  );
}
