import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
} from "react-native";
import { Stack, Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SimpleBarChart from "../src/components/SimpleBarChart";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClients } from "../src/context/ClientContext";
import ClientDetailModal from "../src/components/Modal";


const MyClientsScreen = () => {
  const { clients } = useClients();
  const [activeTab, setActiveTab] = useState("ativos");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const { ativos, concluidos, total } = useMemo(() => {
    const ativosCount = clients.filter(
      (c) => c.status === "ativo"
    ).length;
    const concluidosCount = clients.filter(
      (c) => c.status === "concluido"
    ).length;
    return {
      ativos: ativosCount,
      concluidos: concluidosCount,
      total: ativosCount + concluidosCount,
    };
  }, [clients]);

  const filteredClients = clients.filter((client) =>
    activeTab === "ativos"
      ? client.status === "ativo"
      : client.status === "concluido"
  );

  const handleOpenModal = (client) => {
    setSelectedClientId(client);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedClientId(null);
  };

  const renderClientCard = ({ item }) => {
    const color = item.status === "ativo" ? "#4F46E5" : "#10B981";

    const statusIcon = item.status === 'ativo' ? 'send-circle-outline' : 'check-circle-outline';

    return (
    <TouchableOpacity onPress={() => handleOpenModal(item.id)}>
      <View style={styles.card}>
        <View style={[styles.cardBorder, { backgroundColor: color }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.clientName}>{item.nome}</Text>
            <Text style={styles.clientDate}>{item.data}</Text>
          </View>
          <Text style={styles.serviceName}>{item.servico}</Text>
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons
              name={statusIcon}
              size={16}
              color={color}
            />
            <Text style={styles.statusText}>{item.timeline[0].description}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>  
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Meus Clientes",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <StatusBar barStyle="dark-content" />

      <ClientDetailModal 
        visible={isModalVisible}
        onClose={handleCloseModal}
        clientId={selectedClientId}
      />

      <FlatList
        data={filteredClients}
        renderItem={renderClientCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "ativos" && styles.activeTab]}
                onPress={() => setActiveTab("ativos")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "ativos" && styles.activeTabText,
                  ]}
                >
                  Ativos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "concluidos" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("concluidos")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "concluidos" && styles.activeTabText,
                  ]}
                >
                  Concluídos
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalValue}>{total}</Text>
                <Text style={styles.totalLabel}>Total de Clientes</Text>
              </View>

              <SimpleBarChart
                activeValue={ativos}
                completedValue={concluidos}
              />
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "#4F46E5" }]}
                  />
                  <Text style={styles.legendText}>Ativos</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "#10B981" }]}
                  />
                  <Text style={styles.legendText}>Concluídos</Text>
                </View>
              </View>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabText: { color: "#4B5563", fontWeight: "600", fontSize: 14 },
  activeTabText: { color: "#1F2937" },
  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1F2937",
  },
  totalLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: -4,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 20,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { color: "#4B5563", fontSize: 14 },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  cardBorder: { width: 5 },
  cardContent: { padding: 16, flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  clientName: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
  clientDate: { fontSize: 12, color: "#6B7280" },
  serviceName: { fontSize: 14, color: "#4B5563", marginBottom: 12 },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    color: "#4B5563",
    marginLeft: 6,
    fontWeight: "500",
  },
});

export default MyClientsScreen;
