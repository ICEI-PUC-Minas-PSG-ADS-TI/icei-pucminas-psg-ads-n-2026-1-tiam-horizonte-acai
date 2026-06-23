import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Modal, 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';

const logoAcai = "https://cdn-icons-png.flaticon.com/512/5917/5917321.png";

const NovoProduto = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('Venda'); // 'Venda' ou 'Interno'
  
  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const [modalErroAberto, setModalErroAberto] = useState(false);
  
  const navigation = useNavigation();

  const handleSalvarClick = () => {
    if (!nome || !descricao || !preco || !quantidade || !categoria || !tipo) {
      setModalErroAberto(true);
      return;
    }
    setModalConfirmarAberto(true);
  };

  const confirmarCadastro = async () => {
    // 1. Fecha o modal logo no primeiro clique para destravar a interface visual
    setModalConfirmarAberto(false);

    try {
      // 2. Envia os dados para o Supabase e ESPERA a resposta dele
      const { error } = await supabase
        .from('produtos')
        .insert([{ 
          nome, 
          descricao, 
          preco: parseFloat(preco.replace(',', '.')), 
          quantidade: parseInt(quantidade), 
          categoria,
          tipo 
        }]);

      if (error) throw error;

      // 3. Se gravou com sucesso, exibe o aviso na tela
      alert("Produto cadastrado com sucesso!");
      
      // Limpa todos os estados do formulário
      setNome('');
      setDescricao('');
      setPreco('');
      setQuantidade('');
      setCategoria('');
      
      // 4. Retorna em segurança para a tela anterior
      navigation.goBack();

    } catch (error) {
      // SE O BANCO RECUSAR POR FALTA DA COLUNA 'TIPO', ESTE AVISO VAI APARECER NA TELA
      alert("Erro retornado pelo banco: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Image source={{ uri: logoAcai }} style={styles.logoTop} />
          <Text style={styles.titulo}>CADASTRAR <Text style={{color: '#7ed957'}}>PRODUTO</Text></Text>
          
          <View style={styles.form}>
            {/* SELEÇÃO DE TIPO */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Produto</Text>
              <View style={styles.selectorContainer}>
                <TouchableOpacity 
                  style={[styles.selectorBtn, tipo === 'Venda' && styles.selectorBtnAtivo]}
                  onPress={() => setTipo('Venda')}
                >
                  <Text style={[styles.selectorText, tipo === 'Venda' && styles.selectorTextAtivo]}>Venda</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.selectorBtn, tipo === 'Interno' && styles.selectorBtnAtivo]}
                  onPress={() => setTipo('Interno')}
                >
                  <Text style={[styles.selectorText, tipo === 'Interno' && styles.selectorTextAtivo]}>Uso Interno</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Produto</Text>
              <TextInput 
                style={styles.input} 
                value={nome} 
                onChangeText={setNome} 
                placeholder="Ex: Açaí 500ml"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput 
                style={[styles.input, styles.textarea]} 
                value={descricao} 
                onChangeText={setDescricao} 
                multiline 
                placeholder="Detalhes do produto..."
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{tipo === 'Interno' ? 'Preço de Custo' : 'Preço de Venda'}</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                value={preco} 
                onChangeText={setPreco} 
                placeholder="0.00"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantidade</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                value={quantidade} 
                onChangeText={setQuantidade} 
                placeholder="Ex: 50"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria</Text>
              <TextInput 
                style={styles.input} 
                value={categoria} 
                onChangeText={setCategoria} 
                placeholder={tipo === 'Interno' ? 'Ex: Insumos / Embalagens' : 'Ex: Cremes'}
                placeholderTextColor="#666"
              />
            </View>

            {/* BOTÕES DE AÇÃO */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvarClick}>
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.goBack()}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL DE ERRO */}
      <Modal visible={modalErroAberto} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Atenção</Text>
              <Image source={{ uri: logoAcai }} style={{width: 30, height: 30}} />
            </View>
            <Text style={styles.modalBody}>Por favor, preencha todos os campos antes de salvar!</Text>
            <TouchableOpacity style={styles.btnModalOk} onPress={() => setModalErroAberto(false)}>
              <Text style={styles.btnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO */}
      <Modal visible={modalConfirmarAberto} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirmar</Text>
              <Image source={{ uri: logoAcai }} style={{width: 30, height: 30}} />
            </View>
            <Text style={styles.modalBody}>
              Deseja realmente cadastrar o produto {"\n"}
              <Text style={{fontWeight: 'bold'}}>{nome}</Text> como item de <Text style={{fontWeight: 'bold', color: '#4a3061'}}>{tipo === 'Venda' ? 'Venda' : 'Uso Interno'}</Text>?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnModalConfirm} onPress={confirmarCadastro}>
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnModalCancel} onPress={() => setModalConfirmarAberto(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4a3061' },
  scrollContent: { alignItems: 'center', padding: 15, paddingBottom: 30 }, 
  logoTop: { width: 65, height: 65, marginBottom: 5 }, 
  titulo: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 15 }, 
  form: { width: '100%', maxWidth: 350, gap: 10 }, 
  inputGroup: { gap: 3 },
  label: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  input: { width: '100%', padding: 10, borderRadius: 8, backgroundColor: '#d1d1d1', fontSize: 15, color: '#333' }, 
  textarea: { minHeight: 60, textAlignVertical: 'top' }, 
  
  selectorContainer: { flexDirection: 'row', backgroundColor: '#e0e0e0', borderRadius: 8, padding: 3, marginTop: 2 },
  selectorBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  selectorBtnAtivo: { backgroundColor: '#7ed957' },
  selectorText: { color: '#666', fontWeight: 'bold', fontSize: 13 },
  selectorTextAtivo: { color: '#4a3061' },

  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 15, marginBottom: 30 },
  btnSalvar: { flex: 1, padding: 14, backgroundColor: 'green', borderRadius: 8, alignItems: 'center' },
  btnCancelar: { flex: 1, padding: 14, backgroundColor: 'red', borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#d1d1d1', padding: 20, borderRadius: 15, width: '80%', alignItems: 'center' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalBody: { color: '#333', textAlign: 'center', marginVertical: 20, fontSize: 16 },
  btnModalOk: { backgroundColor: '#4a3061', padding: 10, borderRadius: 8, width: '100%', alignItems: 'center' },
  modalButtons: { flexDirection: 'row', gap: 10 },
  btnModalConfirm: { backgroundColor: 'green', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnModalCancel: { backgroundColor: 'gray', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' }
});

export default NovoProduto;