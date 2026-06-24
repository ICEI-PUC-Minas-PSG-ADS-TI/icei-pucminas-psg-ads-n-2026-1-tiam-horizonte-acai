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
  Alert,
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

// ───────────────── Helpers ─────────────────

function formatarCNPJ(valor: string) {
  const nums = valor.replace(/\D/g, '').slice(0, 14);
  return nums
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function formatarTelefone(valor: string) {
  const nums = valor.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 10)
    return nums.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  return nums.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}

// ───────────────── Componente ─────────────────

export default function CadastrarClienteScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const timerMensagem = useRef<ReturnType<typeof setTimeout> | null>(null);

  function exibirMensagem(tipo: 'sucesso' | 'erro', texto: string) {
    if (timerMensagem.current) clearTimeout(timerMensagem.current);
    setMensagem({ tipo, texto });
    timerMensagem.current = setTimeout(() => setMensagem(null), 3000);
  }

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  async function cadastrar() {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    const telefoneLimpo = telefone.replace(/\D/g, '');

    if (!nome.trim()) {
      return exibirMensagem('erro', 'O nome é obrigatório.');
    }
    if (cnpjLimpo.length !== 14) {
      return exibirMensagem('erro', 'CNPJ inválido (14 dígitos).');
    }

    setSalvando(true);
    try {
      const { error } = await supabase
        .from('Cliente')
        .insert({
          nome: nome.trim(),
          cnpj: cnpjLimpo,
          email: email.trim() || null,
          telefone: telefoneLimpo || null,
        });

      if (error) throw error;

      exibirMensagem('sucesso', 'Cliente cadastrado com sucesso!');
      setTimeout(() => router.back(), 1500);
    } catch (e: any) {
      exibirMensagem('erro', e.message ?? 'Não foi possível cadastrar o cliente.');
    } finally {
      setSalvando(false);
    }
  }

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;
  }

  return (
  <ProtectedRoute
    permitidos={[
      'GESTOR',
      'VENDEDOR',
      'ADMINISTRADOR',
    ]}
  >
    <LinearGradient colors={[paleta.ROXO, '#2E1840', '#1A0E26']} style={styles.gradient}>
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
                <Text style={styles.headerLinha}>NOVO CLIENTE</Text>
              </View>

              <View style={{ width: 36 }} />
            </View>

            <Text style={styles.subtitulo}>
              Preencha os campos para efetuar o{'\n'}cadastro do novo cliente
            </Text>

            <View style={styles.cardFormulario}>
              <View style={styles.campo}>
                <Text style={styles.label}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome..."
                  placeholderTextColor="#999"
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>CNPJ *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="00.000.000/0000-00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={cnpj}
                  onChangeText={(v) => setCnpj(formatarCNPJ(v))}
                  maxLength={18}
                />
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o email..."
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={telefone}
                  onChangeText={(v) => setTelefone(formatarTelefone(v))}
                  maxLength={15}
                />
              </View>
            </View>

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
  </ProtectedRoute>
);
}

// ───────────────── Estilos ─────────────────

const styles = StyleSheet.create({
  gradient: { flex: 1 },
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