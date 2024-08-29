import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import DateButton from "../components/dateButton";
import { useRouter } from "expo-router"; // Import the useRouter hook for navigation

export default function History() {
  const [dateBrackets, setDateBrackets] = useState<string[]>([]);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchDateBrackets = async () => {
      try {
        const response = await fetch(
          "https://receiptplus.pythonanywhere.com/api/receipt_date_brackets",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setDateBrackets(data);
      } catch (error) {
        console.error("Error fetching date brackets:", error);
      }
    };
    fetchDateBrackets();
  }, []);

  const handleButtonPress = (dateString: string) => {
    // Navigate to the DetailedHistory screen and pass the date as a parameter
    router.push({
      pathname: "/DetailedHistoryTab", // Make sure you have the correct path for this screen
      params: { year_month: dateString },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {dateBrackets.map((dateString, index) => (
          <DateButton
            key={index}
            dateString={dateString}
            onPress={() => handleButtonPress(dateString)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    alignItems: "center",
    paddingVertical: 20, // Optional: add padding for better spacing
  },
});
