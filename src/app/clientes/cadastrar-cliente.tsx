import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold } from '@expo-google-fonts/lexend';
// import { supabase } from '../../lib/supabase';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Componente ───────────────────────────────────────────────────────────────

export default function CadastrarClienteScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold });

  async function cadastrar() {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    const telefoneLimpo = telefone.replace(/\D/g, '');

    if (!nome.trim()) return Alert.alert('Atenção', 'O nome é obrigatório.');
    if (cnpjLimpo.length !== 14) return Alert.alert('Atenção', 'CNPJ inválido (14 dígitos).');

    setSalvando(true);
    try {
      // TODO: descomentar quando Supabase estiver configurado
      // const { error } = await supabase.from('Cliente').insert({
      //   nome: nome.trim(),
      //   cnpj: cnpjLimpo,
      //   email: email.trim() || null,
      //   telefone: telefoneLimpo || null,
      // });
      // if (error) throw error;

      Alert.alert('Sucesso', 'Cliente cadastrado!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível cadastrar o cliente.');
    } finally {
      setSalvando(false);
    }
  }

  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} color="#4ade80" />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTituloContainer}>
            <Text style={styles.headerLinha1}>NOVO</Text>
            <Text style={styles.headerLinha2}>CLIENTE</Text>
          </View>
        </View>

        <Text style={styles.subtitulo}>
          Preencha os campos para efetuar o{'\n'}cadastro do novo Cliente
        </Text>

        {/* Campos */}
        <Text style={styles.label}>Nome*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome..."
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>CNPJ*</Text>
        <TextInput
          style={styles.input}
          placeholder="00.000.000/0000-00"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={cnpj}
          onChangeText={(v) => setCnpj(formatarCNPJ(v))}
          maxLength={18}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o email..."
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 00000-0000"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={telefone}
          onChangeText={(v) => setTelefone(formatarTelefone(v))}
          maxLength={15}
        />

        {/* Botões */}
        <View style={styles.botoes}>
          <TouchableOpacity
            style={[styles.botao, styles.botaoCadastrar]}
            onPress={cadastrar}
            disabled={salvando}
          >
            {salvando
              ? <ActivityIndicator color="#1a1a1a" />
              : <Text style={styles.botaoTextoCadastrar}>CADASTRAR</Text>
            }
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
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const ROXO = '#46295A';
const VERDE = '#5EB85E';
const VERMELHO = '#c0392b';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ROXO },
  conteudo: { paddingHorizontal: 24, paddingBottom: 48 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 8,
    gap: 16,
  },
  botaoVoltar: { padding: 4 },
  headerTituloContainer: { flex: 1, alignItems: 'center' },
  headerLinha1: {
    fontSize: 26,
    fontFamily: 'Lexend_800ExtraBold',
    color: '#fff',
    letterSpacing: 3,
    lineHeight: 30,
  },
  headerLinha2: {
    fontSize: 26,
    fontFamily: 'Lexend_800ExtraBold',
    color: VERDE,
    letterSpacing: 3,
    lineHeight: 30,
  },

  subtitulo: {
    color: '#ddd',
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 8,
    lineHeight: 20,
  },

  label: {
    color: '#fff',
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: VERDE,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
  },

  botoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 36,
  },
  botao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoCadastrar: { backgroundColor: VERDE },
  botaoCancelar: { backgroundColor: VERMELHO },
  botaoTextoCadastrar: { color: '#1a1a1a', fontFamily: 'Lexend_800ExtraBold', fontSize: 14 },
  botaoTextoCancelar: { color: '#fff', fontFamily: 'Lexend_800ExtraBold', fontSize: 14 },
});
