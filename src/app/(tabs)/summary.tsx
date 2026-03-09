import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { useSummary } from '../../hooks/summary/useSummary';
import { getAIFeedback } from '../../services/aiService';

const screenWidth = Dimensions.get('window').width;

export default function SummaryScreen() {
    const { stats, chartData } = useSummary();
    const [aiComment, setAiComment] = useState('Analiz ediliyor...');

    useEffect(() => {
        if (stats) {
            getAIFeedback(stats).then(setAiComment);
        }
    }, [stats]);

    if (!stats) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.header}>Haftalık Özet</Text>

            {/* 1. Antrenman Takvimi (7 Gün) */}
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

            {/* 3. AI Koçluk Paneli */}
            <View style={styles.aiCard}>
                <View style={styles.aiHeader}>
                    <Ionicons name="sparkles" size={20} color="#4A90E2" />
                    <Text style={styles.aiTitle}>AI Koç Yorumu</Text>
                </View>
                <Text style={styles.aiText}>{aiComment}</Text>
            </View>

            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Son 14 Gün Kalori Takibi</Text>

                {chartData && chartData.length > 0 ? (
                    <View style={styles.chartWrapper}>
                        <LineChart
                            data={chartData}
                            width={screenWidth - 80}
                            height={200}
                            spacing={25}
                            initialSpacing={10}
                            color="#4A90E2"
                            thickness={3}
                            hideDataPoints={false}
                            dataPointsColor="#4A90E2"
                            curved
                            areaChart
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
    header: { fontSize: 26, fontWeight: 'bold', marginTop: 40, marginBottom: 20 },

    activityGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    dayBoxContainer: { alignItems: 'center' },
    dayText: { fontSize: 12, color: '#666', marginBottom: 5 },
    dayBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    statPanel: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 15, alignItems: 'center', marginHorizontal: 5, elevation: 2 },
    statVal: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
    statLabel: { fontSize: 10, color: '#888', marginTop: 4, textAlign: 'center' },

    aiCard: { backgroundColor: '#EEF6FF', padding: 20, borderRadius: 20, marginBottom: 25, borderLeftWidth: 5, borderLeftColor: '#4A90E2' },
    aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    aiTitle: { marginLeft: 8, fontWeight: 'bold', color: '#4A90E2' },
    aiText: { color: '#444', lineHeight: 20 },

    chartSection: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 2 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    chartWrapper: { alignItems: 'center' },
    chartPlaceholder: { height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10 },
    goalLabelContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
    goalLine: { width: '100%', height: 2, backgroundColor: '#ff4757', borderStyle: 'dashed', marginTop: 10 },
    goalText: { fontSize: 10, color: '#ff4757', marginTop: 5 }
});