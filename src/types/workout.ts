// Antrenman içindeki her bir hareketi temsil eden tip
export interface Exercise {
    id: string;            // Her hareketin benzersiz bir kimliği olmalı
    name: string;          // Hareket adı (örn: Bench Press)
    targetRegion: string;  // Hedef bölge (örn: Göğüs, Arka Kol)
    sets: number;          // Set sayısı
    reps: number;          // Tekrar sayısı
    weight: number;       // Opsiyonel: Ağırlık (kg)

}

// Bir antrenman seansını (programını) temsil eden tip
export interface WorkoutSession {
    id: string;
    title: string;         // Antrenman başlığı (örn: Üst Vücut Günü)
    exercises: Exercise[]; // Bu antrenmana dahil olan hareketlerin listesi
    date: string;          // Antrenman tarihi
}