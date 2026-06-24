import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export async function salvarVendaOffline(vendaOffline: any) {
    const vendasPendentes =
        JSON.parse(
            await AsyncStorage.getItem('vendasPendentes') || '[]'
        );

    vendasPendentes.push(vendaOffline);

    await AsyncStorage.setItem(
        'vendasPendentes',
        JSON.stringify(vendasPendentes)
    );
}