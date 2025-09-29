import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TimelineItem = ({ item, isLast }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
            <MaterialCommunityIcons 
                name={item.icon || "circle-medium"} 
                size={20} 
                color="#FFFFFF" 
            />
        </View>
        {!isLast && <View style={styles.verticalLine} />}
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.itemDate}>{item.date}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
    </View>
  );
};

const Timeline = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <TimelineItem item={item} isLast={index === data.length - 1} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: { flexDirection: 'row', paddingBottom: 20 },
  iconContainer: { alignItems: 'center', marginRight: 15 },
  iconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 1, 
  },
  verticalLine: {
    position: 'absolute', top: 16,
    width: 2, height: '100%',
    backgroundColor: '#E5E7EB',
  },
  detailsContainer: { flex: 1, paddingTop: 6 },
  itemDate: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  itemDescription: { color: '#4B5563', fontSize: 14 },
});

export default Timeline;