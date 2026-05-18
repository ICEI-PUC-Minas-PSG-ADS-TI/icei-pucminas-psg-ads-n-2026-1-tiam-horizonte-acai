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
import { useRouter, useLocalSearchParams } from 'expo-router';
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

export default function EditarClienteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    nome: string;
    cnpj: string;
    email: string;
    telefone: string;
  }>();

  const [nome, setNome] = useState(params.nome ?? '');
  const [cnpj, setCnpj] = useState(formatarCNPJ(params.cnpj ?? ''));
  const [email, setEmail] = useState(params.email ?? '');
  const [telefone, setTelefone] = useState(
    params.telefone ? formatarTelefone(params.telefone) : '',
  );
  const [salvando, setSalvando] = useState(false);

  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold });

  async function salvar() {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    const telefoneLimpo = telefone.replace(/\D/g, '');

    if (!nome.trim()) return Alert.alert('Atenção', 'O nome é obrigatório.');
    if (cnpjLimpo.length !== 14) return Alert.alert('Atenção', 'CNPJ inválido (14 dígitos).');

    setSalvando(true);
    try {
      // TODO: descomentar quando Supabase estiver configurado
      // const { error } = await supabase
      //   .from('Cliente')
      //   .update({
      //     nome: nome.trim(),
      //     cnpj: cnpjLimpo,
      //     email: email.trim() || null,
      //     telefone: telefoneLimpo || null,
      //   })
      //   .eq('id', params.id);
      // if (error) throw error;

      Alert.alert('Sucesso', 'Cliente atualizado!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível atualizar o cliente.');
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
            <Text style={styles.headerLinha1}>EDITAR</Text>
            <Text style={styles.headerLinha2}>CLIENTE</Text>
          </View>
        </View>

        {/* Campos */}
        <Text style={styles.label}>Nome do Cliente</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#aaa"
          />
          <Ionicons name="pencil" size={18} color="#aaa" style={styles.inputIcone} />
        </View>

        <Text style={styles.label}>CNPJ</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={cnpj}
            onChangeText={(v) => setCnpj(formatarCNPJ(v))}
            keyboardType="numeric"
            maxLength={18}
            placeholderTextColor="#aaa"
          />
          <Ionicons name="pencil" size={18} color="#aaa" style={styles.inputIcone} />
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          <Ionicons name="pencil" size={18} color="#aaa" style={styles.inputIcone} />
        </View>

        <Text style={styles.label}>Telefone</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={(v) => setTelefone(formatarTelefone(v))}
            keyboardType="numeric"
            maxLength={15}
            placeholderTextColor="#aaa"
          />
          <Ionicons name="pencil" size={18} color="#aaa" style={styles.inputIcone} />
        </View>

        {/* Botões */}
        <View style={styles.botoes}>
          <TouchableOpacity
            style={[styles.botao, styles.botaoSalvar]}
            onPress={salvar}
            disabled={salvando}
          >
            {salvando
              ? <ActivityIndicator color="#1a1a1a" />
              : <Text style={styles.botaoTextoSalvar}>Salvar</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botao, styles.botaoCancelar]}
            onPress={() => router.back()}
            disabled={salvando}
          >
            <Text style={styles.botaoTextoCancelar}>Cancelar</Text>
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
    paddingBottom: 24,
    gap: 16,
  },
  botaoVoltar: { padding: 4 },
  headerTituloContainer: { flex: 1, flexDirection: 'row', gap: 10 },
  headerLinha1: {
    fontSize: 26,
    fontFamily: 'Lexend_800ExtraBold',
    color: '#fff',
    letterSpacing: 3,
  },
  headerLinha2: {
    fontSize: 26,
    fontFamily: 'Lexend_800ExtraBold',
    color: VERDE,
    letterSpacing: 3,
  },

  label: {
    color: '#fff',
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: VERDE,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    color: '#222',
    fontFamily: 'Lexend_400Regular',
    fontSize: 15,
  },

  inputIcone: { marginLeft: 8 },

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
  botaoSalvar: { backgroundColor: VERDE },
  botaoCancelar: { backgroundColor: VERMELHO },
  botaoTextoSalvar: { color: '#1a1a1a', fontFamily: 'Lexend_800ExtraBold', fontSize: 14 },
  botaoTextoCancelar: { color: '#fff', fontFamily: 'Lexend_800ExtraBold', fontSize: 14 },
});
