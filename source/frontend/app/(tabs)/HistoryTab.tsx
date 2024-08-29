import React from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import History from "../../pages/history";

export default function HistoryTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>History</Text>
      </View>
      <View style={styles.content}>
        <History />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29353C",
  },
  banner: {
    backgroundColor: "#29353C", // Adjust background color as needed
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  bannerText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
