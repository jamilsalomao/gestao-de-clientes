import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClientsProvider } from "../src/context/ClientContext";
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <ClientsProvider>
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
          name="MyClientsScreen" 
          options={{
            title: "Meus Clientes", 
            headerBackTitleVisible: false, 
          }}
        />
      </Stack>
    </SafeAreaProvider>
    <Toast topOffset={60}/>
    </ClientsProvider>
  );
}