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
// import { supabase } from '../../lib/supabase';

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

  if (nums.length <= 10) {
    return nums.replace(
      /^(\d{2})(\d{4})(\d{0,4})/,
      '($1) $2-$3'
    );
  }

  return nums.replace(
    /^(\d{2})(\d{5})(\d{0,4})/,
    '($1) $2-$3'
  );
}

// ───────────────── Componente ─────────────────

export default function CadastrarClienteScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  async function cadastrar() {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    const telefoneLimpo = telefone.replace(/\D/g, '');

    if (!nome.trim()) {
      return Alert.alert('Atenção', 'O nome é obrigatório.');
    }

    if (cnpjLimpo.length !== 14) {
      return Alert.alert(
        'Atenção',
        'CNPJ inválido (14 dígitos).'
      );
    }

    setSalvando(true);

    try {
      // const { error } = await supabase
      //   .from('Cliente')
      //   .insert({
      //     nome: nome.trim(),
      //     cnpj: cnpjLimpo,
      //     email: email.trim() || null,
      //     telefone: telefoneLimpo || null,
      //   });

      // if (error) throw error;

      Alert.alert('Sucesso', 'Cliente cadastrado!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (e: any) {
      Alert.alert(
        'Erro',
        e.message ??
          'Não foi possível cadastrar o cliente.'
      );
    } finally {
      setSalvando(false);
    }
  }

  if (!fontsLoaded) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        color={VERDE}
      />
    );
  }

  return (
    <LinearGradient
      colors={[ROXO, '#2E1840', '#1A0E26']}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
        >
          <ScrollView
            contentContainerStyle={styles.conteudo}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => router.back()}
              >
                <View style={styles.avatarCircle}>
                  <Ionicons
                    name="arrow-back-outline"
                    size={22}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.headerTituloContainer}>
                <Text style={styles.headerLinha}>
                  NOVO CLIENTE
                </Text>
              </View>
              <View style={{ width: 36 }} />
            </View>

            <Text style={styles.subtitulo}>
              Preencha os campos para efetuar o{'\n'}
              cadastro do novo cliente
            </Text>

            {/* Card do formulário */}
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
              <Text style={styles.label}>CNPJ*</Text>
              <TextInput
              style={styles.input}
              placeholder="Digite o CNPJ..."
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={cnpj}
              onChangeText={(v) => setCnpj(formatarCNPJ(v))}
              maxLength={18}
            />
            </View>

            <View style={styles.campo}>
            <Text style={styles.label}>Email*</Text>
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
            <Text style={styles.label}>Telefone*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o telefone..."
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={telefone}
              onChangeText={(v) => setTelefone(formatarTelefone(v))}
              maxLength={15}
            />
            </View>

          </View>

            {/* Botões */}
            <View style={styles.botoes}>
              <TouchableOpacity
                style={[
                  styles.botao,
                  styles.botaoCadastrar,
                ]}
                onPress={cadastrar}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator
                    color="#1a1a1a"
                  />
                ) : (
                  <Text
                    style={
                      styles.botaoTextoCadastrar
                    }
                  >
                    CADASTRAR
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.botao,
                  styles.botaoCancelar,
                ]}
                onPress={() => router.back()}
                disabled={salvando}
              >
                <Text
                  style={
                    styles.botaoTextoCancelar
                  }
                >
                  CANCELAR
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ───────────────── Estilos ─────────────────

const ROXO = '#46295A';
const VERDE = '#5EB85E';
const VERMELHO = '#C0392B';

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },

  conteudo: {
    flexGrow: 1,
    paddingBottom: 48,
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
  },

  iconBtn: {
    marginLeft : 10,
    padding: 4,
  },

  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTituloContainer: {
    alignItems: 'center',
  },

  headerLinha: {
    color: VERDE,
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

  cardFormulario: {
    width: '85%',
    alignSelf: 'center',
  },

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
    borderColor: VERDE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Lexend_400Regular',
    color: ROXO,
    marginBottom: 16,
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

  botaoCadastrar: {
    backgroundColor: VERDE,
  },

  botaoCancelar: {
    backgroundColor: VERMELHO,
  },

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
  campo: {
    marginBottom: 10,
  },
});