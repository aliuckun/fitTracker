// Her bir yemek öğününü temsil eden tip
export interface FoodItem {
    id: string;
    name: string;          // Yemek adı (örn: Izgara Tavuk)
    calories: number;      // Kalori miktarı (kcal)
    repast: string;        // öğün zamanı (sabah - öğle - akşam)
}

// Günlük kalori kaydını temsil eden tip
export interface DailyCalorieRecord {
    id: string;
    date: string;          // Tarih (YYYY-MM-DD formatında tutmanı öneririm)
    meals: FoodItem[];     // O gün yenilen yemeklerin listesi
    totalCalories: number; // Günlük toplam kalori (Otomatik hesaplatacağız)
}