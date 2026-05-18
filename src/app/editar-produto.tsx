import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, ScrollView, Modal, Alert, SafeAreaView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const logoAcai = "https://cdn-icons-png.flaticon.com/512/5917/5917321.png";

export default function EditarProduto() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [editando, setEditando] = useState({ nome: false, descricao: false, preco: false, quantidade: false });
  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);

  useEffect(() => {
    const carregarProduto = async () => {
      const { data } = await supabase.from('produtos').select('*').eq('id', id).single();
      if (data) {
        setNome(data.nome);
        setDescricao(data.descricao || '');
        setPreco(data.preco?.toString());
        setQuantidade(data.quantidade?.toString());
        setCategoria(data.categoria || '');
      }
    };
    carregarProduto();
  }, [id]);

  const liberarCampo = (campo: string) => {
    setEditando(prev => ({ ...prev, [campo]: true }));
  };

  const salvarAlteracoes = async () => {
    try {
      const { error } = await supabase.from('produtos').update({
        nome, descricao,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        categoria
      }).eq('id', id);

      if (error) throw error;
      setModalConfirmarAberto(false);
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", "Erro ao atualizar: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.box}>
          <Image source={{ uri: logoAcai }} style={styles.logo} />
          <Text style={styles.titulo}>EDITAR <Text style={{ color: '#7ed957' }}>PRODUTO</Text></Text>
          <View style={styles.form}>
            {[
              { label: 'Nome do Produto', value: nome, setter: setNome, campo: 'nome' },
              { label: 'Descrição', value: descricao, setter: setDescricao, campo: 'descricao' },
              { label: 'Preço', value: preco, setter: setPreco, campo: 'preco', numeric: true },
              { label: 'Estoque', value: quantidade, setter: setQuantidade, campo: 'quantidade', numeric: true },
            ].map(({ label, value, setter, campo, numeric }) => (
              <View key={campo} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { backgroundColor: editando[campo as keyof typeof editando] ? '#fff' : '#d1d1d1' }]}
                    value={value}
                    onChangeText={setter}
                    editable={editando[campo as keyof typeof editando]}
                    keyboardType={numeric ? 'numeric' : 'default'}
                  />
                  <TouchableOpacity style={styles.editIcon} onPress={() => liberarCampo(campo)}>
                    <Feather name="edit-3" size={20} color="#4a3061" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.btnSalvar} onPress={() => setModalConfirmarAberto(true)}>
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => router.back()}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalConfirmarAberto} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirmar Edição</Text>
              <Image source={{ uri: logoAcai }} style={{ width: 35, height: 35 }} />
            </View>
            <Text style={styles.modalBody}>Deseja salvar as alterações deste produto?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnModalConfirm} onPress={salvarAlteracoes}>
                <Text style={styles.btnText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnModalCancel} onPress={() => setModalConfirmarAberto(false)}>
                <Text style={styles.btnText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4a3061' },
  scrollContent: { paddingVertical: 40, paddingHorizontal: 20 },
  box: { width: '100%', alignItems: 'center' },
  logo: { width: 70, height: 70, marginBottom: 10 },
  titulo: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  form: { width: '100%', gap: 15 },
  inputGroup: { gap: 5 },
  label: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, padding: 12, paddingRight: 45, borderRadius: 8, fontSize: 16, color: '#333' },
  editIcon: { position: 'absolute', right: 12, padding: 5 },
  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 20 },
  btnSalvar: { flex: 1, padding: 15, backgroundColor: '#28a745', borderRadius: 8, alignItems: 'center' },
  btnCancelar: { flex: 1, padding: 15, backgroundColor: 'red', borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#d1d1d1', padding: 25, borderRadius: 15, width: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalBody: { color: '#333', marginVertical: 20, textAlign: 'center', fontSize: 16 },
  modalButtons: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  btnModalConfirm: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnModalCancel: { backgroundColor: 'gray', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' }
});