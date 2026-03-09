import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // İkon seti

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#ff4757' }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({ color }) => <Ionicons name="fitness" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="workout"
                options={{
                    title: 'Antrenman',
                    tabBarIcon: ({ color }) => <Ionicons name="barbell" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="calories"
                options={{
                    title: 'calori',
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="summary"
                options={{
                    title: 'ozet',
                    tabBarIcon: ({ color }) => <Ionicons name="document-text" size={28} color={color} />,
                }}
            />
        </Tabs>
    );
}