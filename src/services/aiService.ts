const GEMINI_API_KEY = 'api-key';
// Curl komutunda çalışan 'gemini-flash-latest' model ismini kullanıyoruz
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API Hata Detayı:', JSON.stringify(data));
            return "Koç şu an verileri analiz edemiyor.";
        }

        // Gemini API v1beta yanıt yapısı
        const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return feedback?.trim() || "Harika formdasın, aynen devam!";

    } catch (error) {
        console.error('Bağlantı Hatası:', error);
        return "Bağlantı hatası oluştu. Lütfen internetini kontrol et.";
    }
};
