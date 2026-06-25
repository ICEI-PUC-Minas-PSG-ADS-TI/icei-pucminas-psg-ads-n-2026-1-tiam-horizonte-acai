import ProtectedRoute from '@/components/ProtectedRoute';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { pageGradientProps, paleta } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function DetalhesProduto() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduto = async () => {
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setProduto(data);
      setLoading(false);
    };
    fetchProduto();
  }, [id]);

  if (loading) {
    return (
      <LinearGradient {...pageGradientProps()}>
        <SafeAreaView style={styles.safe}>
          <ActivityIndicator size="large" color={paleta.VERDE} />
          <Text style={{ color: 'white', marginTop: 10 }}>Carregando detalhes...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <ProtectedRoute
      permitidos={[
        'ADMINISTRADOR',
        'ESTOQUISTA',
      ]}
    >
      <LinearGradient {...pageGradientProps()}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={paleta.BRANCO} />
            </TouchableOpacity>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.titulo}>{produto?.nome}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Descrição:</Text>
                <Text style={styles.value}>{produto?.descricao || 'Sem descrição'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Preço:</Text>
                <Text style={[styles.value, { color: paleta.VERDE, fontWeight: 'bold' }]}>
                  R$ {produto?.preco?.toFixed(2)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Quantidade:</Text>
                <Text style={styles.value}>{produto?.quantidade} UND</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Categoria:</Text>
                <Text style={styles.value}>{produto?.categoria || 'Não definida'}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 12,
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: paleta.VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: { flex: 1, justifyContent: 'center' },

  card: {
    backgroundColor: paleta.BRANCO,
    padding: 30,
    borderRadius: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: paleta.VERDE,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  titulo: {
    color: paleta.ROXO,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: paleta.VERDE,
    paddingBottom: 10,
  },

  infoRow: { marginBottom: 15 },
  label: { fontWeight: 'bold', color: paleta.ROXO, fontSize: 14, marginBottom: 2 },
  value: { fontSize: 16, color: '#333' },
});