import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Exercise } from '../../types/workout';

export const ExerciseItem = ({ exercise }: { exercise: Exercise }) => {
    return (
        <View style={styles.exerciseContainer}>
            <View style={styles.leftInfo}>
                <Text style={styles.exName}>{exercise.name}</Text>
                <Text style={styles.exTarget}>{exercise.targetRegion || 'Genel'}</Text>
            </View>
            <View style={styles.rightStats}>
                <Text style={styles.statText}>
                    {exercise.sets} <Text style={styles.statLabel}>Set</Text>
                </Text>
                <Text style={styles.statText}>
                    {exercise.reps} <Text style={styles.statLabel}>Tekrar</Text>
                </Text>
                {exercise.weight > 0 && (
                    <Text style={styles.statText}>
                        {exercise.weight} <Text style={styles.statLabel}>kg</Text>
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    exerciseContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    leftInfo: { flex: 1 },
    exName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
    exTarget: { fontSize: 12, color: '#757575', marginTop: 2 },
    rightStats: { flexDirection: 'row', alignItems: 'center' },
    statText: { fontSize: 14, fontWeight: '700', color: '#2196F3', marginLeft: 12 },
    statLabel: { fontSize: 10, color: '#757575', fontWeight: '400' }
});