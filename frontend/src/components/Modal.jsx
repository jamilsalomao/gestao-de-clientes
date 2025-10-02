import { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useClients } from "../../src/context/ClientContext";
import Timeline from "./Timeline";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

const ClientDetailModal = ({ visible, onClose, clientId }) => {
  const { getClientById, addTimelineUpdate, markAsCompleted, deleteClient } = useClients();
  const [newUpdateText, setNewUpdateText] = useState("");

  const client = useMemo(() => {
    if (clientId) {
      return getClientById(clientId);
    }
    return null;
  }, [clientId, getClientById, useClients]);

  const handleDelete = () => {
    Alert.alert(
      "Excluir Serviço",
      `Tem certeza que deseja excluir o serviço de "${client.nome}"? Esta ação não pode ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => {
            deleteClient(clientId);
            Toast.show({
              type: 'success',
              text1: 'Serviço Excluído'
            });
            onClose();
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleAddUpdate = () => {
    if (!newUpdateText.trim()) {
      Toast.show({ type: 'error', text1: 'Escreva uma atualização.' });
      return;
    }
    addTimelineUpdate(clientId, newUpdateText.trim());
    Toast.show({ 
      type: 'success',
      text1: 'Atualização Salva!'
    });
    onClose();
    setNewUpdateText("");
  };

  const handleMarkAsCompleted = () => {
    markAsCompleted(clientId);
    Toast.show({ 
      type: 'success',
      text1: 'Serviço Concluído!'
    });
    onClose();
  };

  if (!client) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="#1F2937"
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Detalhes: {client.nome}</Text>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.timelineTitle}>Linha do Tempo</Text>

            <View style={styles.timelineWrapper}>
              <Timeline data={client.timeline} />
            </View>

            {client.status === "ativo" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Adicionar nova atualização..."
                  placeholderTextColor="#9CA3AF"
                  value={newUpdateText}
                  onChangeText={setNewUpdateText}
                  multiline
                />
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleAddUpdate}
                >
                  <Text style={styles.primaryButtonText}>
                    Salvar Atualização
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleMarkAsCompleted}
                >
                  <Text style={styles.secondaryButtonText}>
                    Marcar como Concluído
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {client.status === "concluido" && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.deleteButtonText}>Excluir Serviço</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: { flex: 1, backgroundColor: "#F9FAFB" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 15,
  },
  modalContent: { flex: 1, padding: 20 },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 20,
  },
  timelineWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    flex: 1,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#DB7105",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  secondaryButton: {
    backgroundColor: "#0E2C40",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default ClientDetailModal;
