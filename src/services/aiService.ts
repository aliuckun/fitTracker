// Yeni API anahtarın
const GEMINI_API_KEY = 'AIzaSyB6habIl_cGi7c3aHtkmOtuRZ6rYcWwMvc';
// URL'den key kısmını kaldırdık, Header ile göndereceğiz
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

export const getAIFeedback = async (stats: any): Promise<string> => {
    try {
        const prompt = `Sen bir fitness koçusun. Kullanıcının haftalık verilerini analiz et ve Türkçe, kısa ve motive edici bir yorum yap (2-3 cümle).

Veriler:
- Haftada ${stats.totalWorkoutDays} gün spor yaptı
- Günlük ortalama kalori: ${stats.avgDailyCalories} kcal
- Günlük kalori hedefi: ${stats.dailyGoal} kcal
- Hedefe göre fark: ${(Number(stats.avgDailyCalories) - stats.dailyGoal).toFixed(0)} kcal`;

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Yeni Header yapısı burada:
                'X-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API Hatası:', data);
            return "Koç şu an verileri analiz edemiyor.";
        }

        const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return feedback?.trim() || "Harika formdasın, aynen devam!";

    } catch (error) {
        console.error('Bağlantı Hatası:', error);
        return "Bağlantı hatası oluştu.";
    }
};