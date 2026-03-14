import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { useSummary } from '../../hooks/summary/useSummary';
import { getAIFeedback } from '../../services/aiService';

const screenWidth = Dimensions.get('window').width;

export default function SummaryScreen() {
    const { stats, chartData } = useSummary();
    const [aiComment, setAiComment] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // ScrollView padding: 20x2=40, chartSection padding: 20x2=40, güvenlik payı: 20
    const chartWidth = screenWidth - 100;
    const dynamicSpacing = chartData.length > 1
        ? (chartWidth - 40) / (chartData.length - 1) // 40 = initialSpacing(20) + endSpacing(20)
        : 40;

    const handleGetAIFeedback = async () => {
        if (!stats) return;
        setIsAiLoading(true);
        try {
            const feedback = await getAIFeedback(stats);
            setAiComment(feedback);
        } catch (error) {
            setAiComment("Yorum alınırken bir hata oluştu.");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (!stats) return <ActivityIndicator style={{ flex: 1 }} color="#4A90E2" />;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.header}>Haftalık Özet</Text>

            {/* 1. Antrenman Takvimi */}
            <View style={styles.activityGrid}>
                {stats.activityStatus.map((day: any, index: number) => (
                    <View key={index} style={styles.dayBoxContainer}>
                        <Text style={styles.dayText}>{day.dayName}</Text>
                        <View style={[styles.dayBox, { backgroundColor: day.hasWorkout ? '#e6fffa' : '#fff5f5' }]}>
                            <Ionicons
                                name={day.hasWorkout ? "checkmark-circle" : "close-circle"}
                                size={24}
                                color={day.hasWorkout ? "#38a169" : "#e53e3e"}
                            />
                        </View>
                    </View>
                ))}
            </View>

            {/* 2. İstatistik Panelleri */}
            <View style={styles.statsRow}>
                <View style={styles.statPanel}>
                    <Text style={styles.statVal}>{stats.totalWorkoutDays}</Text>
                    <Text style={styles.statLabel}>Toplam Gün</Text>
                </View>
                <View style={styles.statPanel}>
                    <Text style={styles.statVal}>{stats.avgWorkoutPerWeek}</Text>
                    <Text style={styles.statLabel}>Haftalık Ort.</Text>
                </View>
                <View style={styles.statPanel}>
                    <Text style={styles.statVal}>{stats.avgDailyCalories}</Text>
                    <Text style={styles.statLabel}>Günlük Kal.</Text>
                </View>
            </View>

            {/* 3. AI Koçluk Paneli (Butonlu Yapı) */}
            <View style={styles.aiCard}>
                <View style={styles.aiHeader}>
                    <Ionicons name="sparkles" size={20} color="#4A90E2" />
                    <Text style={styles.aiTitle}>AI Koç Analizi</Text>
                </View>

                {aiComment ? (
                    <Text style={styles.aiText}>{aiComment}</Text>
                ) : (
                    <TouchableOpacity
                        style={styles.aiButton}
                        onPress={handleGetAIFeedback}
                        disabled={isAiLoading}
                    >
                        {isAiLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Ionicons name="analytics" size={18} color="#fff" />
                                <Text style={styles.aiButtonText}>Verileri Analiz Et</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* 4. Grafik Bölümü */}
            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Son 14 Gün Kalori Takibi</Text>

                {chartData && chartData.length > 0 ? (
                    <View style={styles.chartWrapper}>
                        <LineChart
                            data={chartData}
                            width={chartWidth}
                            height={200}
                            spacing={dynamicSpacing}
                            initialSpacing={20}
                            endSpacing={20}
                            color="#4A90E2"
                            thickness={3}
                            hideDataPoints={false}
                            dataPointsColor="#4A90E2"
                            curved
                            areaChart
                            isAnimated
                            animationDuration={1200}
                            startFillColor="#4A90E2"
                            endFillColor="#fff"
                            startOpacity={0.3}
                            endOpacity={0.05}
                            yAxisTextStyle={{ color: '#999', fontSize: 10 }}
                            xAxisLabelTextStyle={{ color: '#999', fontSize: 10 }}
                            noOfSections={4}
                            yAxisLabelSuffix=" kcal"
                            showReferenceLine1
                            referenceLine1Position={stats.dailyGoal}
                            referenceLine1Config={{
                                color: '#ff4757',
                                thickness: 2,
                                dashWidth: 5,
                                dashGap: 3,
                            }}
                        />
                        <View style={styles.goalLabelContainer}>
                            <View style={[styles.dot, { backgroundColor: '#ff4757' }]} />
                            <Text style={styles.goalText}>Günlük Hedef: {stats.dailyGoal} kcal</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.chartPlaceholder}>
                        <Ionicons name="stats-chart-outline" size={40} color="#ccc" />
                        <Text style={{ color: '#888', marginTop: 10 }}>Henüz yeterli veri bulunamadı.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    header: { fontSize: 26, fontWeight: 'bold', marginTop: 40, marginBottom: 20, color: '#1a1a1a' },

    activityGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    dayBoxContainer: { alignItems: 'center' },
    dayText: { fontSize: 12, color: '#666', marginBottom: 5 },
    dayBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    statPanel: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 15, alignItems: 'center', marginHorizontal: 5, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
    statVal: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
    statLabel: { fontSize: 10, color: '#888', marginTop: 4, textAlign: 'center' },

    aiCard: { backgroundColor: '#EEF6FF', padding: 20, borderRadius: 20, marginBottom: 25, borderLeftWidth: 5, borderLeftColor: '#4A90E2', elevation: 2 },
    aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    aiTitle: { marginLeft: 8, fontWeight: 'bold', color: '#4A90E2', fontSize: 16 },
    aiText: { color: '#444', lineHeight: 22, fontSize: 14 },
    aiButton: { backgroundColor: '#4A90E2', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 12, marginTop: 5 },
    aiButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },

    chartSection: { backgroundColor: '#fff', padding: 20, borderRadius: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    chartWrapper: { alignItems: 'center', overflow: 'hidden' },
    chartPlaceholder: { height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10 },
    goalLabelContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    goalText: { fontSize: 12, color: '#ff4757', fontWeight: 'bold' }
});