import React, { useState, useEffect, useRef } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { paleta } from '@/constants/theme';
import { pageGradientProps } from '@/constants/theme';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type TipoFuncionario = 'GESTOR' | 'VENDEDOR' | 'ESTOQUISTA' | 'ADMINISTRADOR';

interface Funcionario {
  id: number;
  nome: string;
  usuario: string;
  tipo: TipoFuncionario;
  ativo: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIPO_COR: Record<TipoFuncionario, string> = {
  GESTOR: '#7c3aed',
  VENDEDOR: '#5EB85E',
  ESTOQUISTA: '#d97706',
  ADMINISTRADOR: '#d31314'
};

const TIPO_LABEL: Record<string, string> = {
  GESTOR: 'Gestor',
  VENDEDOR: 'Vendedor',
  ESTOQUISTA: 'Estoquista',
  ADMINISTRADOR: 'Administrador'
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function PerfilScreen() {
  const router = useRouter();

  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaAtualVisivel, setSenhaAtualVisivel] = useState(false);
  const [novaSenhaVisivel, setNovaSenhaVisivel] = useState(false);
  const [confirmarVisivel, setConfirmarVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const timerMensagem = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold });

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    setCarregando(true);
    try {
      const id = await AsyncStorage.getItem('idFuncionario');
      if (!id) throw new Error('Sessão inválida. Faça login novamente.');

      const { data, error } = await supabase
        .from('Funcionario')
        .select('id, nome, usuario, tipo, ativo')
        .eq('id', Number(id))
        .single();

      if (error) throw error;
      setFuncionario(data);
    } catch (e: any) {
      exibirMensagem('erro', e.message ?? 'Não foi possível carregar o perfil.');
    } finally {
      setCarregando(false);
    }
  }

  function exibirMensagem(tipo: 'sucesso' | 'erro', texto: string) {
    if (timerMensagem.current) clearTimeout(timerMensagem.current);
    setMensagem({ tipo, texto });
    timerMensagem.current = setTimeout(() => setMensagem(null), 3500);
  }

  async function alterarSenha() {
    if (!senhaAtual) return exibirMensagem('erro', 'Digite sua senha atual.');
    if (!novaSenha) return exibirMensagem('erro', 'Digite a nova senha.');
    if (novaSenha.length < 6) return exibirMensagem('erro', 'A nova senha deve ter no mínimo 6 caracteres.');
    if (novaSenha !== confirmarSenha) return exibirMensagem('erro', 'As senhas não coincidem.');
    if (senhaAtual === novaSenha) return exibirMensagem('erro', 'A nova senha deve ser diferente da atual.');

    setSalvando(true);
    try {
      // Verifica a senha atual
      const { data, error: erroVerif } = await supabase
        .from('Funcionario')
        .select('id')
        .eq('id', funcionario!.id)
        .eq('senha', senhaAtual)
        .single();

      if (erroVerif || !data) {
        return exibirMensagem('erro', 'Senha atual incorreta.');
      }

      // Atualiza para a nova senha
      const { error } = await supabase
        .from('Funcionario')
        .update({ senha: novaSenha })
        .eq('id', funcionario!.id);

      if (error) throw error;

      exibirMensagem('sucesso', 'Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (e: any) {
      exibirMensagem('erro', e.message ?? 'Não foi possível alterar a senha.');
    } finally {
      setSalvando(false);
    }
  }

  async function sair() {
    await AsyncStorage.multiRemove(['idFuncionario', 'nomeFuncionario', 'tipoFuncionario']);
    router.replace('/login/login' as any);
  }

  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;

  const tipoCor = funcionario ? (TIPO_COR[funcionario.tipo] ?? paleta.VERDE) : paleta.VERDE;

  return (
    <LinearGradient {...pageGradientProps()}>
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
              <Text style={styles.headerTitulo}>MEU PERFIL</Text>
              <TouchableOpacity style={styles.iconBtn} onPress={sair}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="log-out-outline" size={22} color={paleta.VERMELHO} />
                </View>
              </TouchableOpacity>
            </View>

            {carregando ? (
              <ActivityIndicator color={paleta.VERDE} style={{ marginTop: 60 }} size="large" />
            ) : funcionario ? (
              <>
                {/* Card de perfil */}
                <View style={styles.perfilCard}>
                  {/* Avatar grande */}
                  <View style={[styles.avatarGrande, { backgroundColor: tipoCor }]}>
                    <Text style={styles.avatarLetra}>
                      {funcionario.nome.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <Text style={styles.perfilNome}>{funcionario.nome}</Text>

                  {/* Badge de tipo */}
                  <View style={[styles.badge, { backgroundColor: tipoCor + '22', borderColor: tipoCor }]}>
                    <Text style={[styles.badgeTexto, { color: tipoCor }]}>
                      {TIPO_LABEL[funcionario.tipo] ?? funcionario.tipo}
                    </Text>
                  </View>

                  {/* Divisor */}
                  <View style={styles.divisor} />

                  {/* Dados */}
                  <View style={styles.dadosContainer}>
                    <View style={styles.dadoLinha}>
                      <Ionicons name="person-outline" size={16} color={paleta.VERDE} />
                      <Text style={styles.dadoLabel}>Usuário</Text>
                      <Text style={styles.dadoValor}>@{funcionario.usuario}</Text>
                    </View>

                    <View style={styles.dadoSeparador} />

                    <View style={styles.dadoLinha}>
                      <Ionicons name="shield-checkmark-outline" size={16} color={paleta.VERDE} />
                      <Text style={styles.dadoLabel}>Função</Text>
                      <Text style={styles.dadoValor}>{TIPO_LABEL[funcionario.tipo]}</Text>
                    </View>

                    <View style={styles.dadoSeparador} />

                    <View style={styles.dadoLinha}>
                      <Ionicons
                        name={funcionario.ativo ? 'checkmark-circle-outline' : 'close-circle-outline'}
                        size={16}
                        color={funcionario.ativo ? paleta.VERDE : paleta.VERMELHO}
                      />
                      <Text style={styles.dadoLabel}>Status</Text>
                      <Text style={[styles.dadoValor, { color: funcionario.ativo ? paleta.VERDE : paleta.VERMELHO }]}>
                        {funcionario.ativo ? 'Ativo' : 'Inativo'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Seção alterar senha */}
                <View style={styles.secaoTitulo}>
                  <Ionicons name="lock-closed-outline" size={18} color={paleta.VERDE} />
                  <Text style={styles.secaoTexto}>ALTERAR SENHA</Text>
                </View>

                <View style={styles.form}>
                  {/* Senha atual */}
                  <View style={styles.campo}>
                    <Text style={styles.label}>Senha atual</Text>
                    <View style={styles.senhaContainer}>
                      <TextInput
                        style={styles.senhaInput}
                        placeholder="Digite sua senha atual..."
                        placeholderTextColor="#999"
                        secureTextEntry={!senhaAtualVisivel}
                        value={senhaAtual}
                        onChangeText={setSenhaAtual}
                      />
                      <TouchableOpacity onPress={() => setSenhaAtualVisivel(!senhaAtualVisivel)} style={styles.olho}>
                        <Ionicons name={senhaAtualVisivel ? 'eye-off' : 'eye'} size={20} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Nova senha */}
                  <View style={styles.campo}>
                    <Text style={styles.label}>Nova senha</Text>
                    <View style={styles.senhaContainer}>
                      <TextInput
                        style={styles.senhaInput}
                        placeholder="Mínimo 6 caracteres..."
                        placeholderTextColor="#999"
                        secureTextEntry={!novaSenhaVisivel}
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                      />
                      <TouchableOpacity onPress={() => setNovaSenhaVisivel(!novaSenhaVisivel)} style={styles.olho}>
                        <Ionicons name={novaSenhaVisivel ? 'eye-off' : 'eye'} size={20} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirmar senha */}
                  <View style={styles.campo}>
                    <Text style={styles.label}>Confirmar nova senha</Text>
                    <View style={styles.senhaContainer}>
                      <TextInput
                        style={styles.senhaInput}
                        placeholder="Repita a nova senha..."
                        placeholderTextColor="#999"
                        secureTextEntry={!confirmarVisivel}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                      />
                      <TouchableOpacity onPress={() => setConfirmarVisivel(!confirmarVisivel)} style={styles.olho}>
                        <Ionicons name={confirmarVisivel ? 'eye-off' : 'eye'} size={20} color="#999" />
                      </TouchableOpacity>
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

                {/* Botão salvar */}
                <TouchableOpacity
                  style={[styles.botaoSalvar, salvando && { opacity: 0.7 }]}
                  onPress={alterarSenha}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color="#1a1a1a" />
                  ) : (
                    <Text style={styles.botaoSalvarTexto}>SALVAR NOVA SENHA</Text>
                  )}
                </TouchableOpacity>

                {/* Botão sair */}
                <TouchableOpacity style={styles.botaoSair} onPress={sair}>
                  <Ionicons name="log-out-outline" size={18} color={paleta.VERMELHO} />
                  <Text style={styles.botaoSairTexto}>Sair da conta</Text>
                </TouchableOpacity>

              </>
            ) : (
              <Text style={styles.erroTexto}>Não foi possível carregar o perfil.</Text>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  conteudo: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 48 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  iconBtn: { padding: 4 },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitulo: {
    color: paleta.VERDE,
    fontSize: 22,
    fontFamily: 'Lexend_800ExtraBold',
    letterSpacing: 2,
  },

  // Card de perfil
  perfilCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(94,184,94,0.3)',
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarGrande: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarLetra: {
    color: '#fff',
    fontSize: 36,
    fontFamily: 'Lexend_800ExtraBold',
  },
  perfilNome: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Lexend_800ExtraBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  badgeTexto: {
    fontSize: 12,
    fontFamily: 'Lexend_700Bold',
  },
  divisor: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  dadosContainer: { width: '100%' },
  dadoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  dadoLabel: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 13,
    color: '#aaa',
    width: 70,
  },
  dadoValor: {
    flex: 1,
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: '#fff',
    textAlign: 'right',
  },
  dadoSeparador: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 4,
  },

  // Seção
  secaoTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  secaoTexto: {
    color: paleta.VERDE,
    fontFamily: 'Lexend_700Bold',
    fontSize: 12,
    letterSpacing: 2,
  },

  // Formulário
  form: { width: '100%' },
  campo: { marginBottom: 8 },
  label: {
    color: '#fff',
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    paddingHorizontal: 16,
  },
  senhaInput: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: 'Lexend_400Regular',
    color: paleta.ROXO,
    fontSize: 14,
  },
  olho: { padding: 4 },

  // Mensagem
  mensagem: {
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  mensagemSucesso: { backgroundColor: '#1a472a' },
  mensagemErro: { backgroundColor: '#7f1d1d' },
  mensagemTexto: { color: '#fff', fontFamily: 'Lexend_700Bold', fontSize: 14 },

  // Botões
  botaoSalvar: {
    marginTop: 24,
    backgroundColor: paleta.VERDE,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  botaoSalvarTexto: {
    color: '#1a1a1a',
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 15,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: paleta.VERMELHO + '55',
  },
  botaoSairTexto: {
    color: paleta.VERMELHO,
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
  },

  erroTexto: {
    color: '#ccc',
    fontFamily: 'Lexend_400Regular',
    textAlign: 'center',
    marginTop: 60,
  },
});