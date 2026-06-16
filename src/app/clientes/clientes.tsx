import ProtectedRoute from '@/components/ProtectedRoute';
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

interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  email: string | null;
  telefone: string | null;
  criado_em: string;
  compras?: number;
}

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

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function ClientesScreen() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtrados, setFiltrados] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold });

  async function buscarClientes() {
    setCarregando(true);
    // MOCK — substituir pela chamada real ao Supabase quando configurado
    const mock: Cliente[] = [
      { id: 1, nome: 'Frutos de Goiás', cnpj: '12345678000190', email: 'contato@frutos.com', telefone: '11999999999', criado_em: new Date().toISOString(), compras: 23 },
      { id: 2, nome: 'The Best Açaí', cnpj: '98765432000111', email: null, telefone: null, criado_em: new Date().toISOString(), compras: 11 },
      { id: 3, nome: 'Açaí da Maria', cnpj: '11122233000144', email: 'maria@acai.com', telefone: '31988887777', criado_em: new Date().toISOString(), compras: 35 },
    ];
    setClientes(mock);
    setFiltrados(mock);
    setCarregando(false);
  }

  useEffect(() => { buscarClientes(); }, []);

  useEffect(() => {
    const termo = busca.toLowerCase();
    setFiltrados(
      clientes.filter(
        (c) => c.nome.toLowerCase().includes(termo) || c.cnpj.includes(termo),
      ),
    );
  }, [busca, clientes]);

  function confirmarExclusao(cliente: Cliente) {
    Alert.alert(
      'Excluir cliente',
      `Deseja excluir "${cliente.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // TODO: supabase.from('Cliente').delete().eq('id', cliente.id)
            setClientes((prev) => prev.filter((c) => c.id !== cliente.id));
          },
        },
      ],
    );
  }

  function CardCliente({ item }: { item: Cliente }) {
    return (
      <ProtectedRoute
        permitidos={[
          'GESTOR',
          'VENDEDOR',
          'ADMINISTRADOR',
        ]}
      >
        <View style={styles.card}>
          <View style={styles.cardBorda} />
          <View style={styles.cardConteudo}>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardInfo}>CNPJ: {formatarCNPJ(item.cnpj)}</Text>
            <Text style={styles.cardCompras}>Compras: {item.compras ?? 0}</Text>
            <View style={styles.cardBotoes}>
              <TouchableOpacity
                style={[styles.botaoCard, styles.botaoEditar]}
                onPress={() =>
                  router.push({
                    pathname: '/editar-cliente' as any,
                    params: {
                      id: item.id,
                      nome: item.nome,
                      cnpj: item.cnpj,
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
                    `CNPJ: ${formatarCNPJ(item.cnpj)}\nEmail: ${item.email ?? '—'}\nTelefone: ${item.telefone ? formatarTelefone(item.telefone) : '—'}\nCadastrado em: ${new Date(item.criado_em).toLocaleDateString('pt-BR')}`,
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
      </ProtectedRoute>
    );
  }

  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} color="#4ade80" />;

  return (
    <ProtectedRoute
      permitidos={[
        'GESTOR',
        'VENDEDOR',
        'ADMINISTRADOR',
      ]}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="home" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>
            CLI<Text style={styles.headerDestaque}>ENTES</Text>
          </Text>
          <TouchableOpacity>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Busca */}
        <View style={styles.buscaContainer}>
          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar Cliente"
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
          <Ionicons name="search" size={20} color="#555" style={styles.buscaIcone} />
        </View>

        {/* Lista */}
        {carregando ? (
          <ActivityIndicator size="large" color="#4ade80" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CardCliente item={item} />}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
              <Text style={styles.vazio}>Nenhum cliente encontrado.</Text>
            }
          />
        )}

        {/* Botão Novo Cliente */}
        <TouchableOpacity
          style={styles.botaoNovo}
          onPress={() => router.push('/cadastrar-cliente' as any)}
        >
          <Text style={styles.botaoNovoTexto}>Novo Cliente  +</Text>
        </TouchableOpacity>
      </View>
    </ProtectedRoute>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const ROXO = '#46295A';
const VERDE = '#5EB85E';
const VERMELHO = '#e53e3e';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ROXO },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitulo: { fontSize: 24, fontFamily: 'Lexend_800ExtraBold', color: '#fff', letterSpacing: 2 },
  headerDestaque: { color: VERDE },

  buscaContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  buscaInput: { flex: 1, height: 44, color: '#333', fontSize: 15, fontFamily: 'Lexend_400Regular' },
  buscaIcone: { marginLeft: 4 },

  lista: { paddingHorizontal: 16, paddingBottom: 100 },
  vazio: { color: '#ccc', textAlign: 'center', marginTop: 40, fontFamily: 'Lexend_400Regular' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: VERDE,
  },
  cardBorda: { width: 0 }, // zera a barra lateral
  cardConteudo: { flex: 1, padding: 14 },
  cardNome: { fontSize: 17, fontFamily: 'Lexend_700Bold', color: '#222', marginBottom: 2 },
  cardCompras: { fontSize: 13, fontFamily: 'Lexend_400Regular', color: '#555', marginBottom: 10 },
  cardInfo: { fontSize: 13, fontFamily: 'Lexend_400Regular', color: '#555', marginBottom: 2 },
  cardBotoes: { flexDirection: 'row', gap: 8 },
  botaoCard: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 6 },
  botaoCardTexto: { color: '#fff', fontFamily: 'Lexend_700Bold', fontSize: 12 },
  botaoEditar: { backgroundColor: ROXO },
  botaoVerMais: { backgroundColor: VERDE },
  botaoExcluir: { backgroundColor: VERMELHO },

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
  botaoNovoTexto: { color: '#1a1a1a', fontFamily: 'Lexend_800ExtraBold', fontSize: 15 },
});
