import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts, Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold } from '@expo-google-fonts/lexend';
// import { supabase } from '../../lib/supabase';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Colaborador {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  email: string | null;
  telefone: string | null;
  criado_em: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarCPF(valor: string) {
  const nums = valor.replace(/\D/g, '').slice(0, 11);
  return nums
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function formatarTelefone(valor: string) {
  const nums = valor.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 10)
    return nums.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  return nums.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function ColaboradoresScreen() {
  const router = useRouter();
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [filtrados, setFiltrados] = useState<Colaborador[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold });

  async function buscarColaboradores() {
    setCarregando(true);
    // MOCK — substituir pela chamada real ao Supabase quando configurado
    const mock: Colaborador[] = [
      { id: 1, nome: 'Ana Paula Silva', cpf: '12345678901', cargo: 'Vendedora', email: 'ana@horizonte.com', telefone: '31999990001', criado_em: new Date().toISOString() },
      { id: 2, nome: 'Carlos Mendes', cpf: '98765432100', cargo: 'Gerente', email: null, telefone: '31999990002', criado_em: new Date().toISOString() },
      { id: 3, nome: 'Fernanda Costa', cpf: '11122233344', cargo: 'Caixa', email: 'fernanda@horizonte.com', telefone: null, criado_em: new Date().toISOString() },
    ];
    setColaboradores(mock);
    setFiltrados(mock);
    setCarregando(false);
  }

  useEffect(() => { buscarColaboradores(); }, []);

  useEffect(() => {
    const termo = busca.toLowerCase();
    setFiltrados(
      colaboradores.filter(
        (c) => c.nome.toLowerCase().includes(termo) || c.cargo.toLowerCase().includes(termo),
      ),
    );
  }, [busca, colaboradores]);

  function confirmarExclusao(colaborador: Colaborador) {
    Alert.alert(
      'Excluir colaborador',
      `Deseja excluir "${colaborador.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // TODO: supabase.from('Colaborador').delete().eq('id', colaborador.id)
            setColaboradores((prev) => prev.filter((c) => c.id !== colaborador.id));
          },
        },
      ],
    );
  }

  function CardColaborador({ item }: { item: Colaborador }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardConteudo}>
          {/* Avatar inicial */}
          <View style={styles.avatar}>
            <Text style={styles.avatarLetra}>{item.nome.charAt(0)}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardCargo}>{item.cargo}</Text>
            <Text style={styles.cardInfo}>CPF: {formatarCPF(item.cpf)}</Text>

            <View style={styles.cardBotoes}>
              <TouchableOpacity
                style={[styles.botaoCard, styles.botaoEditar]}
                onPress={() =>
                  router.push({
                    pathname: '/colaboradores/editar-colaborador' as any,
                    params: {
                      id: item.id,
                      nome: item.nome,
                      cpf: item.cpf,
                      cargo: item.cargo,
                      email: item.email ?? '',
                      telefone: item.telefone ?? '',
                    },
                  })
                }
              >
                <Text style={styles.botaoCardTexto}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoCard, styles.botaoVerMais]}
                onPress={() =>
                  Alert.alert(
                    item.nome,
                    `Cargo: ${item.cargo}\nCPF: ${formatarCPF(item.cpf)}\nEmail: ${item.email ?? '—'}\nTelefone: ${item.telefone ? formatarTelefone(item.telefone) : '—'}\nCadastrado em: ${new Date(item.criado_em).toLocaleDateString('pt-BR')}`,
                  )
                }
              >
                <Text style={[styles.botaoCardTexto, { color: '#1a1a1a' }]}>Ver Mais</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoCard, styles.botaoExcluir]}
                onPress={() => confirmarExclusao(item)}
              >
                <Text style={styles.botaoCardTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} color={VERDE} />;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="home" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>
          COLA<Text style={styles.headerDestaque}>BORADORES</Text>
        </Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={styles.buscaContainer}>
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar por nome ou cargo"
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />
        <Ionicons name="search" size={20} color="#555" style={styles.buscaIcone} />
      </View>

      {/* Lista */}
      {carregando ? (
        <ActivityIndicator size="large" color={VERDE} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardColaborador item={item} />}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum colaborador encontrado.</Text>
          }
        />
      )}

      {/* Botão Novo Colaborador */}
      <TouchableOpacity
        style={styles.botaoNovo}
        onPress={() => router.push('/colaboradores/cadastrar-colaborador' as any)}
      >
        <Text style={styles.botaoNovoTexto}>Novo Colaborador  +</Text>
      </TouchableOpacity>

    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const ROXO = '#46295A';
const VERDE = '#5EB85E';
const VERMELHO = '#e53e3e';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ROXO },

  // Header
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
    color: '#fff',
    letterSpacing: 2,
  },
  headerDestaque: { color: VERDE },

  // Busca
  buscaContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  buscaInput: {
    flex: 1,
    height: 44,
    color: '#333',
    fontSize: 15,
    fontFamily: 'Lexend_400Regular',
  },
  buscaIcone: { marginLeft: 4 },

  // Lista
  lista: { paddingHorizontal: 16, paddingBottom: 100 },
  vazio: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Lexend_400Regular',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: VERDE,
  },
  cardConteudo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ROXO,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  avatarLetra: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Lexend_700Bold',
  },
  cardNome: {
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    color: '#222',
    marginBottom: 2,
  },
  cardCargo: {
    fontSize: 13,
    fontFamily: 'Lexend_700Bold',
    color: VERDE,
    marginBottom: 2,
  },
  cardInfo: {
    fontSize: 13,
    fontFamily: 'Lexend_400Regular',
    color: '#555',
    marginBottom: 10,
  },
  cardBotoes: { flexDirection: 'row', gap: 8 },
  botaoCard: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 6 },
  botaoCardTexto: { color: '#fff', fontFamily: 'Lexend_700Bold', fontSize: 12 },
  botaoEditar: { backgroundColor: ROXO },
  botaoVerMais: { backgroundColor: VERDE },
  botaoExcluir: { backgroundColor: VERMELHO },

  // Botão flutuante
  botaoNovo: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    backgroundColor: VERDE,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoNovoTexto: {
    color: '#1a1a1a',
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 15,
  },
});