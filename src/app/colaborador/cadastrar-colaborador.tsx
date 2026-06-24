import React, { useState, useRef } from 'react';
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
import { useFonts, Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold } from '@expo-google-fonts/lexend';
import { supabase } from '@/lib/supabase';
import { paleta } from '@/constants/theme';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type TipoFuncionario = 'GESTOR' | 'VENDEDOR' | 'ESTOQUISTA';

const TIPOS: TipoFuncionario[] = ['GESTOR', 'VENDEDOR', 'ESTOQUISTA'];

const TIPO_COR: Record<TipoFuncionario, string> = {
  GESTOR: '#7c3aed',
  VENDEDOR: '#5EB85E',
  ESTOQUISTA: '#d97706',
};

const TIPO_LABEL: Record<TipoFuncionario, string> = {
  GESTOR: 'Gestor',
  VENDEDOR: 'Vendedor',
  ESTOQUISTA: 'Estoquista',
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function CadastrarColaboradorScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [tipo, setTipo] = useState<TipoFuncionario>('VENDEDOR');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const timerMensagem = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold });

  function exibirMensagem(tipo: 'sucesso' | 'erro', texto: string) {
    if (timerMensagem.current) clearTimeout(timerMensagem.current);
    setMensagem({ tipo, texto });
    timerMensagem.current = setTimeout(() => setMensagem(null), 3000);
  }

  async function cadastrar() {
    if (!nome.trim()) return exibirMensagem('erro', 'O nome é obrigatório.');
    if (!usuario.trim()) return exibirMensagem('erro', 'O usuário é obrigatório.');
    if (senha.length < 6) return exibirMensagem('erro', 'A senha deve ter no mínimo 6 caracteres.');

    setSalvando(true);
    try {
      const { error } = await supabase
        .from('Funcionario')
        .insert({
          nome: nome.trim(),
          usuario: usuario.trim().toLowerCase(),
          senha,
          tipo,
          ativo: true,
        });

      if (error) throw error;

      exibirMensagem('sucesso', 'Colaborador cadastrado com sucesso!');
      setTimeout(() => router.back(), 1500);
    } catch (e: any) {
      exibirMensagem('erro', e.message ?? 'Não foi possível cadastrar o colaborador.');
    } finally {
      setSalvando(false);
    }
  }

  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;

  return (
    <LinearGradient colors={[paleta.ROXO, '#2E1840', '#1A0E26']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
              <Text style={styles.headerLinha}>NOVO COLABORADOR</Text>
              <View style={{ width: 36 }} />
            </View>

            <Text style={styles.subtitulo}>
              Preencha os campos para cadastrar{'\n'}um novo colaborador
            </Text>

            <View style={styles.form}>

              {/* Nome */}
              <View style={styles.campo}>
                <Text style={styles.label}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo..."
                  placeholderTextColor="#999"
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

              {/* Usuário */}
              <View style={styles.campo}>
                <Text style={styles.label}>Usuário *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome de usuário para login..."
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  value={usuario}
                  onChangeText={setUsuario}
                />
              </View>

              {/* Senha */}
              <View style={styles.campo}>
                <Text style={styles.label}>Senha *</Text>
                <View style={styles.senhaContainer}>
                  <TextInput
                    style={styles.senhaInput}
                    placeholder="Mínimo 6 caracteres..."
                    placeholderTextColor="#999"
                    secureTextEntry={!senhaVisivel}
                    value={senha}
                    onChangeText={setSenha}
                  />
                  <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={styles.senhaOlho}>
                    <Ionicons name={senhaVisivel ? 'eye-off' : 'eye'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tipo */}
              <View style={styles.campo}>
                <Text style={styles.label}>Tipo *</Text>
                <View style={styles.tipoContainer}>
                  {TIPOS.map((t) => {
                    const selecionado = tipo === t;
                    const cor = TIPO_COR[t];
                    return (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.tipoBotao,
                          selecionado && { backgroundColor: cor, borderColor: cor },
                        ]}
                        onPress={() => setTipo(t)}
                      >
                        <Text style={[styles.tipoTexto, selecionado && { color: '#fff' }]}>
                          {TIPO_LABEL[t]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

            </View>

            {/* Mensagem */}
            {mensagem && (
              <View style={[styles.mensagem, mensagem.tipo === 'sucesso' ? styles.mensagemSucesso : styles.mensagemErro]}>
                <Text style={styles.mensagemTexto}>
                  {mensagem.tipo === 'sucesso' ? '✅ ' : '❌ '}{mensagem.texto}
                </Text>
              </View>
            )}

            {/* Botões */}
            <View style={styles.botoes}>
              <TouchableOpacity
                style={[styles.botao, styles.botaoCadastrar]}
                onPress={cadastrar}
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
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24 },
  conteudo: { flexGrow: 1, paddingBottom: 48 },

  header: {
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
  headerLinha: {
    color: paleta.VERDE,
    fontSize: 20,
    fontFamily: 'Lexend_800ExtraBold',
    letterSpacing: 2,
    textAlign: 'center',
    flex: 1,
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

  form: { width: '85%', alignSelf: 'center' },
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
    elevation: 3,
  },

  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    paddingHorizontal: 16,
    elevation: 3,
  },
  senhaInput: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: 'Lexend_400Regular',
    color: paleta.ROXO,
  },
  senhaOlho: { padding: 4 },

  tipoContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tipoBotao: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tipoTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: '#ccc',
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
  botaoTextoCadastrar: { color: '#1a1a1a', fontSize: 14, fontFamily: 'Lexend_800ExtraBold' },
  botaoTextoCancelar: { color: '#fff', fontSize: 14, fontFamily: 'Lexend_800ExtraBold' },
});