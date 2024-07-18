import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

type Item = {
  id: number;
  quantity: number;
  price: number;
};

export default function UserValid() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, quantity: 1, price: 20 },
    { id: 2, quantity: 3, price: 0 },
    { id: 3, quantity: 2, price: 0 },
    { id: 4, quantity: 3, price: 10 },
    { id: 5, quantity: 3, price: 10 },
    { id: 6, quantity: 3, price: 10 },
    { id: 7, quantity: 3, price: 10 },
  ]);

  const handleItemChange = (id: number, field: string, value: number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttons}>
        <Button title="Scan Again" onPress={() => {}} />
        <Button title="Upload Photo" onPress={() => {}} />
      </View>
      <Text style={styles.header}>UserValid Screen</Text>
      <View style={styles.formGroup}>
        <Text>Store</Text>
        <TextInput style={styles.input} placeholder="Value" />
      </View>
      <View style={styles.formGroup}>
        <Text>Address</Text>
        <TextInput style={styles.input} placeholder="Address" />
      </View>
      <View style={styles.formGroup}>
        <Text>Date</Text>
        <TextInput style={styles.input} placeholder="MM/DD/YYYY" />
      </View>
      <View style={styles.formGroup}>
        <Text>Total</Text>
        <TextInput style={styles.input} value={`$${total}`} editable={false} />
      </View>
      <View style={styles.formGroup}>
        <Text>Category</Text>
        <TextInput style={styles.input} defaultValue="Food" />
      </View>
      <View style={styles.items}>
        {items.map(item => (
          <View key={item.id} style={styles.item}>
            <Text>Item {item.id}</Text>
            <TextInput
              style={styles.itemInput}
              keyboardType="numeric"
              value={String(item.quantity)}
              onChangeText={text => handleItemChange(item.id, 'quantity', parseInt(text))}
            />
            <TextInput
              style={styles.itemInput}
              keyboardType="numeric"
              value={String(item.price)}
              onChangeText={text => handleItemChange(item.id, 'price', parseInt(text))}
            />
            <Button title="Delete" onPress={() => handleDeleteItem(item.id)} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  formGroup: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  items: {
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    width: 50,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});