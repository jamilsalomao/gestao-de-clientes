import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClients } from "../src/context/ClientContext";
import ClientDetailModal from "../src/components/ClientDetailModal";
import SimpleBarChart from "../src/components/SimpleBarChart";
import * as Haptics from "expo-haptics";

const MyClientsScreen = () => {
  const router = useRouter();
  const { clients, loading } = useClients();
  const [activeTab, setActiveTab] = useState("ativos");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { ativos, concluidos, total } = useMemo(() => {
    const ativosCount = clients.filter((c) => c.status === "ativo").length;
    const concluidosCount = clients.filter(
      (c) => c.status === "concluido"
    ).length;
    return {
      ativos: ativosCount,
      concluidos: concluidosCount,
      total: ativosCount + concluidosCount,
    };
  }, [clients]);

  const filteredClients = useMemo(() => {
    const parseDate = (dateString) => {
      if (!dateString) return new Date(0); 
      const parts = dateString.split("/");
      if (parts.length !== 3) return new Date(0);
      const [day, month, year] = parts;
      return new Date(year, month - 1, day);
    };
    const sortedClients = [...clients].sort((a, b) => {
      const dateA = parseDate(a.data);
      const dateB = parseDate(b.data);
      return dateB - dateA;
    });
    const clientsByTab = sortedClients.filter((client) =>
      activeTab === "ativos"
        ? client.status === "ativo"
        : client.status === "concluido"
    );
    if (!searchQuery) {
      return clientsByTab;
    }
    return clientsByTab.filter((client) =>
      client.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, activeTab, searchQuery]);

  const handleOpenModal = (clientId) => {
    setSelectedClientId(clientId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedClientId(null);
  };

  const renderClientCard = ({ item }) => {
    const color = item.status === "ativo" ? "#DB7105" : "#0E2C40";
    const statusIcon =
      item.status === "ativo" ? "send-circle-outline" : "check-circle-outline";

    return (
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleOpenModal(item.id);
        }}
      >
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
              <Text style={styles.statusText} numberOfLines={1}>
                {item.timeline[0]?.description}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyListComponent = () => {
    const isSearching = searchQuery.length > 0;

    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={64}
          color="#CBD5E1"
        />
        <Text style={styles.emptyTitle}>
          {isSearching ? "Nenhum Resultado" : "Lista Vazia"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {isSearching
            ? "Não encontramos clientes com esse nome."
            : `Ainda não há serviços na categoria de ${activeTab === "ativos" ? "Ativos" : "Concluídos"}.`}
        </Text>
        {!isSearching && activeTab === "ativos" && (
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push("/NewClientScreen")}
          >
            <Text style={styles.emptyButtonText}>
              Adicionar Primeiro Cliente
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </SafeAreaView>
    );
  }

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
        ListEmptyComponent={EmptyListComponent}
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

            <View style={styles.dashboardContainer}>
              <View style={styles.metricsContainer}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricValue}>{ativos}</Text>
                  <Text style={styles.metricLabel}>Ativos</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricValue}>{concluidos}</Text>
                  <Text style={styles.metricLabel}>Concluídos</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricValue}>{total}</Text>
                  <Text style={styles.metricLabel}>Total</Text>
                </View>
              </View>

              <SimpleBarChart
                activeValue={ativos}
                completedValue={concluidos}
              />

              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "#DB7105" }]}
                  />
                  <Text style={styles.legendText}>Ativos</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "#0E2C40" }]}
                  />
                  <Text style={styles.legendText}>Concluídos</Text>
                </View>
              </View>

              <View style={styles.searchContainer}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={22}
                  color="#9CA3AF"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Pesquisar por nome..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
          </>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#1F2937",
  },
  dashboardContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  metricBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: "#4B5563",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#1F2937",
  },
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
  cardBorder: {
    width: 5,
  },
  cardContent: {
    padding: 16,
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  clientDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  serviceName: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 12,
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginTop: -50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0E2C40",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 24,
    backgroundColor: "#0E2C40",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyClientsScreen;
