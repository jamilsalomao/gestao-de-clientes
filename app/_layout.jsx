import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Início",
            headerShown: false, 
          }}
        />
        
        <Stack.Screen
          name="NewClientScreen" 
          options={{
            title: "Novo Cliente", 
            headerBackTitleVisible: false, 
          }}
        />
        
        <Stack.Screen
          name="myClientsScreen" 
          options={{
            title: "Meus Clientes", 
            headerBackTitleVisible: false, 
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}