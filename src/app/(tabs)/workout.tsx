import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutModal } from '../../components/workout/WorkoutModal';
import { useWorkout } from '../../hooks/workout/useWorkout';

export default function WorkoutScreen() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Seçili tarihi ISO formatında (YYYY-MM-DD) tutuyoruz
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Hook'a seçili tarihi gönderiyoruz ki o tarihteki verileri getirsin
    const { workouts, handleSaveWorkout, handleDeleteWorkout } = useWorkout(selectedDate);

    // Son 7 günü hesaplayan fonksiyon
    const getLast7Days = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push({
                dayName: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
                dayNumber: d.getDate(),
                fullDate: d.toISOString().split('T')[0],
            });
        }
        return days.reverse();
    };

    const weekDays = getLast7Days();

    const confirmDelete = (id: string) => {
        Alert.alert("Antrenmanı Sil", "Bu antrenman programını silmek istediğine emin misin?", [
            { text: "Vazgeç" },
            { text: "Sil", onPress: () => handleDeleteWorkout(id), style: 'destructive' }
        ]);
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Antrenmanlar</Text>
                <TouchableOpacity
                    onPress={() => { setEditingItem(null); setModalVisible(true); }}
                    style={styles.addButton}
                >
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* SON 7 GÜN PANELİ */}
            <View style={styles.daysContainer}>
                {weekDays.map((item) => {
                    const isSelected = selectedDate === item.fullDate;
                    return (
                        <TouchableOpacity
                            key={item.fullDate}
                            onPress={() => setSelectedDate(item.fullDate)}
                            style={[styles.dayCard, isSelected && styles.selectedDayCard]}
                        >
                            <Text style={[styles.dayName, isSelected && styles.selectedText]}>{item.dayName}</Text>
                            <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>{item.dayNumber}</Text>
                            {isSelected && <View style={styles.activeDot} />}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* ÖZET KARTI */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>
                        {selectedDate === new Date().toISOString().split('T')[0] ? 'Bugün' : 'Seçili Gün'}
                    </Text>
                    <Text style={styles.summaryValue}>
                        {workouts.length} <Text style={{ fontSize: 18 }}>Antrenman</Text>
                    </Text>
                </View>

                {/* LİSTE BAŞLIĞI */}
                <Text style={styles.sectionTitle}>Günlük Program</Text>

                {workouts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="barbell-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Bu tarih için antrenman planlanmamış.</Text>
                    </View>
                ) : (
                    workouts.map((workout) => (
                        <View key={workout.id} style={styles.card}>
                            <View style={styles.workoutIcon}>
                                <Ionicons name="fitness" size={24} color="#2196F3" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{workout.title}</Text>
                                <Text style={styles.cardSubtitle}>{workout.exercises.length} Hareket Planlandı</Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => { setEditingItem(workout); setModalVisible(true); }}>
                                    <Ionicons name="pencil-outline" size={20} color="#4A90E2" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => confirmDelete(workout.id)} style={{ marginLeft: 15 }}>
                                    <Ionicons name="trash-outline" size={20} color="#ff4757" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <WorkoutModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveWorkout}
                editItem={editingItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
    addButton: { backgroundColor: '#2196F3', borderRadius: 12, padding: 6, elevation: 3 },

    // Gün Paneli Stilleri
    daysContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    dayCard: { alignItems: 'center', paddingVertical: 12, borderRadius: 18, backgroundColor: '#f8f9fa', width: 46, borderWidth: 1, borderColor: '#eee' },
    selectedDayCard: { backgroundColor: '#2196F3', elevation: 4, borderColor: '#2196F3' },
    dayName: { fontSize: 11, color: '#888', textTransform: 'uppercase' },
    dayNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 4, color: '#333' },
    selectedText: { color: '#fff' },
    activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff', marginTop: 4 },

    summaryCard: { backgroundColor: '#1a1a1a', padding: 25, borderRadius: 24, alignItems: 'center', marginBottom: 25, elevation: 5 },
    summaryLabel: { color: '#aaa', fontSize: 14, fontWeight: '500' },
    summaryValue: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 8 },

    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1a1a1a' },
    card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0', elevation: 1 },
    workoutIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    cardSubtitle: { color: '#777', fontSize: 13, marginTop: 2 },
    actions: { flexDirection: 'row', alignItems: 'center', paddingLeft: 10 },

    emptyContainer: { alignItems: 'center', marginTop: 40 },
    emptyText: { color: '#aaa', marginTop: 10, fontSize: 15 }
});