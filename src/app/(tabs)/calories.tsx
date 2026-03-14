import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MealModal } from '../../components/calories/MealModal';
import { FoodItem } from '../../types/calories';
import { saveDailyMeals, getDailyMeals, getUserGoals } from '../../services/storageService'; // getUserGoals eklendi

export default function CalorieScreen() {
    const [meals, setMeals] = useState<FoodItem[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
    const [dailyGoal, setDailyGoal] = useState<number>(2000); // Varsayılan hedef

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        // Hem öğünleri hem de kullanıcı hedefini yükle
        const [mealsData, userGoals] = await Promise.all([
            getDailyMeals(selectedDate),
            getUserGoals()
        ]);

        setMeals(mealsData);
        if (userGoals?.dailyCalorieGoal) {
            setDailyGoal(userGoals.dailyCalorieGoal);
        }
    };

    const handleSaveMeal = async (mealData: Omit<FoodItem, 'id'>, id?: string) => {
        let updatedMeals;
        if (id) {
            updatedMeals = meals.map(m => m.id === id ? { ...mealData, id } : m);
        } else {
            const newMeal = { ...mealData, id: Math.random().toString(36).substring(7) };
            updatedMeals = [...meals, newMeal];
        }
        setMeals(updatedMeals);
        await saveDailyMeals(selectedDate, updatedMeals);
    };

    const handleDelete = (id: string) => {
        Alert.alert("Öğünü Sil", "Bu yemeği silmek istediğine emin misin?", [
            { text: "Vazgeç" },
            {
                text: "Sil", onPress: async () => {
                    const updated = meals.filter(m => m.id !== id);
                    setMeals(updated);
                    await saveDailyMeals(selectedDate, updated);
                }, style: 'destructive'
            }
        ]);
    };

    const totalCalories = meals.reduce((sum, item) => sum + item.calories, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kalori Takibi</Text>
                <TouchableOpacity onPress={() => { setEditingItem(null); setModalVisible(true); }} style={styles.addButton}>
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
                {/* ÖZET KARTI - GÜNCELLENDİ */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>
                        {selectedDate === new Date().toISOString().split('T')[0] ? 'Bugün' : 'Seçili Gün'} Durumu
                    </Text>
                    <Text style={styles.summaryValue}>
                        {totalCalories}
                        <Text style={styles.goalValue}> / {dailyGoal} kcal</Text>
                    </Text>
                    {/* Opsiyonel: Kalan kalori bilgisi */}
                    <Text style={styles.remainingLabel}>
                        {dailyGoal - totalCalories > 0
                            ? `${dailyGoal - totalCalories} kcal daha alabilirsin`
                            : 'Hedefi aştın!'}
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>Öğünler</Text>

                {meals.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="fast-food-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Henüz bir yemek eklenmemiş.</Text>
                    </View>
                ) : (
                    meals.map((item) => (
                        <View key={item.id} style={styles.mealCard}>
                            <View style={styles.mealIcon}>
                                <Ionicons name="restaurant" size={20} color="#ff4757" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.mealName}>{item.name}</Text>
                                <Text style={styles.mealInfo}>{item.repast} • {item.calories} kcal</Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => { setEditingItem(item); setModalVisible(true); }}>
                                    <Ionicons name="pencil-outline" size={20} color="#4A90E2" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 15 }}>
                                    <Ionicons name="trash-outline" size={20} color="#ff4757" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <MealModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveMeal}
                editItem={editingItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
    addButton: { backgroundColor: '#ff4757', borderRadius: 12, padding: 6, elevation: 3 },

    daysContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    dayCard: { alignItems: 'center', paddingVertical: 12, borderRadius: 18, backgroundColor: '#f8f9fa', width: 46, borderWidth: 1, borderColor: '#eee' },
    selectedDayCard: { backgroundColor: '#ff4757', elevation: 4 },
    dayName: { fontSize: 11, color: '#888', textTransform: 'uppercase' },
    dayNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 4, color: '#333' },
    selectedText: { color: '#fff' },
    activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff', marginTop: 4 },

    summaryCard: { backgroundColor: '#1a1a1a', padding: 25, borderRadius: 24, alignItems: 'center', marginBottom: 25, elevation: 5 },
    summaryLabel: { color: '#aaa', fontSize: 14, fontWeight: '500' },
    summaryValue: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 8 },
    goalValue: { fontSize: 18, color: '#888', fontWeight: 'normal' },
    remainingLabel: { color: '#4CAF50', fontSize: 12, marginTop: 8, fontWeight: '600' },

    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1a1a1a' },
    mealCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0', elevation: 1 },
    mealIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#fff5f5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    mealName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    mealInfo: { color: '#777', fontSize: 13, marginTop: 2 },
    actions: { flexDirection: 'row', alignItems: 'center', paddingLeft: 10 },

    emptyContainer: { alignItems: 'center', marginTop: 40 },
    emptyText: { color: '#aaa', marginTop: 10, fontSize: 15 }
});