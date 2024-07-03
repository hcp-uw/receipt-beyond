import { Stack } from "expo-router";

export default function RootLayout() {
  // remove 'options={{headerShown: false}}' when header is needed
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  );
}
