import ProtectedRoute from '@/components/ProtectedRoute';
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Image, Modal, Alert, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const logoAcai = "https://cdn-icons-png.flaticon.com/512/5917/5917321.png";

export default function NovoProduto() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const [modalErroAberto, setModalErroAberto] = useState(false);

  const handleSalvarClick = () => {
    if (!nome || !descricao || !preco || !quantidade || !categoria) {
      setModalErroAberto(true);
      return;
    }
    setModalConfirmarAberto(true);
  };

  const confirmarCadastro = async () => {
    try {
      const { error } = await supabase.from('produtos').insert([{
        nome, descricao,
        preco: parseFloat(preco.replace(',', '.')),
        quantidade: parseInt(quantidade),
        categoria
      }]);
      if (error) throw error;
      setModalConfirmarAberto(false);
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", "Erro ao cadastrar: " + error.message);
    }
  };

  return (
    <ProtectedRoute
      permitidos={[
        'ADMINISTRADOR',
        'ESTOQUISTA',
      ]}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Image source={{ uri: logoAcai }} style={styles.logoTop} />
            <Text style={styles.titulo}>CADASTRAR <Text style={{ color: '#7ed957' }}>PRODUTO</Text></Text>
            <View style={styles.form}>
              {[
                { label: 'Nome do Produto', value: nome, setter: setNome, placeholder: 'Ex: Açaí 500ml' },
                { label: 'Preço', value: preco, setter: setPreco, placeholder: '0.00', numeric: true },
                { label: 'Quantidade', value: quantidade, setter: setQuantidade, placeholder: 'Ex: 50', numeric: true },
                { label: 'Categoria', value: categoria, setter: setCategoria, placeholder: 'Ex: Cremes' },
              ].map(({ label, value, setter, placeholder, numeric }) => (
                <View key={label} style={styles.inputGroup}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={setter}
                    placeholder={placeholder}
                    keyboardType={numeric ? 'numeric' : 'default'}
                  />
                </View>
              ))}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={descricao}
                  onChangeText={setDescricao}
                  multiline
                  placeholder="Detalhes do produto..."
                />
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvarClick}>
                  <Text style={styles.btnText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCancelar} onPress={() => router.back()}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal visible={modalErroAberto} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Atenção</Text>
                <Image source={{ uri: logoAcai }} style={{ width: 30, height: 30 }} />
              </View>
              <Text style={styles.modalBody}>Por favor, preencha todos os campos antes de salvar!</Text>
              <TouchableOpacity style={styles.btnModalOk} onPress={() => setModalErroAberto(false)}>
                <Text style={styles.btnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={modalConfirmarAberto} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Confirmar</Text>
                <Image source={{ uri: logoAcai }} style={{ width: 30, height: 30 }} />
              </View>
              <Text style={styles.modalBody}>Deseja realmente cadastrar o produto {"\n"}<Text style={{ fontWeight: 'bold' }}>{nome}</Text>?</Text>
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
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4a3061' },
  scrollContent: { alignItems: 'center', padding: 20 },
  logoTop: { width: 80, height: 80, marginBottom: 10 },
  titulo: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 30 },
  form: { width: '100%', maxWidth: 350, gap: 15 },
  inputGroup: { gap: 5 },
  label: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  input: { width: '100%', padding: 12, borderRadius: 8, backgroundColor: '#d1d1d1', fontSize: 16, color: '#333' },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 10 },
  btnSalvar: { flex: 1, padding: 15, backgroundColor: 'green', borderRadius: 8, alignItems: 'center' },
  btnCancelar: { flex: 1, padding: 15, backgroundColor: 'red', borderRadius: 8, alignItems: 'center' },
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