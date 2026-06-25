import ProtectedRoute from '@/components/ProtectedRoute';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from '@expo-google-fonts/lexend';
import { supabase } from '@/lib/supabase';
import { paleta } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Movimentacao {
  id: number;
  data_registro: string | null;
  nome_produto: string;
  tipo: 'ADICIONAR' | 'RETIRAR';
  quantidade: number;
  motivo: string;
  criado_em: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dataParaNum(dateStr: string | null | undefined): number {
  if (!dateStr || !dateStr.includes('/')) return 0;
  const [dia, mes, ano] = dateStr.trim().split('/');
  return Number(ano + mes.padStart(2, '0') + dia.padStart(2, '0'));
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function HistoricoMovimentacoesScreen() {
  const router = useRouter();

  const [historico, setHistorico] = useState<Movimentacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [exportando] = useState(false);

  // Estados corrigidos e adicionados para strings visuais
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dataInicioDate, setDataInicioDate] = useState(new Date());
  const [dataFimDate, setDataFimDate] = useState(new Date());
  
  const [mostrarDataInicio, setMostrarDataInicio] = useState(false);
  const [mostrarDataFim, setMostrarDataFim] = useState(false);

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('historico_movimentacoes')
        .select('*')
        .order('criado_em', { ascending: false });
      if (error) throw error;
      setHistorico(data ?? []);
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível carregar o histórico.');
    } finally {
      setCarregando(false);
    }
  }

  async function aplicarFiltro() {
    if (!dataInicio || !dataFim) {
      Alert.alert('Atenção', 'Preencha as duas datas para filtrar.');
      return;
    }

    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('historico_movimentacoes')
        .select('*')
        .order('criado_em', { ascending: false });
      if (error) throw error;

      const todos = data ?? [];
      const inicioNum = dataParaNum(dataInicio);
      const fimNum = dataParaNum(dataFim);

      const filtrados = todos.filter(item => {
        const itemNum = dataParaNum(item.data_registro);
        return itemNum >= inicioNum && itemNum <= fimNum;
      });

      setHistorico(filtrados);

      if (filtrados.length === 0) {
        Alert.alert('Busca concluída', 'Nenhum registro encontrado para este período.');
      }
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Erro ao filtrar.');
    } finally {
      setCarregando(false);
    }
  }

  function limparFiltro() {
    setDataInicio('');
    setDataFim('');
    setDataInicioDate(new Date());
    setDataFimDate(new Date());
    carregarHistorico();
  }

  function exportarCSV() {
    if (historico.length === 0) {
      Alert.alert('Aviso', 'Não há dados para exportar.');
      return;
    }
    const entradas = historico.filter(h => h.tipo === 'ADICIONAR').length;
    const retiradas = historico.filter(h => h.tipo === 'RETIRAR').length;
    Alert.alert(
      'Resumo do período',
      `${historico.length} movimentações\n• ${entradas} entrada(s)\n• ${retiradas} retirada(s)\n\nPara exportar CSV, instale:\nnpx expo install expo-file-system expo-sharing`,
    );
  }

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;
  }

  // ── Card de movimentação ──
  function CardMovimentacao({ item }: { item: Movimentacao }) {
    const isEntrada = item.tipo === 'ADICIONAR';
    return (
      <View style={[styles.card, { borderLeftColor: isEntrada ? paleta.VERDE : paleta.VERMELHO }]}>
        <View style={styles.cardTopo}>
          <View style={styles.cardDataRow}>
            <Ionicons name="calendar-outline" size={13} color="#888" style={{ marginRight: 4 }} />
            <Text style={styles.cardData}>{item.data_registro ?? 'Data não informada'}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: isEntrada ? paleta.VERDE : paleta.VERMELHO }]}>
            <Text style={styles.badgeTexto}>{isEntrada ? 'ENTRADA' : 'RETIRADA'}</Text>
          </View>
        </View>

        <Text style={styles.cardProduto}>{item.nome_produto}</Text>

        <View style={styles.cardDetalhes}>
          <View style={styles.cardDetailItem}>
            <Ionicons name="layers-outline" size={13} color="#888" />
            <Text style={styles.cardDetalheTexto}>
              <Text style={{ fontFamily: 'Lexend_700Bold', color: '#333' }}>{item.quantidade}</Text> und
            </Text>
          </View>
          <View style={styles.cardDetailItem}>
            <Ionicons name="document-text-outline" size={13} color="#888" />
            <Text style={styles.cardDetalheTexto}>{item.motivo}</Text>
          </View>
        </View>
      </View>
    );
  }

  const filtroAtivo = dataInicio.length > 0 || dataFim.length > 0;

  return (
    <ProtectedRoute permitidos={['ADMINISTRADOR', 'GESTOR', 'ESTOQUISTA']}>

      <LinearGradient colors={[paleta.ROXO, '#2E1840', '#1A0E26']} style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={paleta.BRANCO} />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>HISTÓRICO</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Filtros */}
        <View style={styles.filtrosCard}>
          <Text style={styles.filtrosLabel}>Filtrar por período</Text>

          <View style={styles.filtrosRow}>
            {/* INPUT DE */}
            <View style={styles.filtroInputGroup}>
              <Text style={styles.filtroInputLabel}>De</Text>
              <TouchableOpacity 
                style={styles.inputWrapper} 
                onPress={() => setMostrarDataInicio(true)}
              >
                <Ionicons name="calendar-outline" size={14} color="#999" style={{ marginRight: 6 }} />
                <Text style={styles.input}>
                  {dataInicio || 'Selecione'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* INPUT ATÉ */}
            <View style={styles.filtroInputGroup}>
              <Text style={styles.filtroInputLabel}>Até</Text>
              <TouchableOpacity 
                style={styles.inputWrapper} 
                onPress={() => setMostrarDataFim(true)}
              >
                <Ionicons name="calendar-outline" size={14} color="#999" style={{ marginRight: 6 }} />
                <Text style={styles.input}>
                  {dataFim || 'Selecione'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.botoesRow}>
            <TouchableOpacity
              style={[styles.botao, styles.botaoFiltrar]}
              onPress={aplicarFiltro}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={16} color={paleta.ROXO} style={{ marginRight: 6 }} />
              <Text style={styles.botaoFiltrarTexto}>Filtrar</Text>
            </TouchableOpacity>

            {filtroAtivo && (
              <TouchableOpacity
                style={[styles.botao, styles.botaoLimpar]}
                onPress={limparFiltro}
                activeOpacity={0.8}
              >
                <Ionicons name="close-circle-outline" size={16} color="#aaa" style={{ marginRight: 6 }} />
                <Text style={styles.botaoLimparTexto}>Limpar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.botao, styles.botaoExportar]}
              onPress={exportarCSV}
              disabled={exportando}
              activeOpacity={0.8}
            >
              {exportando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="download-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.botaoExportarTexto}>Exportar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Contador */}
          <Text style={styles.contadorTexto}>
            {historico.length} registro{historico.length !== 1 ? 's' : ''} encontrado{historico.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Lista */}
        {carregando ? (
          <ActivityIndicator size="large" color={paleta.VERDE} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={historico}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <CardMovimentacao item={item} />}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.vazioContainer}>
                <Ionicons name="folder-open-outline" size={48} color="rgba(255,255,255,0.2)" />
                <Text style={styles.vazioTexto}>Nenhuma movimentação encontrada.</Text>
              </View>
            }
          />
        )}

        <View style={styles.footer}>
          <View style={styles.footerLine} />
        </View>


        {mostrarDataInicio && (
        <DateTimePicker
          value={dataInicioDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setMostrarDataInicio(false);
            if (selectedDate) {
              setDataInicioDate(selectedDate);
              setDataInicio(selectedDate.toLocaleDateString('pt-BR'));
            }
          }}
        />
      )}

      {mostrarDataFim && (
        <DateTimePicker
          value={dataFimDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setMostrarDataFim(false);
            if (selectedDate) {
              setDataFimDate(selectedDate);
              setDataFim(selectedDate.toLocaleDateString('pt-BR'));
            }
          }}
        />
      )}

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
  headerTitulo: {
    fontSize: 28,
    fontFamily: 'Lexend_800ExtraBold',
    color: paleta.VERDE,
    letterSpacing: 2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: paleta.VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtrosCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  filtrosLabel: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: paleta.ROXO,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  filtrosRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  filtroInputGroup: { flex: 1 },
  filtroInputLabel: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
    height: 42,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Lexend_400Regular',
    color: '#333',
    lineHeight: 18,
  },
  botoesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  botaoFiltrar: {
    backgroundColor: paleta.VERDE,
    flex: 1,
  },
  botaoFiltrarTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: paleta.ROXO,
  },
  botaoLimpar: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#ccc',
  },
  botaoLimparTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: '#aaa',
  },
  botaoExportar: {
    backgroundColor: paleta.ROXO,
    flex: 1,
  },
  botaoExportarTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 13,
    color: '#fff',
  },
  contadorTexto: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: '#999',
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  vazioContainer: {
    alignItems: 'center',
    marginTop: 48,
    gap: 12,
  },
  vazioTexto: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.35)',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    padding: 14,
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardData: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: '#888',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeTexto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.5,
  },
  cardProduto: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
  },
  cardDetalhes: {
    gap: 4,
  },
  cardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardDetalheTexto: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 13,
    color: '#555',
  },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  footerLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
});