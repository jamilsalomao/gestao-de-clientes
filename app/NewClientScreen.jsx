import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Platform, Modal, Alert} from "react-native";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClients } from '../src/context/ClientContext';

const NewClientScreen = () => {
  const router = useRouter();
  const { addClient } = useClients();
  const [nome, setNome] = useState('');
  const [servico, setServico] = useState('');
  const [date, setDate] = useState(null);
  const [statusInicial, setStatusInicial] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleSave = () => {
    if (!nome.trim() || !servico.trim() || !date || !statusInicial.trim()) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos para salvar.');
      return;
    }
    addClient({
      nome,
      servico,
      date,
      statusInicial,
    });
    router.back();
  };

  const toggleDatePicker = () => {
    setTempDate(date || new Date());
    setShowPicker(true);
  };
  const onChangeDate = ({ type }, selectedDate) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (type === "set") {
        setDate(selectedDate);
      }
    } else {
      setTempDate(selectedDate);
    }
  };

  const handleConfirmIOS = () => {
    setDate(tempDate);
    setShowPicker(false);
  };

  const handleCancelIOS = () => {
    setShowPicker(false);
  };

  const formatDate = (rawDate) => {
    if (!rawDate) return null;
    let d = new Date(rawDate);
    let day = d.getDate().toString().padStart(2, "0");
    let month = (d.getMonth() + 1).toString().padStart(2, "0");
    let year = d.getFullYear();
    return `${day} / ${month} / ${year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ title: "Novo Cliente", headerTitleAlign: "center" }}
      />
      <StatusBar barStyle="dark-content" />

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date || new Date()}
          onChange={onChangeDate}
        />
      )}

      {showPicker && Platform.OS === "ios" && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.iosModalCenteredView}>
            <View style={styles.iosModalView}>
              <DateTimePicker
                mode="date"
                display="inline"
                themeVariant="light"
                locale="pt-BR"
                value={tempDate}
                onChange={onChangeDate}
                style={styles.iosPicker}
                textColor="#000"
              />
              <View style={styles.iosModalButtons}>
                <TouchableOpacity
                  onPress={handleCancelIOS}
                  style={styles.iosButton}
                >
                  <Text style={styles.iosButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirmIOS}
                  style={[styles.iosButton, styles.iosButtonConfirm]}
                >
                  <Text
                    style={[
                      styles.iosButtonText,
                      { color: "#FFFFFF", fontWeight: "bold" },
                    ]}
                  >
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do cliente</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João da Silva"
              placeholderTextColor="#9CA3AF"
              value={nome}
              onChangeText={setNome}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Serviço contratado</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Marcenaria planejada"
              placeholderTextColor="#9CA3AF"
              value={servico}
              onChangeText={setServico}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de início</Text>
            <TouchableOpacity
              onPress={toggleDatePicker}
              style={styles.dateInputContainer}
            >
              <Text style={styles.dateInputText}>
                {formatDate(date) || "dd / mm / aaaa"}
              </Text>
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status inicial</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Aguardando visita técnica"
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={1}
              value={statusInicial}
              onChangeText={setStatusInicial}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  iosModalCenteredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  iosModalView: {
    backgroundColor: '#F9FAFB',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  iosPicker: {
    width: '100%',
    height: 200,
  },
  iosModalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
  iosButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  iosButtonConfirm: {
    backgroundColor: '#B84500',
  },
  iosButtonText: {
    color: '#1F2937',
    fontWeight: '600',
  },

  button: {
    backgroundColor: "#DB7105",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryButtonText: {
    color: "#4B5563",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollContainer: { padding: 20 },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 50,
  },
  dateInputText: { fontSize: 16, color: "#374151" },
  textArea: { height: 100, textAlignVertical: "top" },
});

export default NewClientScreen;
