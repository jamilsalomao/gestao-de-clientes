import { useState, useMemo } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  TextInput, StyleSheet, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useClients } from '../../src/context/ClientContext'; // Importa nosso hook
import Timeline from './Timeline';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ClientDetailModal = ({ visible, onClose, clientId }) => {
  // Usa o hook para acessar o contexto
  const { getClientById, addTimelineUpdate, markAsCompleted } = useClients();
  const [newUpdateText, setNewUpdateText] = useState('');

  // Busca os dados do cliente selecionado usando o ID
  const client = useMemo(() => {
    if (clientId) {
      return getClientById(clientId);
    }
    return null;
  }, [clientId, getClientById]);

  const handleAddUpdate = () => {
    if (!newUpdateText.trim()) {
      Alert.alert('Atenção', 'Por favor, escreva uma atualização.');
      return;
    }
    addTimelineUpdate(clientId, newUpdateText.trim());
    onClose(); // Fecha o modal
    setNewUpdateText(''); // Limpa o campo
  };

  const handleMarkAsCompleted = () => {
    markAsCompleted(clientId);
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
      onRequestClose={onClose}>
    <SafeAreaProvider>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Detalhes: {client.nome}</Text>
        </View>

        <View style={styles.modalContent}>
          <Text style={styles.timelineTitle}>Linha do Tempo</Text>

          <View style={styles.timelineWrapper}>
            <Timeline data={client.timeline} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Adicionar nova atualização..."
            placeholderTextColor="#9CA3AF"
            value={newUpdateText}
            onChangeText={setNewUpdateText}
            multiline
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleAddUpdate}>
            <Text style={styles.primaryButtonText}>Salvar Atualização</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleMarkAsCompleted}>
            <Text style={styles.secondaryButtonText}>Marcar como Concluído</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: '#F9FAFB' },
    modalHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginLeft: 15 },
    modalContent: { flex: 1, padding: 20 },
    timelineTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 20 },
    timelineWrapper: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 20, flex: 1 },
    input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, minHeight: 80, textAlignVertical: 'top', fontSize: 16, marginBottom: 15 },
    primaryButton: { backgroundColor: '#4F46E5', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
    primaryButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
    secondaryButton: { backgroundColor: '#10B981', padding: 15, borderRadius: 12, alignItems: 'center' },
    secondaryButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});

export default ClientDetailModal;