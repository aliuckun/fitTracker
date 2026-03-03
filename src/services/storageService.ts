import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '../types/calories';
import { Exercise, WorkoutSession } from '../types/workout';
import { UserGoals } from '../types/user';

// --- KULLANICI (USER) İŞLEMLERİ ---
export const saveUserGoals = async (goals: UserGoals) => {
    try {
        await AsyncStorage.setItem('@user_goals', JSON.stringify(goals));
    } catch (e) { console.error("User goals kaydedilemedi", e); }
};

export const getUserGoals = async (): Promise<UserGoals | null> => {
    const json = await AsyncStorage.getItem('@user_goals');
    return json ? JSON.parse(json) : null;
};

// --- KALORİ (MEALS) İŞLEMLERİ ---
export const saveDailyMeals = async (date: string, meals: FoodItem[]) => {
    try {
        await AsyncStorage.setItem(`@meals_${date}`, JSON.stringify(meals));
    } catch (e) { console.error("Öğünler kaydedilemedi", e); }
};

export const getDailyMeals = async (date: string): Promise<FoodItem[]> => {
    const json = await AsyncStorage.getItem(`@meals_${date}`);
    return json ? JSON.parse(json) : [];
};

// YEMEK SİLME: Belirli bir tarihteki yemeği ID ile siler
export const deleteMeal = async (date: string, mealId: string) => {
    const meals = await getDailyMeals(date);
    const updatedMeals = meals.filter(m => m.id !== mealId);
    await saveDailyMeals(date, updatedMeals);
};

// --- ANTRENMAN (WORKOUT) İŞLEMLERİ ---
// Belirli bir tarihteki antrenman listesini kaydeder
export const saveDailyWorkouts = async (date: string, workouts: WorkoutSession[]) => {
    try {
        await AsyncStorage.setItem(`@workouts_${date}`, JSON.stringify(workouts));
    } catch (e) { console.error("Antrenmanlar kaydedilemedi", e); }
};

export const getDailyWorkouts = async (date: string): Promise<WorkoutSession[]> => {
    const json = await AsyncStorage.getItem(`@workouts_${date}`);
    return json ? JSON.parse(json) : [];
};

// ANTRENMAN SİLME: Belirli bir tarihteki antrenmanı ID ile siler
export const deleteWorkout = async (date: string, workoutId: string) => {
    const workouts = await getDailyWorkouts(date);
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    await saveDailyWorkouts(date, updatedWorkouts);
};

// --- GENEL SİLME (OPSİYONEL) ---
// Tüm verileri temizlemek istersen (Ayarlar sayfası için)
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) { console.error("Veriler temizlenemedi", e); }
};