import { useState, useMemo, useEffect } from "react";
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
import { useClients } from "../context/ClientContext";
import Timeline from "./Timeline";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const ClientDetailModal = ({ visible, onClose, clientId }) => {
  const { getClientById, addTimelineUpdate, markAsCompleted, deleteClient, updateClientDetails } = useClients();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedService, setEditedService] = useState('');

  const [newUpdateText, setNewUpdateText] = useState("");
  const client = useMemo(() => {
    if (clientId) {
      return getClientById(clientId);
    }
    return null;
  }, [clientId, getClientById, useClients]);

  useEffect(() => {
    if (client) {
      setEditedName(client.nome);
      setEditedService(client.servico);
    }
  }, [client]);

  const handleEnterEditMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedName(client.nome);
    setEditedService(client.servico);
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    updateClientDetails(clientId, { nome: editedName, servico: editedService });
    Toast.show({ type: 'success', text1: 'Alterações Salvas!' });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false); 
    onClose();
  };

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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  if (!client) {
    return null;
  }

 return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={handleClose}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleClose}>
              <MaterialCommunityIcons name="arrow-left" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Detalhes do Cliente</Text>
            {client.status === 'ativo' && !isEditing && (
              <TouchableOpacity onPress={handleEnterEditMode} style={styles.editButton}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color="#1F2937" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.modalContent}>
            <View style={styles.detailsSection}>
              <Text style={styles.label}>Nome do cliente</Text>
              {isEditing ? (
                <TextInput style={styles.input} value={editedName} onChangeText={setEditedName} />
              ) : (
                <Text style={styles.detailText}>{client.nome}</Text>
              )}
            </View>

            <View style={styles.detailsSection}>
              <Text style={styles.label}>Serviço contratado</Text>
              {isEditing ? (
                <TextInput style={styles.input} value={editedService} onChangeText={setEditedService} />
              ) : (
                <Text style={styles.detailText}>{client.servico}</Text>
              )}
            </View>

            <Text style={styles.timelineTitle}>Linha do Tempo</Text>
            <View style={styles.timelineWrapper}>
              <Timeline data={client.timeline} />
            </View>
          </View>
          
          <View style={styles.footer}>
            {client.status === 'ativo' && !isEditing && (
              <>
                <TextInput style={styles.input} placeholder="Adicionar nova atualização..." placeholderTextColor={'#9CA3AF'} value={newUpdateText} onChangeText={setNewUpdateText} multiline />
                <TouchableOpacity style={styles.primaryButton} onPress={handleAddUpdate}><Text style={styles.primaryButtonText}>Salvar Atualização</Text></TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleMarkAsCompleted}><Text style={styles.secondaryButtonText}>Marcar como Concluído</Text></TouchableOpacity>
              </>
            )}
            {client.status === 'ativo' && isEditing && (
              <>
                <TouchableOpacity style={styles.primaryButton} onPress={handleSaveChanges}><Text style={styles.primaryButtonText}>Salvar Alterações</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryButton, styles.cancelButton]} onPress={handleCancelEdit}><Text style={styles.cancelButtonText}>Cancelar</Text></TouchableOpacity>
              </>
            )}
            {client.status === 'concluido' && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}><MaterialCommunityIcons name="trash-can-outline" size={20} color="#FFFFFF" /><Text style={styles.deleteButtonText}>Excluir Serviço</Text></TouchableOpacity>
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
  modalTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    modalContent: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
    detailsSection: { marginBottom: 20 },
    label: { color: '#6B7280', fontSize: 14, marginBottom: 4 },
    detailText: { color: '#1F2937', fontSize: 16 },
    timelineTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 10, marginTop: 10 },
  timelineWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    flex: 1, 
    marginBottom: 20,
  },
    footer: { 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB' 
  },
    input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, marginBottom: 15, textAlignVertical: 'top' },
    editButton: { padding: 4 },
    cancelButton: { backgroundColor: '#0E2C40' },
    cancelButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
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
