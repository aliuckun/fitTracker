import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserGoals } from '../../types/user';
import { saveUserGoals, getUserGoals } from '../../services/storageService';

// 1. ADIM: Props yapısını güncelliyoruz, onPress ekledik.
const EditableRow = ({ label, value, field, icon, unit, isEditing, onValueChange, onStartEdit }: any) => (
    <View style={styles.infoRow}>
        <View style={styles.labelGroup}>
            <Ionicons name={icon} size={20} color="#666" />
            <Text style={styles.label}>{label}</Text>
        </View>
        {isEditing ? (
            <TextInput
                style={styles.input}
                value={value?.toString()}
                keyboardType="numeric"
                onChangeText={(text) => onValueChange(field, text)}
                autoFocus={true} // Tıklanan kutucuğun anında odağa girmesi için
            />
        ) : (
            // 2. ADIM: Basıldığında düzenleme modunu açan fonksiyonu çağırıyoruz
            <TouchableOpacity onPress={onStartEdit} style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.value}>
                    {value} <Text style={styles.unit}>{unit}</Text>
                </Text>
            </TouchableOpacity>
        )}
    </View>
);

export default function HomeScreen() {
    const [isEditing, setIsEditing] = useState(false);
    const [goals, setGoals] = useState<UserGoals>({
        id: 'main_user',
        weight: 80,
        height: 180,
        startingWeight: 85,
        dailyCalorieGoal: 2200,
        weeklyWorkoutGoal: 4,
        workoutStreak: 0,
        gender: 'male'
    });

    useEffect(() => {
        const loadData = async () => {
            const savedGoals = await getUserGoals();
            if (savedGoals) setGoals(savedGoals);
        };
        loadData();
    }, []);

    const handleValueChange = (field: string, text: string) => {
        // Sadece sayı girilmesine izin veriyoruz
        const numericValue = text === '' ? 0 : parseFloat(text.replace(/[^0-9.]/g, ''));
        setGoals(prev => ({ ...prev, [field]: numericValue }));
    };

    const handleSave = async () => {
        await saveUserGoals(goals);
        setIsEditing(false);
        alert('Veriler başarıyla kaydedildi!');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcome}>Hoş Geldin Ali 👋</Text>
                        <Text style={styles.subtext}>Hedeflerine ulaşmak için harika bir gün!</Text>
                    </View>
                    <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editToggle}>
                        <Ionicons name={isEditing ? "close-circle" : "create-outline"} size={28} color={isEditing ? "#ff4757" : "#4A90E2"} />
                    </TouchableOpacity>
                </View>

                {/* Özet Kartları */}
                <View style={styles.streakCard}>
                    <Ionicons name="flame" size={40} color="#FF9500" />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.streakTitle}>{goals.workoutStreak} Günlük Seri!</Text>
                        <Text style={styles.streakSub}>Antrenmanlarını aksatmadan devam et.</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fiziksel Veriler</Text>
                    <View style={styles.card}>
                        <EditableRow
                            label="Güncel Kilo"
                            value={goals.weight}
                            field="weight"
                            icon="speedometer-outline"
                            unit="kg"
                            isEditing={isEditing}
                            onValueChange={handleValueChange}
                            onStartEdit={() => setIsEditing(true)} // Tıklanınca modu açar
                        />
                        <EditableRow
                            label="Boy"
                            value={goals.height}
                            field="height"
                            icon="resize-outline"
                            unit="cm"
                            isEditing={isEditing}
                            onValueChange={handleValueChange}
                            onStartEdit={() => setIsEditing(true)}
                        />
                        <EditableRow
                            label="Başlangıç Kilosu"
                            value={goals.startingWeight}
                            field="startingWeight"
                            icon="flag-outline"
                            unit="kg"
                            isEditing={isEditing}
                            onValueChange={handleValueChange}
                            onStartEdit={() => setIsEditing(true)}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hedefler</Text>
                    <View style={styles.card}>
                        <EditableRow
                            label="Günlük Kalori"
                            value={goals.dailyCalorieGoal}
                            field="dailyCalorieGoal"
                            icon="nutrition-outline"
                            unit="kcal"
                            isEditing={isEditing}
                            onValueChange={handleValueChange}
                            onStartEdit={() => setIsEditing(true)}
                        />
                        <EditableRow
                            label="Haftalık Antrenman"
                            value={goals.weeklyWorkoutGoal}
                            field="weeklyWorkoutGoal"
                            icon="calendar-outline"
                            unit="gün"
                            isEditing={isEditing}
                            onValueChange={handleValueChange}
                            onStartEdit={() => setIsEditing(true)}
                        />
                    </View>
                </View>

                {isEditing && (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Ionicons name="checkmark-done" size={24} color="#fff" />
                        <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Stillerin geri kalanı aynı...

// Stiller aynı kalacak...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, marginBottom: 30 },
    welcome: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
    subtext: { color: '#666', marginTop: 5 },
    editToggle: { padding: 5 },

    streakCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    streakTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
    streakSub: { color: '#888', fontSize: 13 },

    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginLeft: 5, color: '#333' },
    card: { backgroundColor: '#fff', borderRadius: 20, padding: 15, elevation: 2 },

    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    labelGroup: { flexDirection: 'row', alignItems: 'center' },
    label: { fontSize: 15, color: '#444', marginLeft: 10 },
    value: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
    unit: { fontSize: 12, fontWeight: 'normal', color: '#888' },

    input: { backgroundColor: '#f0f7ff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, fontSize: 16, fontWeight: 'bold', color: '#4A90E2', minWidth: 80, textAlign: 'right' },

    saveButton: { backgroundColor: '#4A90E2', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 15, marginTop: 10, elevation: 4 },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});