import { useState, useEffect, useCallback } from 'react';
import { Exercise, WorkoutSession } from '../../types/workout';
import { saveDailyWorkouts, getDailyWorkouts } from '../../services/storageService';
import { useStreak } from '../streak/useStreak';

export const useWorkout = (selectedDate: string) => {
    const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
    const { refreshStreak } = useStreak();

    const loadWorkouts = useCallback(async () => {
        const data = await getDailyWorkouts(selectedDate);
        setWorkouts(data);
    }, [selectedDate]);

    useEffect(() => {
        loadWorkouts();
    }, [loadWorkouts]);

    const handleSaveWorkout = async (title: string, exercises: Exercise[], id?: string) => {
        let updatedWorkouts: WorkoutSession[];

        if (id) {
            updatedWorkouts = workouts.map(w =>
                w.id === id ? { ...w, title, exercises } : w
            );
        } else {
            const newWorkout: WorkoutSession = {
                id: Math.random().toString(36).substring(7),
                title,
                exercises,
                date: selectedDate,
            };
            updatedWorkouts = [...workouts, newWorkout];
            await refreshStreak(); // Kullanıcı işlem yaptığı için seriyi kontrol et/artır
        }

        setWorkouts(updatedWorkouts);
        await saveDailyWorkouts(selectedDate, updatedWorkouts);
    };

    const handleDeleteWorkout = async (id: string) => {
        const updated = workouts.filter(w => w.id !== id);
        setWorkouts(updated);
        await saveDailyWorkouts(selectedDate, updated);
    };

    return { workouts, handleSaveWorkout, handleDeleteWorkout };
};