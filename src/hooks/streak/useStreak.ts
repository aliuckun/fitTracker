import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserGoals, saveUserGoals } from '../../services/storageService';

export const useStreak = () => {
    const [streak, setStreak] = useState(0);

    const updateStreak = async () => {
        const goals = await getUserGoals();
        if (!goals) return;

        const today = new Date().toISOString().split('T')[0];
        const lastActiveDate = await AsyncStorage.getItem('@last_active_date');

        if (lastActiveDate === today) {
            // Zaten bugün aktif olmuş, bir şey yapmaya gerek yok.
            setStreak(goals.workoutStreak);
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = goals.workoutStreak;

        if (lastActiveDate === yesterdayStr) {
            // Dün aktifti, bugün de aktif (bu fonksiyon çağrıldığına göre)
            newStreak += 1;
        } else if (!lastActiveDate || lastActiveDate < yesterdayStr) {
            // Arada boşluk var, seri maalesef bozuldu.
            newStreak = 1; // Bugün başladığı için 1'den başlar.
        }

        // Verileri güncelle
        const updatedGoals = { ...goals, workoutStreak: newStreak };
        await saveUserGoals(updatedGoals);
        await AsyncStorage.setItem('@last_active_date', today);
        setStreak(newStreak);
    };

    useEffect(() => {
        updateStreak();
    }, []);

    return { streak, refreshStreak: updateStreak };
};