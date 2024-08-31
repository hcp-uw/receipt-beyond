import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Receipt {
  category: string;
  date: string;
  location: string;
  purchases: { name: string; price?: number; quantity?: number }[];
  store: string;
  total: number;
}

interface ReceiptFormProps {
  receipt: Receipt;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ receipt }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{receipt.store}</Text>
        <Text style={styles.headerText}>{receipt.date}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>{receipt.category}</Text>
        <Text style={styles.bodyText}>{receipt.location}</Text>
        {receipt.purchases.map((item, index) => (
          <View key={index} style={styles.purchaseItem}>
            <Text style={styles.purchaseItemText}>{item.name}</Text>
            {item.price !== undefined && item.quantity !== undefined && (
              <Text style={styles.purchaseItemText}>
                {item.quantity} x ${item.price.toFixed(2)}
              </Text>
            )}
          </View>
        ))}
        <Text style={styles.totalText}>Total: ${receipt.total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#29353C",
  },
  body: {
    marginTop: 8,
  },
  bodyText: {
    fontSize: 14,
    color: "#29353C",
    marginBottom: 4,
  },
  purchaseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  purchaseItemText: {
    fontSize: 14,
    color: "#29353C",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#29353C",
    marginTop: 8,
  },
});

export default ReceiptForm;
