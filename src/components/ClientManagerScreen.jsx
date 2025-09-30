import {View, Text, TouchableOpacity, StatusBar, StyleSheet,} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const ClientManagerScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View style={styles.card}>
        <MaterialCommunityIcons
          name="format-list-checks"
          size={75}
          color="#6366F1"
        />

        <Text style={styles.title}>Gestor de Clientes</Text>

        <Text style={styles.subtitle}>Seu assistente de serviços.</Text>

        <Link href={"/NewClientScreen"} style={{ width: "100%" }} asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <MaterialCommunityIcons
              name="plus-circle"
              size={22}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.primaryButtonText}>Novo Cliente/Serviço</Text>
          </TouchableOpacity>
        </Link>

        <Link href= "/MyClientsScreen" style={{ width: "100%" }} asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <MaterialCommunityIcons
              name="account-group"
              size={22}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.secondaryButtonText}>Meus Clientes</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6", 
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 30,
    textAlign: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1", 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#374151", 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default ClientManagerScreen;
