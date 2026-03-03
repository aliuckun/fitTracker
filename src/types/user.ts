export interface UserGoals {
    id: string;
    // Fiziksel Veriler
    weight: number;            // Güncel kilo (kg)
    height: number;            // Boy (cm)
    startingWeight?: number;   // Başlangıç kilosu (Gelişimi görmek için)
    age?: number;              // Yaş (Kalori hesabı için gerekebilir)
    gender?: 'male' | 'female';

    // Hedefler
    targetWeight?: number;     // Hedeflenen kilo
    dailyCalorieGoal: number;  // Günlük alınması gereken hedef kalori
    weeklyWorkoutGoal: number; // Haftalık hedeflenen antrenman gün sayısı (örn: 4 gün)

    // İstatistikler ve Takip
    workoutStreak: number;     // Kaç gündür üst üste antrenman yapılıyor (Workout Serisi)
}