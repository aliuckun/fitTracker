import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WORKOUTS = [
    { id: '1', title: 'Sabah Kardiyosu', duration: '20 dk', kcal: '150', icon: 'bicycle' },
    { id: '2', title: 'Göğüs & Kol', duration: '45 dk', kcal: '320', icon: 'fitness' },
    { id: '3', title: 'Yoga Seansı', duration: '30 dk', kcal: '100', icon: 'body' },
];

export default function WorkoutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Antrenman Programım</Text>

            <FlatList
                data={WORKOUTS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Ionicons name={item.icon as any} size={24} color="#fff" />
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.details}>{item.duration} • {item.kcal} kcal</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#ff4757',
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: { flex: 1, marginLeft: 15 },
    title: { fontSize: 16, fontWeight: '600' },
    details: { fontSize: 13, color: '#888', marginTop: 4 },
});