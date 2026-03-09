import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getDailyMeals, getDailyWorkouts, getUserGoals } from '../../services/storageService';

export const useSummary = () => {
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    const calculateStats = useCallback(async () => {
        const goals = await getUserGoals();
        const calorieHistory = [];
        let totalCals = 0;
        let workoutDaysInLast7Days = 0;
        const activityStatus = [];

        // Son 14 günü tara
        for (let i = 0; i < 14; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);

            // Tarihi YYYY-MM-DD formatında yerel saate göre al (Hata payını sıfırlar)
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            const meals = await getDailyMeals(dateStr);
            const workouts = await getDailyWorkouts(dateStr);

            const dayTotal = meals.reduce((sum, m) => sum + m.calories, 0);

            // Grafik için veri formatı (Gifted Charts formatı)
            calorieHistory.push({
                value: dayTotal,
                label: i % 3 === 0 ? d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '', // Sadece bazı günleri etiketle ki grafik sıkışmasın
                date: dateStr
            });

            if (i < 7) {
                activityStatus.push({
                    dayName: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
                    hasWorkout: workouts.length > 0,
                });
                if (workouts.length > 0) workoutDaysInLast7Days++;
            }

            totalCals += dayTotal;
        }

        setStats({
            totalWorkoutDays: workoutDaysInLast7Days,
            avgWorkoutPerWeek: (workoutDaysInLast7Days).toFixed(1),
            avgDailyCalories: (totalCals / 7).toFixed(0),
            activityStatus: activityStatus.reverse(),
            dailyGoal: goals?.dailyCalorieGoal || 2000
        });

        // Grafiği eskiden yeniye sırala
        setChartData(calorieHistory.reverse());
    }, []);

    useFocusEffect(
        useCallback(() => {
            calculateStats();
        }, [calculateStats])
    );

    return { stats, chartData };
};