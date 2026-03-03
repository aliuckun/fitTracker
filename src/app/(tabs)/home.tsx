import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            {/* Üst Bilgi Bölümü */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Merhaba Ali 👋</Text>
                    <Text style={styles.subtitle}>Bugün sınırlarını zorlamaya hazır mısın?</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Ionicons name="notifications-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Günlük Özet Kartları */}
            <Text style={styles.sectionTitle}>Günlük Özet</Text>
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="flame" size={30} color="#1976D2" />
                    <Text style={styles.statValue}>450</Text>
                    <Text style={styles.statLabel}>kcal</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
                    <Ionicons name="walk" size={30} color="#7B1FA2" />
                    <Text style={styles.statValue}>8,420</Text>
                    <Text style={styles.statLabel}>Adım</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="time" size={30} color="#388E3C" />
                    <Text style={styles.statValue}>45</Text>
                    <Text style={styles.statLabel}>Dakika</Text>
                </View>
            </View>

            {/* Önerilen Antrenman */}
            <Text style={styles.sectionTitle}>Sana Özel Antrenman</Text>
            <TouchableOpacity style={styles.workoutCard}>
                <View style={styles.workoutInfo}>
                    <Text style={styles.workoutTitle}>Full Body HIIT</Text>
                    <Text style={styles.workoutDetails}>25 Dakika • Orta Seviye</Text>
                </View>
                <Ionicons name="play-circle" size={40} color="#4A90E2" />
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 25 },
    greeting: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
    subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
    profileButton: { padding: 10, borderRadius: 12, backgroundColor: '#f0f0f0' },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, marginTop: 10 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    statCard: { width: '30%', padding: 15, borderRadius: 20, alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
    statLabel: { fontSize: 12, color: '#666' },
    workoutCard: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee'
    },
    workoutInfo: { flex: 1 },
    workoutTitle: { fontSize: 17, fontWeight: 'bold' },
    workoutDetails: { color: '#888', marginTop: 4 }
});