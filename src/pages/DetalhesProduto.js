import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation, useRoute } from '@react-navigation/native';

const DetalhesProduto = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // No Expo, pegamos o ID vindo dos parâmetros da rota
  const { id } = route.params; 
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduto = async () => {
      const { data, error } = await supabase
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7ed957" />
        <Text style={{ color: 'white', marginTop: 10 }}>Carregando detalhes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{produto?.nome}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{produto?.descricao || 'Sem descrição'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Preço:</Text>
          <Text style={[styles.value, {color: '#28a745', fontWeight: 'bold'}]}>
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

        <TouchableOpacity 
          style={styles.btnVoltar} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#4a3061', 
    justifyContent: 'center', 
    padding: 20 
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#4a3061',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: { 
    backgroundColor: 'white', 
    padding: 30, 
    borderRadius: 15, 
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titulo: { 
    color: '#4a3061', 
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
    borderBottomWidth: 2, 
    borderBottomColor: '#7ed957',
    paddingBottom: 10
  },
  infoRow: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    color: '#4a3061',
    fontSize: 14,
    marginBottom: 2
  },
  value: {
    fontSize: 16,
    color: '#333'
  },
  btnVoltar: { 
    width: '100%', 
    padding: 15, 
    marginTop: 20, 
    backgroundColor: '#4a3061', 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default DetalhesProduto;