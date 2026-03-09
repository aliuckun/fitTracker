import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{editItem ? 'Düzenle' : 'Yeni Antrenman'}</Text>
                    <TouchableOpacity onPress={onClose}><Ionicons name="close" size={28} /></TouchableOpacity>
                </View>

                <ScrollView style={styles.form}>
                    <Text style={styles.label}>Program Adı</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Örn: İtme Günü"
                        style={styles.mainInput}
                    />

                    <View style={styles.exerciseHeader}>
                        <Text style={styles.label}>Hareketler</Text>
                        <TouchableOpacity onPress={addExerciseField} style={styles.addExerciseBtn}>
                            <Ionicons name="add-circle" size={20} color="#2196F3" />
                            <Text style={{ color: '#2196F3', marginLeft: 5 }}>Hareket Ekle</Text>
                        </TouchableOpacity>
                    </View>

                    {exercises.map((ex, index) => (
                        <View key={ex.id} style={styles.exerciseCard}>
                            <View style={styles.exerciseRow}>
                                <TextInput
                                    placeholder="Hareket Adı"
                                    value={ex.name}
                                    onChangeText={(val) => updateExercise(ex.id, 'name', val)}
                                    style={[styles.input, { flex: 2 }]}
                                />
                                <TextInput
                                    placeholder="Bölge"
                                    value={ex.targetRegion}
                                    onChangeText={(val) => updateExercise(ex.id, 'targetRegion', val)}
                                    style={[styles.input, { flex: 1, marginLeft: 10 }]}
                                />
                                <TouchableOpacity onPress={() => removeExerciseField(ex.id)}>
                                    <Ionicons name="trash" size={20} color="#ff4757" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.exerciseRow}>
                                <TextInput placeholder="Set" keyboardType="numeric" onChangeText={(val) => updateExercise(ex.id, 'sets', parseInt(val))} style={styles.miniInput} />
                                <TextInput placeholder="Tekrar" keyboardType="numeric" onChangeText={(val) => updateExercise(ex.id, 'reps', parseInt(val))} style={styles.miniInput} />
                                <TextInput placeholder="Kg" keyboardType="numeric" onChangeText={(val) => updateExercise(ex.id, 'weight', parseInt(val))} style={styles.miniInput} />
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveText}>Programı Kaydet</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 20 },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    form: { flex: 1 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
    mainInput: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 12, marginBottom: 20 },
    exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    addExerciseBtn: { flexDirection: 'row', alignItems: 'center' },
    exerciseCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
    exerciseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    miniInput: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginRight: 10, textAlign: 'center' },
    saveButton: { backgroundColor: '#2196F3', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});