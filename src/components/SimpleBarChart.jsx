import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleBarChart = ({ activeValue = 0, completedValue = 0 }) => {
  const totalValue = activeValue + completedValue;

  if (totalValue === 0) {
    return null; // Não mostra nada se não houver dados
  }

  // Usamos o flexbox para criar as proporções.
  // Se tiver 3 ativos e 1 concluído, a barra roxa terá flex: 3 e a verde flex: 1.
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {/* Barra de Ativos */}
        <View style={{ flex: activeValue, backgroundColor: '#4F46E5', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />
        
        {/* Barra de Concluídos */}
        <View style={{ flex: completedValue, backgroundColor: '#10B981', borderTopRightRadius: 8, borderBottomRightRadius: 8 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  bar: {
    flexDirection: 'row',
    height: 30, // Altura da barra
    borderRadius: 8,
    backgroundColor: '#E5E7EB', // Cor de fundo caso não haja dados
    overflow: 'hidden', // Garante que as bordas arredondadas funcionem
  },
});

export default SimpleBarChart;