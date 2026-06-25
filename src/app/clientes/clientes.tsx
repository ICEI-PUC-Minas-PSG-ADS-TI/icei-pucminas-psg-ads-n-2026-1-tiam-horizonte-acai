import ProtectedRoute from '@/components/ProtectedRoute';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFonts, Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold } from '@expo-google-fonts/lexend';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { paleta } from '@/constants/theme';
import { pageGradientProps } from '@/constants/theme';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  email: string | null;
  telefone: string | null;
  criado_em: string;
  compras: number;
}

interface ClienteResumo {
  cliente: Cliente;
  totalGasto: number;
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
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [resumo, setResumo] = useState<ClienteResumo | null>(null);
  const [carregandoResumo, setCarregandoResumo] = useState(false);

  // ── Hooks (todos antes de qualquer return condicional) ──
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold });

  useFocusEffect(
    useCallback(() => {
      buscarClientes();
    }, [])
  );

  useEffect(() => {
    const termo = busca.toLowerCase();
    setFiltrados(
      clientes.filter(
        (c) => c.nome.toLowerCase().includes(termo) || c.cnpj.includes(termo),
      ),
    );
  }, [busca, clientes]);

  // ── Funções ──

  async function buscarClientes() {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('Cliente')
        .select(`
          id,
          nome,
          cnpj,
          email,
          telefone,
          criado_em,
          Venda(count)
        `)
        .order('nome', { ascending: true });

      if (error) throw error;

      const lista: Cliente[] = (data ?? []).map((c: any) => ({
        id: c.id,
        nome: c.nome,
        cnpj: c.cnpj,
        email: c.email,
        telefone: c.telefone,
        criado_em: c.criado_em,
        compras: c.Venda?.[0]?.count ?? 0,
      }));

      setClientes(lista);
      setFiltrados(lista);
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível carregar os clientes.');
    } finally {
      setCarregando(false);
    }
  }

  async function excluirCliente() {
    if (!clienteParaExcluir) return;
    setExcluindo(true);
    try {
      const { error } = await supabase
        .from('Cliente')
        .delete()
        .eq('id', clienteParaExcluir.id);

      if (error) throw error;

      setClientes((prev) => prev.filter((c) => c.id !== clienteParaExcluir.id));
      setClienteParaExcluir(null);
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível excluir o cliente.');
    } finally {
      setExcluindo(false);
    }
  }

  async function abrirResumo(cliente: Cliente) {
    setCarregandoResumo(true);
    setResumo({ cliente, totalGasto: 0 });
    try {
      const { data, error } = await supabase
        .from('Venda')
        .select('valor_total')
        .eq('id_cliente', cliente.id);

      if (error) throw error;

      const total = (data ?? []).reduce(
        (acc: number, v: any) => acc + (parseFloat(v.valor_total) || 0),
        0,
      );

      setResumo({ cliente, totalGasto: total });
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível carregar o resumo.');
      setResumo(null);
    } finally {
      setCarregandoResumo(false);
    }
  }

  // ── Guard após todos os hooks ──
  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} color="#4ade80" />;

  // ── Sub-componente (definido dentro do escopo para acessar funções) ──
  function CardCliente({ item }: { item: Cliente }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardConteudo}>
          <Text style={styles.cardNome}>{item.nome}</Text>
          <Text style={styles.cardInfo}>CNPJ: {formatarCNPJ(item.cnpj)}</Text>
          <Text style={styles.cardCompras}>Compras: {item.compras}</Text>

          <View style={styles.cardBotoes}>
            <TouchableOpacity
              style={[styles.botaoCard, styles.botaoEditar]}
              onPress={() =>
                router.push({
                  pathname: '/clientes/editar-cliente' as any,
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
              onPress={() => abrirResumo(item)}
            >
              <Text
                style={[
                  styles.botaoCardTexto,
                  { color: '#1a1a1a' },
                ]}
              >
                Ver Mais
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoCard, styles.botaoExcluir]}
              onPress={() => setClienteParaExcluir(item)}
            >
              <Text style={styles.botaoCardTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ProtectedRoute
      permitidos={[
        'GESTOR',
        'VENDEDOR',
        'ADMINISTRADOR',
      ]}
    >
      <LinearGradient {...pageGradientProps()} style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/' as any)}>
            <Ionicons name="home" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitulo}>CLIENTES</Text>

           <TouchableOpacity onPress={() => router.push('/clientes/ranking-cliente' as any)}>
              <Ionicons name="bar-chart-outline" size={26} color={paleta.VERDE} />
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
          <Ionicons
            name="search"
            size={20}
            color="#555"
            style={styles.buscaIcone}
          />
        </View>

        {/* Lista */}
        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#4ade80"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={filtrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CardCliente item={item} />}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
              <Text style={styles.vazio}>
                Nenhum cliente encontrado.
              </Text>
            }
          />
        )}

        {/* Botão Novo Cliente */}
        <TouchableOpacity
          style={styles.botaoNovo}
          onPress={() => router.push('/clientes/cadastrar-cliente' as any)}
        >
          <Text style={styles.botaoNovoTexto}>
            Novo Cliente +
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.footerLine} />
        </View>

        {/* Modal Perfil */}
        <Modal
          visible={!!resumo}
          transparent
          animationType="slide"
          onRequestClose={() => setResumo(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.perfilBox}>
              <View style={styles.perfilHeader}>
                <View style={styles.perfilIcone}>
                  <Ionicons
                    name="storefront"
                    size={28}
                    color="#fff"
                  />
                </View>

                <Text
                  style={styles.perfilNome}
                  numberOfLines={2}
                >
                  {resumo?.cliente.nome}
                </Text>

                <TouchableOpacity
                  style={styles.perfilFechar}
                  onPress={() => setResumo(null)}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.perfilCorpo}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.perfilSecao}>
                  DADOS CADASTRAIS
                </Text>

                <View style={styles.perfilLinha}>
                  <Ionicons
                    name="card-outline"
                    size={16}
                    color={paleta.VERDE}
                    style={styles.perfilLinhaIcone}
                  />
                  <Text style={styles.perfilLinhaLabel}>
                    CNPJ
                  </Text>
                  <Text style={styles.perfilLinhaValor}>
                    {formatarCNPJ(resumo?.cliente.cnpj ?? '')}
                  </Text>
                </View>

                <View style={styles.perfilDivisor} />

                <View style={styles.perfilLinha}>
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={paleta.VERDE}
                    style={styles.perfilLinhaIcone}
                  />
                  <Text style={styles.perfilLinhaLabel}>
                    Email
                  </Text>
                  <Text style={styles.perfilLinhaValor}>
                    {resumo?.cliente.email ?? '—'}
                  </Text>
                </View>

                <View style={styles.perfilDivisor} />

                <View style={styles.perfilLinha}>
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color={paleta.VERDE}
                    style={styles.perfilLinhaIcone}
                  />
                  <Text style={styles.perfilLinhaLabel}>
                    Telefone
                  </Text>
                  <Text style={styles.perfilLinhaValor}>
                    {resumo?.cliente.telefone
                      ? formatarTelefone(resumo.cliente.telefone)
                      : '—'}
                  </Text>
                </View>

                <View style={styles.perfilDivisor} />

                <View style={styles.perfilLinha}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={paleta.VERDE}
                    style={styles.perfilLinhaIcone}
                  />
                  <Text style={styles.perfilLinhaLabel}>
                    Cliente desde
                  </Text>
                  <Text style={styles.perfilLinhaValor}>
                    {resumo?.cliente.criado_em
                      ? new Date(
                          resumo.cliente.criado_em
                        ).toLocaleDateString('pt-BR')
                      : '—'}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.perfilSecao,
                    { marginTop: 24 },
                  ]}
                >
                  RESUMO DE COMPRAS
                </Text>

                {carregandoResumo ? (
                  <ActivityIndicator
                    color={paleta.VERDE}
                    style={{ marginVertical: 16 }}
                  />
                ) : (
                  <View style={styles.perfilStats}>
                    <View style={styles.perfilStatCard}>
                      <Ionicons
                        name="bag-handle-outline"
                        size={22}
                        color={paleta.VERDE}
                      />
                      <Text style={styles.perfilStatValor}>
                        {resumo?.cliente.compras ?? 0}
                      </Text>
                      <Text style={styles.perfilStatLabel}>
                        compras
                      </Text>
                    </View>

                    <View style={styles.perfilStatDivisor} />

                    <View style={styles.perfilStatCard}>
                      <Ionicons
                        name="cash-outline"
                        size={22}
                        color={paleta.VERDE}
                      />
                      <Text style={styles.perfilStatValor}>
                        {(resumo?.totalGasto ?? 0).toLocaleString(
                          'pt-BR',
                          {
                            style: 'currency',
                            currency: 'BRL',
                          }
                        )}
                      </Text>
                      <Text style={styles.perfilStatLabel}>
                        total gasto
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.perfilBotaoFechar}
                onPress={() => setResumo(null)}
              >
                <Text style={styles.perfilBotaoFecharTexto}>
                  Fechar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Exclusão */}
        <Modal
          visible={!!clienteParaExcluir}
          transparent
          animationType="fade"
          onRequestClose={() => setClienteParaExcluir(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalIcone}>
                <Ionicons
                  name="trash"
                  size={32}
                  color="#fff"
                />
              </View>

              <Text style={styles.modalTitulo}>
                Excluir cliente
              </Text>

              <Text style={styles.modalTexto}>
                Tem certeza que deseja apagar{'\n'}
                <Text style={styles.modalNome}>
                  "{clienteParaExcluir?.nome}"
                </Text>
                ?{'\n'}
                Esta ação não pode ser desfeita.
              </Text>

              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={[
                    styles.modalBotao,
                    styles.modalBotaoCancelar,
                  ]}
                  onPress={() => setClienteParaExcluir(null)}
                  disabled={excluindo}
                >
                  <Text style={styles.modalBotaoTextoCancelar}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalBotao,
                    styles.modalBotaoExcluir,
                  ]}
                  onPress={excluirCliente}
                  disabled={excluindo}
                >
                  {excluindo ? (
                    <ActivityIndicator
                      color="#fff"
                      size="small"
                    />
                  ) : (
                    <Text style={styles.modalBotaoTextoExcluir}>
                      Sim, excluir
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </LinearGradient>
    </ProtectedRoute>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitulo: { fontSize: 32, fontFamily: 'Lexend_800ExtraBold', color: paleta.VERDE, letterSpacing: 2 },

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
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: paleta.VERDE,
  },
  cardConteudo: { flex: 1, padding: 14 },
  cardNome: { fontSize: 17, fontFamily: 'Lexend_700Bold', color: '#222', marginBottom: 2 },
  cardInfo: { fontSize: 13, fontFamily: 'Lexend_400Regular', color: '#555', marginBottom: 2 },
  cardCompras: { fontSize: 13, fontFamily: 'Lexend_400Regular', color: '#555', marginBottom: 10 },
  cardBotoes: { flexDirection: 'row', gap: 8 },
  botaoCard: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 6 },
  botaoCardTexto: { color: '#fff', fontFamily: 'Lexend_700Bold', fontSize: 12 },
  botaoEditar: { backgroundColor: paleta.ROXO },
  botaoVerMais: { backgroundColor: paleta.VERDE },
  botaoExcluir: { backgroundColor: paleta.VERMELHO },

  botaoNovo: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    backgroundColor: paleta.VERDE,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 10,
  },
  botaoNovoTexto: { color: '#1a1a1a', fontFamily: 'Lexend_800ExtraBold', fontSize: 15 },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 24,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // ─── Modal Perfil ───
  perfilBox: {
    width: '100%',
    backgroundColor: '#1a0e26',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  perfilHeader: {
    backgroundColor: paleta.ROXO,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  perfilIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: paleta.VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfilNome: {
    flex: 1,
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 18,
    color: '#fff',
    letterSpacing: 0.5,
  },
  perfilFechar: {
    padding: 4,
  },
  perfilCorpo: {
    padding: 20,
  },
  perfilSecao: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 11,
    color: paleta.VERDE,
    letterSpacing: 2,
    marginBottom: 14,
  },
  perfilLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  perfilLinhaIcone: {
    width: 20,
  },
  perfilLinhaLabel: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 13,
    color: '#aaa',
    width: 90,
  },
  perfilLinhaValor: {
    flex: 1,
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: '#fff',
    textAlign: 'right',
  },
  perfilDivisor: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: 8,
  },
  perfilStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(94,184,94,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(94,184,94,0.25)',
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  perfilStatCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  perfilStatDivisor: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  perfilStatValor: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 18,
    color: '#fff',
  },
  perfilStatLabel: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: '#aaa',
  },
  perfilBotaoFechar: {
    margin: 20,
    marginTop: 8,
    backgroundColor: paleta.ROXO,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: paleta.VERDE,
  },
  perfilBotaoFecharTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#fff',
  },

  // ─── Modal Exclusão ───
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#1a0e26',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: paleta.VERMELHO,
    padding: 28,
    alignItems: 'center',
  },
  modalIcone: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: paleta.VERMELHO,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitulo: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 1,
  },
  modalTexto: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalNome: {
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBotao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBotaoCancelar: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#555',
  },
  modalBotaoExcluir: {
    backgroundColor: paleta.VERMELHO,
  },
  modalBotaoTextoCancelar: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#aaa',
  },
  modalBotaoTextoExcluir: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#fff',
  },
});