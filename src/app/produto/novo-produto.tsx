import React, { useState, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from '@expo-google-fonts/lexend';
import { supabase } from '@/lib/supabase';
import { paleta } from '@/constants/theme';
import { pageGradientProps } from '@/constants/theme';

export default function CadastrarProdutoScreen() {
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState<'Venda' | 'Interno'>('Venda');

  // Estados de controle e feedback
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const timerMensagem = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  function exibirMensagem(tipo: 'sucesso' | 'erro', texto: string) {
    if (timerMensagem.current) clearTimeout(timerMensagem.current);
    setMensagem({ tipo, texto });
    timerMensagem.current = setTimeout(() => setMensagem(null), 3000);
  }

  async function cadastrarProduto() {
    // Validação estrita de campos obrigatórios
    if (!nome.trim() || !descricao.trim() || !preco.trim() || !quantidade.trim() || !categoria.trim()) {
      return exibirMensagem('erro', 'Por favor, preencha todos os campos.');
    }

    const precoNum = parseFloat(preco.replace(',', '.'));
    const qtdNum = parseInt(quantidade, 10);

    if (isNaN(precoNum)) return exibirMensagem('erro', 'Preço inválido.');
    if (isNaN(qtdNum)) return exibirMensagem('erro', 'Quantidade inválida.');

    setSalvando(true);
    try {
      const { error } = await supabase
        .from('produtos')
        .insert([{ 
          nome: nome.trim(), 
          descricao: descricao.trim(), 
          preco: precoNum, 
          quantidade: qtdNum, 
          categoria: categoria.trim(),
          tipo 
        }]);

      if (error) throw error;

      exibirMensagem('sucesso', 'Produto cadastrado com sucesso!');
      setTimeout(() => router.back(), 1500);
    } catch (e: any) {
      exibirMensagem('erro', e.message ?? 'Não foi possível cadastrar o produto.');
    } finally {
      setSalvando(false);
    }
  }

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;
  }

  return (
    <ProtectedRoute permitidos={['GESTOR', 'ADMINISTRADOR', 'ESTOQUISTA']}>
      <LinearGradient {...pageGradientProps()}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.conteudo}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
                  <View style={styles.avatarCircle}>
                    <Ionicons name="arrow-back-outline" size={22} color="#fff" />
                  </View>
                </TouchableOpacity>

                <View style={styles.headerTituloContainer}>
                  <Text style={styles.headerLinha}>NOVO PRODUTO</Text>
                </View>

                <View style={{ width: 36 }} />
              </View>

              <Text style={styles.subtitulo}>
                Preencha os dados abaixo para inserir um{'\n'}novo produto ao catálogo
              </Text>

              <View style={styles.cardFormulario}>
                {/* SELETOR DE TIPO */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Tipo de Produto *</Text>
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

                {/* NOME */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Nome do Produto *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Açaí 500ml"
                    placeholderTextColor="#999"
                    value={nome}
                    onChangeText={setNome}
                  />
                </View>

                {/* DESCRIÇÃO */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Descrição *</Text>
                  <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="Detalhes e insumos do produto..."
                    placeholderTextColor="#999"
                    multiline
                    value={descricao}
                    onChangeText={setDescricao}
                  />
                </View>

                {/* PREÇO */}
                <View style={styles.campo}>
                  <Text style={styles.label}>
                    {tipo === 'Interno' ? 'Preço de Custo *' : 'Preço de Venda *'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0,00"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={preco}
                    onChangeText={setPreco}
                  />
                </View>

                {/* QUANTIDADE */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Quantidade Inicial *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 50"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={quantidade}
                    onChangeText={setQuantidade}
                  />
                </View>

                {/* CATEGORIA */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Categoria *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={tipo === 'Interno' ? 'Ex: Embalagens' : 'Ex: Cremes'}
                    placeholderTextColor="#999"
                    value={categoria}
                    onChangeText={setCategoria}
                  />
                </View>
              </View>

              {/* MENSAGEM IN-APP */}
              {mensagem && (
                <View
                  style={[
                    styles.mensagem,
                    mensagem.tipo === 'sucesso'
                      ? styles.mensagemSucesso
                      : styles.mensagemErro,
                  ]}
                >
                  <Text style={styles.mensagemTexto}>
                    {mensagem.tipo === 'sucesso' ? '✅ ' : '❌ '}
                    {mensagem.texto}
                  </Text>
                </View>
              )}

              {/* BOTÕES */}
              <View style={styles.botoes}>
                <TouchableOpacity
                  style={[styles.botao, styles.botaoCadastrar]}
                  onPress={cadastrarProduto}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color="#1a1a1a" />
                  ) : (
                    <Text style={styles.botaoTextoCadastrar}>CADASTRAR</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botao, styles.botaoCancelar]}
                  onPress={() => router.back()}
                  disabled={salvando}
                >
                  <Text style={styles.botaoTextoCancelar}>CANCELAR</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ProtectedRoute>
  );
}

// ───────────────── Estilos Unificados ─────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 24 },
  conteudo: { flexGrow: 1, paddingBottom: 48 },

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
  },
  iconBtn: { marginLeft: 10, padding: 4 },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: paleta.VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTituloContainer: { alignItems: 'center' },
  headerLinha: {
    color: paleta.VERDE,
    fontSize: 30,
    fontFamily: 'Lexend_800ExtraBold',
    letterSpacing: 2,
  },

  subtitulo: {
    color: '#ddd',
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 20,
  },

  cardFormulario: { width: '85%', alignSelf: 'center' },
  campo: { marginBottom: 10 },

  label: {
    color: '#fff',
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Lexend_400Regular',
    color: paleta.ROXO,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Estilização do Seletor Customizado
  selectorContainer: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    borderRadius: 14, 
    padding: 4, 
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  selectorBtn: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 10 
  },
  selectorBtnAtivo: { 
    backgroundColor: paleta.VERDE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorText: { 
    color: '#ccc', 
    fontFamily: 'Lexend_700Bold', 
    fontSize: 13 
  },
  selectorTextAtivo: { 
    color: '#1a1a1a' 
  },

  botoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    width: '85%',
    alignSelf: 'center',
  },
  botao: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  botaoCadastrar: { backgroundColor: paleta.VERDE },
  botaoCancelar: { backgroundColor: paleta.VERMELHO },
  botaoTextoCadastrar: {
    color: '#1a1a1a',
    fontSize: 14,
    fontFamily: 'Lexend_800ExtraBold',
  },
  botaoTextoCancelar: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Lexend_800ExtraBold',
  },

  mensagem: {
    width: '85%',
    alignSelf: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  mensagemSucesso: { backgroundColor: '#1a472a' },
  mensagemErro: { backgroundColor: '#7f1d1d' },
  mensagemTexto: { color: '#fff', fontFamily: 'Lexend_700Bold', fontSize: 14 },
});