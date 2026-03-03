// src/app/index.tsx olarak kaydedin
import { Redirect } from 'expo-router';

export default function Index() {
    // Expo Router'da gruplara yönlendirme yaparken direkt yol verilir
    return <Redirect href="/(tabs)/home" />;
}