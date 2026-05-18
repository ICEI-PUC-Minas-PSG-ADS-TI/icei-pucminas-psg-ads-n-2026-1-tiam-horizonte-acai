import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet, 
  Modal, 
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '../components/Sidebar'; // Nota: Você precisará converter o Sidebar também

const logoAcai = "https://cdn-icons-png.flaticon.com/512/5917/5917321.png";

const TelaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  
  const navigation = useNavigation();

  const [usuarioLogado] = useState({ nome: 'ADM', cargo: 'Gestor' });

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome', { ascending: true });
    
    if (data) setProdutos(data);
    if (error) console.log("Erro ao buscar:", error.message);
  }

  const handleExcluir = async () => {
    if (produtoParaExcluir) {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', produtoParaExcluir.id);

      if (!error) {
        setModalExcluirAberto(false);
        setProdutoParaExcluir(null);
        fetchProdutos();
      } else {
        Alert.alert("Erro", "Erro ao excluir: " + error.message);
      }
    }
  };

  const produtosFiltrados = produtos.filter(p => 
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Marca d'água (Fundo) */}
      <Image source={{ uri: logoAcai }} style={styles.marcaDagua} />

      <View style={styles.box}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: logoAcai }} style={styles.logoTopo} />
        </View>

        <View style={styles.header}>
          <Text style={styles.icon}>🏠</Text>
          <Text style={styles.logoText}>PROD<Text style={{color: '#7ed957'}}>UTOS</Text></Text>
          <TouchableOpacity onPress={() => setMenuAberto(true)}>
            <Text style={styles.icon}>☰</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Buscar Produto</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Digite o nome..." 
            placeholderTextColor="#666"
            value={busca} 
            onChangeText={(text) => setBusca(text)} 
          />
        </View>

        <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
          {produtosFiltrados.map(p => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.cardTitle}>{p.nome}</Text>
              
              <View style={styles.estoqueRow}>
                <Text style={styles.estoqueText}>Estoque: {p.quantidade} UND</Text>
                <View style={styles.statusGroup}>
                  <View style={[
                    styles.bolinha, 
                    { backgroundColor: Number(p.quantidade) <= 10 ? 'red' : '#7ed957' }
                  ]} />
                  <Text style={styles.statusText}>
                    {Number(p.quantidade) <= 10 ? 'Baixo' : 'OK'}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity 
                  style={styles.btnAction} 
                  onPress={() => navigation.navigate('EditarProduto', { id: p.id })}
                >
                  <Text style={styles.btnActionText}>Editar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.btnAction} 
                  onPress={() => navigation.navigate('DetalhesProduto', { id: p.id })}
                >
                  <Text style={styles.btnActionText}>Ver Mais</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.btnAction, { backgroundColor: 'red' }]} 
                  onPress={() => {
                    setProdutoParaExcluir(p);
                    setModalExcluirAberto(true);
                  }}
                >
                  <Text style={styles.btnActionText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.btnNovo} 
          onPress={() => navigation.navigate('NovoProduto')}
        >
          <Text style={styles.btnNovoText}>Novo Produto +</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL DE EXCLUIR */}
      <Modal
        visible={modalExcluirAberto}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Excluir Produto</Text>
              <Image source={{ uri: logoAcai }} style={{width: 30, height: 30}} />
            </View>
            <Text style={styles.modalBody}>
              Deseja realmente excluir o produto{"\n"}
              <Text style={{fontWeight: 'bold'}}>{produtoParaExcluir?.nome}</Text>?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnModalConfirm} onPress={handleExcluir}>
                <Text style={styles.btnActionText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnModalCancel} onPress={() => setModalExcluirAberto(false)}>
                <Text style={styles.btnActionText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nota: O componente Sidebar também precisará ser convertido para View/Text */}
      <Sidebar 
        isOpen={menuAberto} 
        onClose={() => setMenuAberto(false)} 
        user={usuarioLogado} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4a3061' },
  marcaDagua: { position: 'absolute', top: '25%', left: '10%', width: 300, height: 300, opacity: 0.1, transform: [{ rotate: '45deg' }] },
  box: { flex: 1, padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  logoTopo: { width: 60, height: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  logoText: { color: 'white', fontWeight: 'bold', fontSize: 22 },
  icon: { color: 'white', fontSize: 24 },
  inputGroup: { marginBottom: 20 },
  label: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  input: { padding: 12, borderRadius: 8, backgroundColor: '#d1d1d1', fontSize: 16, color: '#333' },
  lista: { flex: 1 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#7ed957', elevation: 3 },
  cardTitle: { color: '#4a3061', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  estoqueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  estoqueText: { color: '#4a3061', fontWeight: 'bold' },
  statusGroup: { flexDirection: 'row', alignItems: 'center' },
  bolinha: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#4a3061' },
  actions: { flexDirection: 'row', gap: 8 },
  btnAction: { flex: 1, paddingVertical: 8, backgroundColor: '#4a3061', borderRadius: 4, alignItems: 'center' },
  btnActionText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  btnNovo: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnNovoText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#d1d1d1', padding: 20, borderRadius: 10, width: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalBody: { color: '#333', textAlign: 'center', marginVertical: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  btnModalConfirm: { backgroundColor: 'red', padding: 10, borderRadius: 5, width: '40%', alignItems: 'center' },
  btnModalCancel: { backgroundColor: 'gray', padding: 10, borderRadius: 5, width: '40%', alignItems: 'center' }
});

export default TelaProdutos;