import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getDailyMeals, getDailyWorkouts, getUserGoals } from '../../services/storageService';

export const useSummary = () => {
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    const calculateStats = useCallback(async () => {
        try {
            const goals = await getUserGoals();
            let totalCals = 0;
            let workoutDays = 0;
            const activityStatus = [];
            const calorieHistory = [];
            const workoutSummary: string[] = [];
            const mealSummary: string[] = []; // AI için yemek listesi

            for (let i = 0; i < 14; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];

                const meals = await getDailyMeals(dateStr);
                const dailyWorkouts = await getDailyWorkouts(dateStr);

                const dayTotal = meals.reduce((sum, m) => sum + m.calories, 0);

                calorieHistory.push({
                    value: dayTotal,
                    label: i % 2 === 0 ? d.getDate().toString() : '',
                });

                if (i < 7) {
                    activityStatus.push({
                        dayName: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
                        hasWorkout: dailyWorkouts.length > 0,
                    });

                    // Yemek Detaylarını Topla
                    if (meals.length > 0) {
                        meals.forEach(m => {
                            // Örn: "Yumurta (Kahvaltı) - 150 kcal"
                            mealSummary.push(`${m.name} (${m.repast}) - ${m.calories} kcal`);
                        });
                    }

                    // Antrenman Detaylarını Topla
                    if (dailyWorkouts.length > 0) {
                        workoutDays++;
                        dailyWorkouts.forEach(workout => {
                            workout.exercises.forEach((ex: any) => {
                                const detail = `${ex.name} (${ex.targetRegion || 'Genel'}): ${ex.sets}x${ex.reps} @${ex.weight}kg`;
                                workoutSummary.push(detail);
                            });
                        });
                    }
                }
                totalCals += dayTotal;
            }

            setStats({
                height: goals?.height || 0,
                weight: goals?.weight || 0,
                totalWorkoutDays: workoutDays,
                avgDailyCalories: (totalCals / 14).toFixed(0),
                dailyGoal: goals?.dailyCalorieGoal || 2000,
                activityStatus: activityStatus.reverse(),
                workoutDetails: workoutSummary.join(' | '),
                mealDetails: mealSummary.join(' | '), // Yeni alan: Yemekler
            });

            setChartData(calorieHistory.reverse());
        } catch (error) {
            console.error("Hata:", error);
        }
    }, []);

    useFocusEffect(useCallback(() => { calculateStats(); }, [calculateStats]));

    return { stats, chartData, refresh: calculateStats };
};