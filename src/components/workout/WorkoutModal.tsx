import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise, WorkoutSession } from '../../types/workout';

interface WorkoutModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (title: string, exercises: Exercise[], id?: string) => void;
    editItem?: WorkoutSession | null;
}

export const WorkoutModal = ({ visible, onClose, onSave, editItem }: WorkoutModalProps) => {
    const [title, setTitle] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        if (editItem) {
            setTitle(editItem.title);
            setExercises(editItem.exercises);
        } else {
            setTitle('');
            setExercises([]);
        }
    }, [editItem, visible]);

    const addExerciseField = () => {
        const newExercise: Exercise = {
            id: Math.random().toString(36).substring(7),
            name: '',
            targetRegion: '',
            sets: 0,
            reps: 0,
            weight: 0
        };
        setExercises([...exercises, newExercise]);
    };

    const updateExercise = (id: string, field: keyof Exercise, value: any) => {
        setExercises(prev => prev.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
    };

    const removeExerciseField = (id: string) => {
        setExercises(prev => prev.filter(ex => ex.id !== id));
    };

    const handleSave = () => {
        if (title.trim()) {
            onSave(title, exercises, editItem?.id);
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{editItem ? 'Programı Düzenle' : 'Yeni Program'}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                        <Text style={styles.inputLabel}>PROGRAM ADI</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Örn: Göğüs & Ön Kol"
                            placeholderTextColor="#999"
                            style={styles.mainInput}
                        />

                        <View style={styles.exerciseHeader}>
                            <Text style={styles.inputLabel}>HAREKETLER</Text>
                            <TouchableOpacity onPress={addExerciseField} style={styles.addExerciseBtn}>
                                <Ionicons name="add-circle" size={20} color="#2196F3" />
                                <Text style={styles.addBtnText}>Yeni Hareket</Text>
                            </TouchableOpacity>
                        </View>

                        {exercises.map((ex, index) => (
                            <View key={ex.id} style={styles.exerciseCard}>
                                <View style={styles.row}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={styles.miniLabel}>HAREKET ADI</Text>
                                        <TextInput
                                            value={ex.name}
                                            onChangeText={(val) => updateExercise(ex.id, 'name', val)}
                                            style={styles.fieldInput}
                                            placeholder="Bench Press"
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Text style={styles.miniLabel}>BÖLGE</Text>
                                        <TextInput
                                            value={ex.targetRegion}
                                            onChangeText={(val) => updateExercise(ex.id, 'targetRegion', val)}
                                            style={styles.fieldInput}
                                            placeholder="Göğüs"
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => removeExerciseField(ex.id)} style={styles.deleteBtn}>
                                        <Ionicons name="trash-outline" size={20} color="#FF4757" />
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.row, { marginTop: 15 }]}>
                                    <View style={styles.quadInput}>
                                        <Text style={styles.miniLabel}>SET</Text>
                                        <TextInput
                                            keyboardType="numeric"
                                            defaultValue={ex.sets.toString()}
                                            onChangeText={(val) => updateExercise(ex.id, 'sets', parseInt(val) || 0)}
                                            style={styles.fieldInputCenter}
                                        />
                                    </View>
                                    <View style={styles.quadInput}>
                                        <Text style={styles.miniLabel}>TEKRAR</Text>
                                        <TextInput
                                            keyboardType="numeric"
                                            defaultValue={ex.reps.toString()}
                                            onChangeText={(val) => updateExercise(ex.id, 'reps', parseInt(val) || 0)}
                                            style={styles.fieldInputCenter}
                                        />
                                    </View>
                                    <View style={styles.quadInput}>
                                        <Text style={styles.miniLabel}>KİLO (KG)</Text>
                                        <TextInput
                                            keyboardType="numeric"
                                            defaultValue={ex.weight.toString()}
                                            onChangeText={(val) => updateExercise(ex.id, 'weight', parseInt(val) || 0)}
                                            style={styles.fieldInputCenter}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveText}>Değişiklikleri Kaydet</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 25, alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
    form: { flex: 1 },
    inputLabel: { fontSize: 12, fontWeight: '800', color: '#1A1A1A', marginBottom: 8, letterSpacing: 1 },
    miniLabel: { fontSize: 10, fontWeight: '700', color: '#444', marginBottom: 5 },
    mainInput: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 25, borderWidth: 1, borderColor: '#E2E8F0', color: '#1A1A1A', fontWeight: '500' },
    exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    addExerciseBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    addBtnText: { color: '#2196F3', fontWeight: '700', fontSize: 12, marginLeft: 4 },
    exerciseCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
    row: { flexDirection: 'row', alignItems: 'flex-end' },
    fieldInput: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', color: '#1A1A1A' },
    fieldInputCenter: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', color: '#1A1A1A', textAlign: 'center' },
    quadInput: { flex: 1, marginRight: 10 },
    deleteBtn: { marginBottom: 10, marginLeft: 5 },
    saveButton: { backgroundColor: '#2196F3', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 10, elevation: 4 },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});