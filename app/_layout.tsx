import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
      <Stack.Screen name="index" options={{ title: "Pokemon List" }} />
      <Stack.Screen name="details" options={
        { title: "Pokemon Details", 
        presentation: "modal",
        headerBackButtonDisplayMode: "default",
        sheetAllowedDetents: [0.3, 0.5, 1],
        headerBackVisible:false
        }} />
  
  </Stack>
  );
}
