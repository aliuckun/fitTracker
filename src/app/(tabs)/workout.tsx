import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutModal } from '../../components/workout/WorkoutModal';
import { ExerciseItem } from '../../components/workout/ExerciseItem';
import { useWorkout } from '../../hooks/workout/useWorkout';

export default function WorkoutScreen() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const { workouts, handleSaveWorkout, handleDeleteWorkout } = useWorkout(selectedDate);

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
        Alert.alert("Antrenmanı Sil", "Bu programı silmek istediğine emin misin?", [
            { text: "Vazgeç" },
            { text: "Sil", onPress: () => handleDeleteWorkout(id), style: 'destructive' }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Antrenmanlar</Text>
                <TouchableOpacity
                    onPress={() => { setEditingItem(null); setModalVisible(true); }}
                    style={styles.addButton}
                >
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

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
                {/* ÖZET KARTI BURADAN SİLİNDİ */}

                <Text style={styles.sectionTitle}>Günlük Program</Text>

                {workouts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="barbell-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Bu tarih için antrenman planlanmamış.</Text>
                    </View>
                ) : (
                    workouts.map((workout) => (
                        <View key={workout.id} style={styles.card}>
                            <View style={styles.cardHeaderRow}>
                                <View style={styles.titleGroup}>
                                    <Text style={styles.cardTitle}>{workout.title}</Text>
                                    <Text style={styles.cardSubtitle}>{workout.exercises.length} Hareket</Text>
                                </View>
                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => { setEditingItem(workout); setModalVisible(true); }}>
                                        <Ionicons name="pencil-outline" size={22} color="#4A90E2" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => confirmDelete(workout.id)} style={{ marginLeft: 15 }}>
                                        <Ionicons name="trash-outline" size={22} color="#FF4757" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.exerciseList}>
                                {workout.exercises.map((ex: any) => (
                                    <ExerciseItem key={ex.id} exercise={ex} />
                                ))}
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

// Stiller aynı kalıyor...

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA', paddingHorizontal: 20 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        marginBottom: 20
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
    addButton: { backgroundColor: '#2196F3', borderRadius: 12, padding: 8, elevation: 5 },
    daysContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    dayCard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        width: 46,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 3
    },
    selectedDayCard: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
    dayName: { fontSize: 10, color: '#757575', textTransform: 'uppercase', fontWeight: '600' },
    dayNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 4, color: '#212121' },
    selectedText: { color: '#FFFFFF' },
    activeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFFFFF', marginTop: 4 },
    summaryCard: {
        backgroundColor: '#1A1A1A',
        padding: 25,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 25,
        elevation: 8
    },
    summaryLabel: { color: '#BDBDBD', fontSize: 14, fontWeight: '600' },
    summaryValue: { color: '#FFFFFF', fontSize: 34, fontWeight: 'bold', marginTop: 8 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1A1A1A' },

    // Kart Düzeltmeleri
    card: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15
    },
    titleGroup: { flex: 1 },
    cardTitle: { fontSize: 18, fontWeight: '700', color: '#212121' },
    cardSubtitle: { color: '#616161', fontSize: 14, fontWeight: '500', marginTop: 2 },
    actions: { flexDirection: 'row', alignItems: 'center' },
    exerciseList: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 10
    },
    emptyContainer: { alignItems: 'center', marginTop: 60, opacity: 0.6 },
    emptyText: { color: '#757575', marginTop: 12, fontSize: 16, fontWeight: '500' }
});