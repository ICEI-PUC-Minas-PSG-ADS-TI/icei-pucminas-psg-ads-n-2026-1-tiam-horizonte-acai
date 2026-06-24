import React, { useState, useEffect, useRef } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from '@expo-google-fonts/lexend';
import { supabase } from '@/lib/supabase';
import { paleta } from '@/constants/theme';
import { pageGradientProps } from '@/constants/theme';

export default function EditarProdutoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Captura o ID vindo da rota no Expo Router

  // Estados dos campos
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState('');

  // Controle de quais campos estão liberados para edição
  const [editando, setEditando] = useState({
    nome: false,
    descricao: false,
    preco: false,
    quantidade: false,
    categoria: false,
  });

  // Estados de controle e feedback
  const [carregando, setCarregando] = useState(true);
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

  // Carrega os dados iniciais do produto
  useEffect(() => {
    async function carregarProduto() {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setNome(data.nome);
          setDescricao(data.descricao || '');
          setPreco(data.preco?.toString() || '');
          setQuantidade(data.quantidade?.toString() || '');
          setCategoria(data.categoria || '');
        }
      } catch (e: any) {
        exibirMensagem('erro', 'Erro ao carregar dados do produto.');
      } finally {
        setCarregando(false);
      }
    }
    if (id) carregarProduto();
  }, [id]);

  const liberarCampo = (campo: keyof typeof editando) => {
    setEditando((prev) => ({ ...prev, [campo]: true }));
  };

  async function atualizarProduto() {
    if (!nome.trim() || !descricao.trim() || !preco.trim() || !quantidade.trim() || !categoria.trim()) {
      return exibirMensagem('erro', 'Todos os campos devem estar preenchidos.');
    }

    const precoNum = parseFloat(preco.replace(',', '.'));
    const qtdNum = parseInt(quantidade, 10);

    if (isNaN(precoNum)) return exibirMensagem('erro', 'Preço inválido.');
    if (isNaN(qtdNum)) return exibirMensagem('erro', 'Estoque inválido.');

    setSalvando(true);
    try {
      const { error } = await supabase
        .from('produtos')
        .update({
          nome: nome.trim(),
          descricao: descricao.trim(),
          preco: precoNum,
          quantidade: qtdNum,
          categoria: categoria.trim(),
        })
        .eq('id', id);

      if (error) throw error;

      exibirMensagem('sucesso', 'Produto atualizado com sucesso!');
      setTimeout(() => router.back(), 1500);
    } catch (e: any) {
      exibirMensagem('erro', e.message ?? 'Não foi possível atualizar o produto.');
    } finally {
      setSalvando(false);
    }
  }

  if (!fontsLoaded || carregando) {
    return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;
  }

  return (
    <ProtectedRoute permitidos={['GESTOR', 'ADMINISTRADOR']}>
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
                  <Text style={styles.headerLinha}>EDITAR PRODUTO</Text>
                </View>

                <View style={{ width: 36 }} />
              </View>

              <Text style={styles.subtitulo}>
                Utilize os ícones de lápis lateralmente para liberar{'\n'}a edição de cada campo específico.
              </Text>

              <View style={styles.cardFormulario}>
                
                {/* CAMPO NOME */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Nome do Produto</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, !editando.nome && styles.inputBloqueado]}
                      placeholder="Nome do produto..."
                      placeholderTextColor="#999"
                      value={nome}
                      onChangeText={setNome}
                      editable={editando.nome}
                    />
                    {!editando.nome && (
                      <TouchableOpacity style={styles.editIcon} onPress={() => liberarCampo('nome')}>
                        <Feather name="edit-3" size={18} color={paleta.ROXO} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* CAMPO DESCRIÇÃO */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Descrição</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, styles.textarea, !editando.descricao && styles.inputBloqueado]}
                      placeholder="Descrição do produto..."
                      placeholderTextColor="#999"
                      multiline
                      value={descricao}
                      onChangeText={setDescricao}
                      editable={editando.descricao}
                    />
                    {!editando.descricao && (
                      <TouchableOpacity style={styles.editIcon} onPress={() => liberarCampo('descricao')}>
                        <Feather name="edit-3" size={18} color={paleta.ROXO} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* CAMPO PREÇO */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Preço</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, !editando.preco && styles.inputBloqueado]}
                      placeholder="0,00"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={preco}
                      onChangeText={setPreco}
                      editable={editando.preco}
                    />
                    {!editando.preco && (
                      <TouchableOpacity style={styles.editIcon} onPress={() => liberarCampo('preco')}>
                        <Feather name="edit-3" size={18} color={paleta.ROXO} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* CAMPO ESTOQUE */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Estoque</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, !editando.quantidade && styles.inputBloqueado]}
                      placeholder="Quantidade em estoque..."
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={quantidade}
                      onChangeText={setQuantidade}
                      editable={editando.quantidade}
                    />
                    {!editando.quantidade && (
                      <TouchableOpacity style={styles.editIcon} onPress={() => liberarCampo('quantidade')}>
                        <Feather name="edit-3" size={18} color={paleta.ROXO} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* CAMPO CATEGORIA */}
                <View style={styles.campo}>
                  <Text style={styles.label}>Categoria</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, !editando.categoria && styles.inputBloqueado]}
                      placeholder="Categoria..."
                      placeholderTextColor="#999"
                      value={categoria}
                      onChangeText={setCategoria}
                      editable={editando.categoria}
                    />
                    {!editando.categoria && (
                      <TouchableOpacity style={styles.editIcon} onPress={() => liberarCampo('categoria')}>
                        <Feather name="edit-3" size={18} color={paleta.ROXO} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

              </View>

              {/* MENSAGEM DE AVISO */}
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

              {/* BOTÕES DE AÇÃO */}
              <View style={styles.botoes}>
                <TouchableOpacity
                  style={[styles.botao, styles.botaoCadastrar]}
                  onPress={atualizarProduto}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color="#1a1a1a" />
                  ) : (
                    <Text style={styles.botaoTextoCadastrar}>SALVAR</Text>
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

// ───────────────── Estilos Consolidados ─────────────────
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48, // Espaço para o ícone absoluto do lápis não sobrepor o texto
    fontFamily: 'Lexend_400Regular',
    color: paleta.ROXO,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  inputBloqueado: {
    backgroundColor: '#e6e6e6',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0.75,
  },
  textarea: {
    minHeight: 75,
    textAlignVertical: 'top',
  },
  editIcon: {
    position: 'absolute',
    right: 16,
    padding: 6,
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