import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem } from '../../types/calories';

interface MealModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (meal: Omit<FoodItem, 'id'>, id?: string) => void;
    editItem?: FoodItem | null;
}

export const MealModal = ({ visible, onClose, onSave, editItem }: MealModalProps) => {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [repast, setRepast] = useState('Sabah');

    useEffect(() => {
        if (editItem) {
            setName(editItem.name);
            setCalories(editItem.calories.toString());
            setRepast(editItem.repast);
        } else {
            setName('');
            setCalories('');
            setRepast('Sabah');
        }
    }, [editItem, visible]);

    const handleSave = () => {
        if (name && calories) {
            onSave({ name, calories: parseInt(calories), repast }, editItem?.id);
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{editItem ? 'Öğünü Düzenle' : 'Yemek Ekle'}</Text>
                        <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} /></TouchableOpacity>
                    </View>

                    <TextInput placeholder="Yemek Adı" value={name} onChangeText={setName} style={styles.input} />
                    <TextInput placeholder="Kalori (kcal)" value={calories} onChangeText={setCalories} keyboardType="numeric" style={styles.input} />

                    <View style={styles.repastContainer}>
                        {['Sabah', 'Öğle', 'Akşam'].map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setRepast(item)}
                                style={[styles.repastBadge, repast === item && styles.activeBadge]}
                            >
                                <Text style={repast === item && { color: '#fff' }}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveText}>Kaydet</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    content: { backgroundColor: '#fff', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold' },
    input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 12, marginBottom: 15 },
    repastContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    repastBadge: { padding: 10, borderRadius: 10, backgroundColor: '#eee', width: '30%', alignItems: 'center' },
    activeBadge: { backgroundColor: '#ff4757' },
    saveButton: { backgroundColor: '#ff4757', padding: 18, borderRadius: 15, alignItems: 'center' },
    saveText: { color: '#fff', fontWeight: 'bold' }
});