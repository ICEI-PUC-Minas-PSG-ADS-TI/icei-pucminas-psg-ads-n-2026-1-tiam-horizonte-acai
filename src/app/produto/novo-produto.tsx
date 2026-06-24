import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from '@expo-google-fonts/lexend';
import { supabase } from '@/lib/supabase';
import { paleta } from '@/constants/theme';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarPreco(valor: string) {
  return valor.replace(/[^0-9,\.]/g, '');
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function CadastrarProduto() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState<'Venda' | 'Interno'>('Venda');

  const [salvando, setSalvando] = useState(false);
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalErro, setModalErro] = useState(false);

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;
  }

  function handleSalvar() {
    if (!nome.trim() || !descricao.trim() || !preco.trim() || !quantidade.trim() || !categoria.trim()) {
      setModalErro(true);
      return;
    }
    setModalConfirmar(true);
  }

  async function confirmarCadastro() {
    setModalConfirmar(false);
    setSalvando(true);
    try {
      const { error } = await supabase.from('produtos').insert([{
        nome,
        descricao,
        preco: parseFloat(preco.replace(',', '.')),
        quantidade: parseInt(quantidade),
        categoria,
        tipo,
      }]);
      if (error) throw error;
      router.back();
    } catch (e: any) {
      setModalErro(true);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <LinearGradient colors={[paleta.ROXO, '#2E1840', '#1A0E26']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={paleta.BRANCO} />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>PRODUTOS</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>Cadastrar Produto</Text>
          <Text style={styles.subtitulo}>Preencha as informações do novo produto.</Text>

          {/* Card do formulário */}
          <View style={styles.card}>

            {/* Tipo */}
            <Text style={styles.label}>Tipo de Produto</Text>
            <View style={styles.selectorContainer}>
              <TouchableOpacity
                style={[styles.selectorBtn, tipo === 'Venda' && styles.selectorBtnAtivo]}
                onPress={() => setTipo('Venda')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="storefront-outline"
                  size={15}
                  color={tipo === 'Venda' ? paleta.ROXO : '#888'}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.selectorTexto, tipo === 'Venda' && styles.selectorTextoAtivo]}>
                  Venda
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectorBtn, tipo === 'Interno' && styles.selectorBtnAtivo]}
                onPress={() => setTipo('Interno')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="cube-outline"
                  size={15}
                  color={tipo === 'Interno' ? paleta.ROXO : '#888'}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.selectorTexto, tipo === 'Interno' && styles.selectorTextoAtivo]}>
                  Uso Interno
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divisor} />

            {/* Nome */}
            <Text style={styles.label}>Nome do Produto</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="pricetag-outline" size={16} color="#999" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Ex: Açaí 500ml"
                placeholderTextColor="#999"
              />
            </View>

            {/* Descrição */}
            <Text style={styles.label}>Descrição</Text>
            <View style={[styles.inputWrapper, styles.textareaWrapper]}>
              <Ionicons name="document-text-outline" size={16} color="#999" style={[styles.inputIcone, { alignSelf: 'flex-start', marginTop: 12 }]} />
              <TextInput
                style={[styles.input, styles.textarea]}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                placeholder="Detalhes do produto..."
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
            </View>

            {/* Preço */}
            <Text style={styles.label}>{tipo === 'Interno' ? 'Preço de Custo' : 'Preço de Venda'}</Text>
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputIcone, { color: '#999', fontSize: 14, fontFamily: 'Lexend_700Bold' }]}>R$</Text>
              <TextInput
                style={styles.input}
                value={preco}
                onChangeText={(v) => setPreco(formatarPreco(v))}
                placeholder="0,00"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {/* Quantidade */}
            <Text style={styles.label}>Quantidade em Estoque</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="layers-outline" size={16} color="#999" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                value={quantidade}
                onChangeText={(v) => setQuantidade(v.replace(/\D/g, ''))}
                placeholder="Ex: 50"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {/* Categoria */}
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="grid-outline" size={16} color="#999" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                value={categoria}
                onChangeText={setCategoria}
                placeholder={tipo === 'Interno' ? 'Ex: Insumos / Embalagens' : 'Ex: Cremes'}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.divisor} />

            {/* Botões */}
            <View style={styles.botaoRow}>
              <TouchableOpacity
                style={[styles.botao, styles.botaoCancelar]}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={18} color="#aaa" />
                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botao, styles.botaoSalvar]}
                onPress={handleSalvar}
                activeOpacity={0.8}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color={paleta.ROXO} size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={18} color={paleta.ROXO} />
                    <Text style={styles.botaoSalvarTexto}>Salvar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer decorativo */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
      </View>

      {/* ── Modal Erro ─────────────────────────────────────── */}
      <Modal visible={modalErro} transparent animationType="fade" onRequestClose={() => setModalErro(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={[styles.modalIcone, { backgroundColor: paleta.VERMELHO }]}>
              <Ionicons name="alert" size={32} color="#fff" />
            </View>
            <Text style={styles.modalTitulo}>Atenção</Text>
            <Text style={styles.modalTexto}>
              Por favor, preencha todos os campos antes de salvar.
            </Text>
            <TouchableOpacity
              style={[styles.modalBotaoUnico, { borderColor: paleta.VERMELHO }]}
              onPress={() => setModalErro(false)}
            >
              <Text style={styles.modalBotaoUnicoTexto}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Modal Confirmação ──────────────────────────────── */}
      <Modal visible={modalConfirmar} transparent animationType="fade" onRequestClose={() => setModalConfirmar(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={[styles.modalIcone, { backgroundColor: paleta.VERDE }]}>
              <Ionicons name="help" size={32} color="#fff" />
            </View>
            <Text style={styles.modalTitulo}>Confirmar Cadastro</Text>
            <Text style={styles.modalTexto}>
              Deseja cadastrar{' '}
              <Text style={{ fontFamily: 'Lexend_700Bold', color: '#fff' }}>{nome}</Text>
              {' '}como item de{' '}
              <Text style={{ fontFamily: 'Lexend_700Bold', color: paleta.VERDE }}>
                {tipo === 'Venda' ? 'Venda' : 'Uso Interno'}
              </Text>
              ?
            </Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.modalBotao, styles.modalBotaoCancelar]}
                onPress={() => setModalConfirmar(false)}
              >
                <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBotao, styles.modalBotaoConfirmar]}
                onPress={confirmarCadastro}
              >
                <Text style={styles.modalBotaoConfirmarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitulo: {
    fontSize: 22,
    fontFamily: 'Lexend_800ExtraBold',
    color: paleta.VERDE,
    letterSpacing: 2,
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

  // ── Scroll / Títulos ─────────────────────────────────────
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  titulo: {
    color: paleta.BRANCO,
    fontSize: 24,
    fontFamily: 'Lexend_800ExtraBold',
    marginBottom: 6,
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontFamily: 'Lexend_400Regular',
    marginBottom: 20,
  },

  // ── Card Formulário ──────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    padding: 20,
    gap: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  label: {
    fontSize: 13,
    fontFamily: 'Lexend_700Bold',
    color: paleta.ROXO,
    marginTop: 10,
    marginBottom: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    minHeight: 46,
  },
  textareaWrapper: {
    alignItems: 'flex-start',
  },
  inputIcone: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
    color: '#222',
    paddingVertical: 10,
  },
  textarea: {
    minHeight: 72,
    paddingTop: 10,
  },

  // ── Selector Tipo ────────────────────────────────────────
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  selectorBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectorBtnAtivo: {
    backgroundColor: paleta.VERDE,
  },
  selectorTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: '#888',
  },
  selectorTextoAtivo: {
    color: paleta.ROXO,
  },

  divisor: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },

  // ── Botões ────────────────────────────────────────────────
  botaoRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  botao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  botaoSalvar: {
    backgroundColor: paleta.VERDE,
  },
  botaoSalvarTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: paleta.ROXO,
  },
  botaoCancelar: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#ccc',
  },
  botaoCancelarTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#aaa',
  },

  // ── Footer ───────────────────────────────────────────────
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  footerLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  // ── Modais ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#1a0e26',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    padding: 28,
    alignItems: 'center',
  },
  modalIcone: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitulo: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  modalTexto: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBotao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBotaoCancelar: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#555',
  },
  modalBotaoCancelarTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#aaa',
  },
  modalBotaoConfirmar: {
    backgroundColor: paleta.VERDE,
  },
  modalBotaoConfirmarTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: paleta.ROXO,
  },
  modalBotaoUnico: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  modalBotaoUnicoTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#fff',
  },
});