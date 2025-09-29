import  { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, StatusBar, Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewClientScreen = () => {
  const router = useRouter(); 


  const [date, setDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const toggleDatePicker = () => setShowPicker(true);
  const onChangeDate = ({ type }, selectedDate) => {
    if (type === 'set') {
      setDate(selectedDate);
      if (Platform.OS === 'android') setShowPicker(false);
    } else {
      setShowPicker(false);
    }
  };
  const formatDate = (rawDate) => {
    if (!rawDate) return null;
    let d = new Date(rawDate);
    let day = d.getDate().toString().padStart(2, '0');
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let year = d.getFullYear();
    return `${day} / ${month} / ${year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Novo Cliente', /* ... */ }} />
      <StatusBar barStyle="dark-content" />
      {showPicker && ( <DateTimePicker mode="date" display="spinner" value={date || new Date()} onChange={onChangeDate} /> )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do cliente</Text>
            <TextInput style={styles.input} placeholder="Ex: João da Silva" placeholderTextColor="#9CA3AF" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Serviço contratado</Text>
            <TextInput style={styles.input} placeholder="Ex: Marcenaria planejada" placeholderTextColor="#9CA3AF" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de início</Text>
            <TouchableOpacity onPress={toggleDatePicker} style={styles.dateInputContainer}>
              <Text style={styles.dateInputText}>{formatDate(date) || 'dd / mm / aaaa'}</Text>
              <MaterialCommunityIcons name="calendar" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status inicial</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Ex: Aguardando visita técnica" placeholderTextColor="#9CA3AF" multiline={true} numberOfLines={4} />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1, // Para ocupar espaço igual
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10, 
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6', 
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#4B5563', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContainer: { padding: 20 },
  formContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#1F2937' },
  dateInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, height: 50 },
  dateInputText: { fontSize: 16, color: '#374151' },
  textArea: { height: 100, textAlignVertical: 'top' },
});

export default NewClientScreen;