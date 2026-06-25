import ProtectedRoute from '@/components/ProtectedRoute';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from '@expo-google-fonts/lexend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { paleta } from '@/constants/theme';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  quantidade: number;
  categoria: string | null;
  tipo: 'Venda' | 'Interno';
}

type TipoMovimentacao = 'ADICIONAR' | 'RETIRAR';

const MOTIVOS = [
  'Uso / Consumo Interno',
  'Produto Danificado / Avaria',
  'Validade Vencida',
  'Outros Motivos',
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ProdutosScreen() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [tipoFuncionario, setTipoFuncionario] = useState('');

  // Modal exclusão
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  // Modal movimentação
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<TipoMovimentacao>('ADICIONAR');
  const [qtdMovimentar, setQtdMovimentar] = useState('');
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [motivoIdx, setMotivoIdx] = useState(0);
  const [modalMotivoAberto, setModalMotivoAberto] = useState(false);
  const [salvandoMov, setSalvandoMov] = useState(false);

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  // ── Permissões ──
  const eAdmOuGestor = tipoFuncionario === 'ADMINISTRADOR' || tipoFuncionario === 'GESTOR';
  const podeGerenciar = eAdmOuGestor || tipoFuncionario === 'ESTOQUISTA';
  const ehVendedor = tipoFuncionario === 'VENDEDOR';

  useFocusEffect(
    useCallback(() => {
      async function init() {
        const tipo = await AsyncStorage.getItem('tipoFuncionario');
        setTipoFuncionario(tipo ?? '');
        await buscarProdutos();
      }
      init();
    }, [])
  );

  async function buscarProdutos() {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome', { ascending: true });
      if (error) throw error;
      setProdutos(data ?? []);
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível carregar os produtos.');
    } finally {
      setCarregando(false);
    }
  }

  async function excluirProduto() {
    if (!produtoParaExcluir) return;
    setExcluindo(true);
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', produtoParaExcluir.id);
      if (error) throw error;
      setProdutos(prev => prev.filter(p => p.id !== produtoParaExcluir.id));
      setProdutoParaExcluir(null);
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível excluir o produto.');
    } finally {
      setExcluindo(false);
    }
  }

  async function handleMovimentacao() {
    const qtd = Number(qtdMovimentar);
    if (!qtdMovimentar || isNaN(qtd) || qtd <= 0) {
      Alert.alert('Atenção', 'Digite uma quantidade válida maior que zero.');
      return;
    }

    const estoqueAtual = Number(produtoSelecionado?.quantidade ?? 0);

    if (tipoMovimentacao === 'RETIRAR' && qtd > estoqueAtual) {
      Alert.alert('Atenção', 'Quantidade maior do que o saldo em estoque.');
      return;
    }

    const novoEstoque =
      tipoMovimentacao === 'ADICIONAR' ? estoqueAtual + qtd : estoqueAtual - qtd;

    setSalvandoMov(true);
    try {
      const { error: erroEstoque } = await supabase
        .from('produtos')
        .update({ quantidade: novoEstoque })
        .eq('id', produtoSelecionado!.id);
      if (erroEstoque) throw erroEstoque;

      await supabase.from('historico_movimentacoes').insert([{
        produto_id: produtoSelecionado!.id,
        nome_produto: produtoSelecionado!.nome,
        tipo: tipoMovimentacao,
        quantidade: qtd,
        motivo: tipoMovimentacao === 'ADICIONAR' ? 'Reposição/Entrada' : motivo,
        data_registro: new Date().toLocaleDateString('pt-BR'),
      }]);

      setProdutoSelecionado(null);
      setQtdMovimentar('');
      setMotivo(MOTIVOS[0]);
      setMotivoIdx(0);
      await buscarProdutos();
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível atualizar o estoque.');
    } finally {
      setSalvandoMov(false);
    }
  }

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;
  }

  const produtosFiltrados = produtos.filter(p => {
    const bate = p.nome?.toLowerCase().includes(busca.toLowerCase());
    return ehVendedor ? bate && p.tipo === 'Venda' : bate;
  });

  // ── Card de produto ──
  function CardProduto({ item }: { item: Produto }) {
    const qtd = Number(item.quantidade ?? 0);
    const baixo = qtd <= 10;

    return (
      <View style={styles.card}>
        <View style={styles.cardTopo}>
          <Text style={styles.cardNome}>{item.nome}</Text>
          <View style={[styles.badgeStatus, { backgroundColor: baixo ? paleta.VERMELHO : paleta.VERDE }]}>
            <Text style={styles.badgeTexto}>{baixo ? 'Baixo' : 'OK'}</Text>
          </View>
        </View>

        <View style={styles.cardEstoqueRow}>
          <Ionicons name="layers-outline" size={14} color="#666" />
          <Text style={styles.cardEstoqueTexto}>{qtd} unidades em estoque</Text>
        </View>

        {item.categoria ? (
          <View style={styles.cardEstoqueRow}>
            <Ionicons name="grid-outline" size={14} color="#666" />
            <Text style={styles.cardEstoqueTexto}>{item.categoria}</Text>
          </View>
        ) : null}

        <View style={styles.cardBotoes}>
          {podeGerenciar && (
            <TouchableOpacity
              style={[styles.botaoCard, styles.botaoMover]}
              onPress={() => {
                setProdutoSelecionado(item);
                setTipoMovimentacao('ADICIONAR');
                setQtdMovimentar('');
              }}
            >
              <Text style={[styles.botaoCardTexto, { color: paleta.ROXO }]}>Qtd +/-</Text>
            </TouchableOpacity>
          )}

          {podeGerenciar && (
            <TouchableOpacity
              style={[styles.botaoCard, styles.botaoEditar]}
              onPress={() => router.push({ pathname: '/produto/editar-produto' as any, params: { id: item.id } })}
            >
              <Text style={styles.botaoCardTexto}>Editar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.botaoCard, styles.botaoVerMais]}
            onPress={() => router.push({ pathname: '/produto/detalhes-produtos' as any, params: { id: item.id } })}
          >
            <Text style={[styles.botaoCardTexto, { color: '#1a1a1a' }]}>Ver Mais</Text>
          </TouchableOpacity>

          {podeGerenciar && (
            <TouchableOpacity
              style={[styles.botaoCard, styles.botaoExcluir]}
              onPress={() => setProdutoParaExcluir(item)}
            >
              <Text style={styles.botaoCardTexto}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <ProtectedRoute permitidos={['ADMINISTRADOR', 'GESTOR', 'ESTOQUISTA', 'VENDEDOR']}>
      <LinearGradient colors={[paleta.ROXO, '#2E1840', '#1A0E26']} style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/' as any)}>
            <Ionicons name="home" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>PRODUTOS</Text>
          {eAdmOuGestor ? (
            <TouchableOpacity onPress={() => router.push('/produto/relatorio-produtos' as any)}>
              <Ionicons name="bar-chart-outline" size={26} color={paleta.VERDE} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 26 }} />
          )}
        </View>

        {/* Busca */}
        <View style={styles.buscaContainer}>
          <Ionicons name="search" size={18} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar produto..."
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Lista */}
        {carregando ? (
          <ActivityIndicator size="large" color={paleta.VERDE} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={produtosFiltrados}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <CardProduto item={item} />}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
            }
          />
        )}

        {/* Botão novo */}
        {podeGerenciar && (
          <TouchableOpacity
            style={styles.botaoNovo}
            onPress={() => router.push('/produto/novo-produto' as any)}
          >
            <Text style={styles.botaoNovoTexto}>Novo Produto +</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <View style={styles.footerLine} />
        </View>

        {/* ── Modal Movimentação ─────────────────────────────── */}
        <Modal
          visible={!!produtoSelecionado}
          transparent
          animationType="slide"
          onRequestClose={() => setProdutoSelecionado(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>

              <View style={styles.modalHeaderRow}>
                <View style={[styles.modalIcone, { backgroundColor: tipoMovimentacao === 'ADICIONAR' ? paleta.VERDE : paleta.VERMELHO }]}>
                  <Ionicons
                    name={tipoMovimentacao === 'ADICIONAR' ? 'add' : 'remove'}
                    size={28}
                    color="#fff"
                  />
                </View>
                <TouchableOpacity onPress={() => setProdutoSelecionado(null)} style={{ marginLeft: 'auto' }}>
                  <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitulo}>Movimentar Estoque</Text>
              <Text style={styles.modalSubtitulo}>
                {produtoSelecionado?.nome}
                {'  ·  '}
                <Text style={{ color: paleta.VERDE }}>{produtoSelecionado?.quantidade ?? 0} und</Text>
              </Text>

              {/* Selector Adicionar / Retirar */}
              <View style={styles.selectorContainer}>
                <TouchableOpacity
                  style={[styles.selectorBtn, tipoMovimentacao === 'ADICIONAR' && styles.selectorBtnVerde]}
                  onPress={() => setTipoMovimentacao('ADICIONAR')}
                >
                  <Ionicons name="add-circle-outline" size={15} color={tipoMovimentacao === 'ADICIONAR' ? paleta.ROXO : '#888'} style={{ marginRight: 4 }} />
                  <Text style={[styles.selectorTexto, tipoMovimentacao === 'ADICIONAR' && styles.selectorTextoAtivo]}>
                    Adicionar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.selectorBtn, tipoMovimentacao === 'RETIRAR' && styles.selectorBtnVermelho]}
                  onPress={() => setTipoMovimentacao('RETIRAR')}
                >
                  <Ionicons name="remove-circle-outline" size={15} color={tipoMovimentacao === 'RETIRAR' ? '#fff' : '#888'} style={{ marginRight: 4 }} />
                  <Text style={[styles.selectorTexto, tipoMovimentacao === 'RETIRAR' && { color: '#fff' }]}>
                    Retirar
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quantidade */}
              <Text style={styles.modalLabel}>Quantidade</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="layers-outline" size={16} color="#999" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ex: 5"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={qtdMovimentar}
                  onChangeText={setQtdMovimentar}
                />
              </View>

              {/* Motivo (só na retirada) */}
              {tipoMovimentacao === 'RETIRAR' && (
                <>
                  <Text style={styles.modalLabel}>Motivo da Retirada</Text>
                  <TouchableOpacity
                    style={styles.inputWrapper}
                    onPress={() => setModalMotivoAberto(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="document-text-outline" size={16} color="#999" style={{ marginRight: 8 }} />
                    <Text style={[styles.modalInput, { color: '#222', paddingVertical: 0, flex: 1 }]}>{motivo}</Text>
                    <Ionicons name="chevron-down" size={16} color="#999" />
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={[styles.modalBotao, styles.modalBotaoCancelar]}
                  onPress={() => { setProdutoSelecionado(null); setQtdMovimentar(''); }}
                >
                  <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBotao, { backgroundColor: tipoMovimentacao === 'ADICIONAR' ? paleta.VERDE : paleta.VERMELHO }]}
                  onPress={handleMovimentacao}
                  disabled={salvandoMov}
                >
                  {salvandoMov
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.modalBotaoTexto}>Confirmar</Text>}
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

        {/* ── Modal Picker de Motivo ─────────────────────────── */}
        <Modal
          visible={modalMotivoAberto}
          transparent
          animationType="fade"
          onRequestClose={() => setModalMotivoAberto(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { paddingBottom: 12 }]}>
              <Text style={[styles.modalTitulo, { marginBottom: 16 }]}>Motivo da Retirada</Text>
              {MOTIVOS.map((m, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.motivoOpcao, i === motivoIdx && styles.motivoOpcaoAtiva]}
                  onPress={() => {
                    setMotivo(m);
                    setMotivoIdx(i);
                    setModalMotivoAberto(false);
                  }}
                >
                  <Text style={[styles.motivoTexto, i === motivoIdx && { color: paleta.VERDE }]}>{m}</Text>
                  {i === motivoIdx && <Ionicons name="checkmark" size={18} color={paleta.VERDE} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* ── Modal Exclusão ─────────────────────────────────── */}
        <Modal
          visible={!!produtoParaExcluir}
          transparent
          animationType="fade"
          onRequestClose={() => setProdutoParaExcluir(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { borderColor: paleta.VERMELHO }]}>
              <View style={[styles.modalIcone, { backgroundColor: paleta.VERMELHO, alignSelf: 'center', marginBottom: 16 }]}>
                <Ionicons name="trash" size={32} color="#fff" />
              </View>
              <Text style={styles.modalTitulo}>Excluir produto</Text>
              <Text style={styles.modalTexto}>
                Tem certeza que deseja apagar{'\n'}
                <Text style={{ fontFamily: 'Lexend_700Bold', color: '#fff' }}>
                  "{produtoParaExcluir?.nome}"
                </Text>
                ?{'\n'}Esta ação não pode ser desfeita.
              </Text>
              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={[styles.modalBotao, styles.modalBotaoCancelar]}
                  onPress={() => setProdutoParaExcluir(null)}
                  disabled={excluindo}
                >
                  <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBotao, { backgroundColor: paleta.VERMELHO }]}
                  onPress={excluirProduto}
                  disabled={excluindo}
                >
                  {excluindo
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.modalBotaoTexto}>Excluir</Text>}
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

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitulo: {
    fontSize: 32,
    fontFamily: 'Lexend_800ExtraBold',
    color: paleta.VERDE,
    letterSpacing: 2,
  },

  // ── Busca ────────────────────────────────────────────────
  buscaContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  buscaInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Lexend_400Regular',
    color: '#333',
  },

  // ── Lista ────────────────────────────────────────────────
  lista: { paddingHorizontal: 16, paddingBottom: 100 },
  vazio: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Lexend_400Regular',
  },

  // ── Card ─────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  cardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardNome: {
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    color: '#222',
    flex: 1,
    marginRight: 8,
  },
  badgeStatus: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeTexto: {
    fontSize: 11,
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
  },
  cardEstoqueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  cardEstoqueTexto: {
    fontSize: 13,
    fontFamily: 'Lexend_400Regular',
    color: '#555',
  },
  cardBotoes: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  botaoCard: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoCardTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 11,
    color: '#fff',
  },
  botaoMover: { backgroundColor: paleta.VERDE },
  botaoEditar: { backgroundColor: paleta.ROXO },
  botaoVerMais: { backgroundColor: 'rgba(94,184,94,0.18)' },
  botaoExcluir: { backgroundColor: paleta.VERMELHO },

  // ── Botão Novo ───────────────────────────────────────────
  botaoNovo: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    backgroundColor: paleta.VERDE,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  botaoNovoTexto: {
    color: '#1a1a1a',
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 15,
  },

  // ── Footer ───────────────────────────────────────────────
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  footerLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  // ── Modais (base) ────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#1a0e26',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    padding: 24,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcone: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitulo: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitulo: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalTexto: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalLabel: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  modalInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
    color: '#222',
    paddingVertical: 10,
  },

  // ── Selector movimentação ────────────────────────────────
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 3,
    gap: 3,
    marginBottom: 4,
  },
  selectorBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectorBtnVerde: { backgroundColor: paleta.VERDE },
  selectorBtnVermelho: { backgroundColor: paleta.VERMELHO },
  selectorTexto: { fontFamily: 'Lexend_700Bold', fontSize: 13, color: '#888' },
  selectorTextoAtivo: { color: paleta.ROXO },

  // ── Botões do modal ──────────────────────────────────────
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  modalBotaoCancelarTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#aaa',
  },
  modalBotaoTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#fff',
  },

  // ── Picker de motivo ─────────────────────────────────────
  motivoOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  motivoOpcaoAtiva: {
    backgroundColor: 'rgba(94,184,94,0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  motivoTexto: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: '#ccc',
    flex: 1,
  },
});