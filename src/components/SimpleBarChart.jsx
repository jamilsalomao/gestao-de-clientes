import { View, Text, StyleSheet } from 'react-native';

const SimpleBarChart = ({ activeValue = 0, completedValue = 0 }) => {
  const totalValue = activeValue + completedValue;

  if (totalValue === 0) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={{ flex: activeValue, backgroundColor: '#4F46E5', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />
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
    height: 30, 
    borderRadius: 8,
    backgroundColor: '#E5E7EB', 
    overflow: 'hidden', 
  },
});

export default SimpleBarChart;