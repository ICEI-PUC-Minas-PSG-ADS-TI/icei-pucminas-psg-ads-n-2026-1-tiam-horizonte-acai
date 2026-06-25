import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  ScrollView,
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from '@expo-google-fonts/lexend';
import { supabase } from '@/services/supabase';
import { paleta } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Home() {
  const [totalVendas, setTotalVendas] = useState(0);
  const [faturamento, setFaturamento] = useState(0);
  const [vendas, setVendas] = useState<any[]>([]);
  const [periodoAtual, setPeriodoAtual] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  async function buscarRelatorio(dataInicial: Date, dataFinal: Date) {
    const { data, error } = await supabase
      .from('Venda')
      .select('*')
      .gte('data', dataInicial.toISOString())
      .lte('data', dataFinal.toISOString());

    if (error) { console.log('ERRO:', error); return; }

    setVendas(data);
    setTotalVendas(data.length);
    setFaturamento(data.reduce((acc, venda) => acc + Number(venda.valor_total), 0));
  }

  async function relatorioMensal() {
    setPeriodoAtual('Mensal');
    const now = new Date();
    await buscarRelatorio(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
      new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
    );
  }

  async function relatorioTrimestral() {
    setPeriodoAtual('Trimestral');
    const now = new Date();
    await buscarRelatorio(
      new Date(now.getFullYear(), now.getMonth() - 3, 1),
      new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
    );
  }

  async function relatorioAnual() {
    setPeriodoAtual('Anual');
    const now = new Date();
    await buscarRelatorio(
      new Date(now.getFullYear() - 1, 0, 1),
      new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
    );
  }

  function montarRanking(data: any[]) {
    const ranking: Record<string, number> = {};
    data.forEach((item: any) => {
      const nome = item.produtos.nome;
      ranking[nome] = (ranking[nome] ?? 0) + item.quantidade;
    });
    return Object.entries(ranking)
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade);
  }

  async function buscarProdutosMaisVendidos(vendasParam: any[]) {
    const idsVendas = vendasParam.map(v => v.id);
    const { data, error } = await supabase
      .from('Venda_Produto')
      .select(`id_produto, quantidade, produtos (nome)`)
      .in('id_venda', idsVendas);
    if (error) { console.log(error); return []; }
    return montarRanking(data);
  }

  async function abrirRelatorio(tipo: 'mensal' | 'trimestral' | 'anual') {
    setCarregando(true);
    if (tipo === 'mensal') await relatorioMensal();
    else if (tipo === 'trimestral') await relatorioTrimestral();
    else await relatorioAnual();

    const now = new Date();
    let dataInicial: Date, dataFinal: Date;
    if (tipo === 'mensal') {
      dataInicial = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      dataFinal = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (tipo === 'trimestral') {
      dataInicial = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      dataFinal = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else {
      dataInicial = new Date(now.getFullYear() - 1, 0, 1);
      dataFinal = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
    }

    const { data } = await supabase
      .from('Venda')
      .select('*')
      .gte('data', dataInicial.toISOString())
      .lte('data', dataFinal.toISOString());

    const ranking = await buscarProdutosMaisVendidos(data ?? []);
    setProdutosMaisVendidos(ranking ?? []);
    setCarregando(false);
    setModalVisible(true);
  }

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;
  }

  const periodos = [
    { label: 'Relatório Mensal',    tipo: 'mensal'     as const, icon: 'calendar-outline' },
    { label: 'Relatório Trimestral', tipo: 'trimestral' as const, icon: 'stats-chart-outline' },
    { label: 'Relatório Anual',      tipo: 'anual'      as const, icon: 'bar-chart-outline' },
  ];

  return (
    <ProtectedRoute permitidos={['GESTOR', 'ADMINISTRADOR']}>
      <LinearGradient
        colors={[paleta.ROXO, '#2E1840', '#1A0E26']}
        style={styles.gradient}
      >
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safe}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color={paleta.BRANCO} />
            </TouchableOpacity>

            <Image
              source={require('../../assets/images/logo-sem-fundo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            {/* Título */}
            <Text style={styles.titulo}>Relatório de Vendas</Text>
            <Text style={styles.subtitulo}>
              Visualize o desempenho de vendas, acompanhe faturamento e
              identifique os produtos mais vendidos por período.
            </Text>

            {/* Card resumo */}
            <View style={styles.resumoCard}>
              <Text style={styles.resumoTitulo}>
                Resumo Atual{periodoAtual ? ` — ${periodoAtual}` : ''}
              </Text>
              <View style={styles.resumoRow}>
                <Ionicons name="receipt-outline" size={18} color={paleta.ROXO} />
                <Text style={styles.resumoTexto}>Total de vendas: {totalVendas}</Text>
              </View>
              <View style={styles.resumoRow}>
                <Ionicons name="cash-outline" size={18} color={paleta.ROXO} />
                <Text style={styles.resumoTexto}>
                  Faturamento: R$ {faturamento.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Seção períodos */}
            <Text style={styles.secaoTitulo}>Selecionar período</Text>

            <View style={styles.cardsContainer}>
              {periodos.map(({ label, tipo, icon }) => (
                <TouchableOpacity
                  key={tipo}
                  style={styles.card}
                  activeOpacity={0.75}
                  onPress={() => abrirRelatorio(tipo)}
                  disabled={carregando}
                >
                  <View style={styles.cardInner}>
                    <View style={styles.iconWrapper}>
                      <Ionicons name={icon as any} size={28} color={paleta.VERDE} />
                    </View>
                    <Text style={styles.cardLabel} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
                    <Ionicons name="chevron-forward" size={20} color={paleta.VERDE} style={{ marginLeft: 'auto' }} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLine} />
          </View>

        </SafeAreaView>
      </LinearGradient>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitulo}>Relatório de Desempenho</Text>

            {/* Resumo no modal */}
            <View style={styles.modalResumo}>
              <View style={styles.resumoRow}>
                <Ionicons name="receipt-outline" size={16} color={paleta.ROXO} />
                <Text style={styles.modalResumoTexto}>Total de vendas: {totalVendas}</Text>
              </View>
              <View style={styles.resumoRow}>
                <Ionicons name="cash-outline" size={16} color={paleta.ROXO} />
                <Text style={styles.modalResumoTexto}>
                  Faturamento total: R$ {faturamento.toFixed(2)}
                </Text>
              </View>
            </View>

            <Text style={styles.modalSecao}>Produtos mais vendidos</Text>

            <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
              {produtosMaisVendidos.length === 0 ? (
                <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
              ) : (
                produtosMaisVendidos.map((item, index) => (
                  <View key={index} style={styles.produtoItem}>
                    <View style={styles.posicaoBadge}>
                      <Text style={styles.posicaoTexto}>{index + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.produtoNome} numberOfLines={1}>{item.nome}</Text>
                      <Text style={styles.produtoQtd}>{item.quantidade} unidades vendidas</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.fecharBtn}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.fecharTexto}>Fechar relatório</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },

  // Margem lateral responsiva aplicada globalmente aqui
  safe: { 
    flex: 1, 
    paddingHorizontal: 24,
  },

  // ── Header ───────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 12,
  },

  logo: { width: SCREEN_WIDTH * 0.4, height: 60 },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: paleta.VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Scroll ───────────────────────────────────────────────
  scroll: {
    paddingBottom: 24,
  },

  titulo: {
    color: paleta.BRANCO,
    fontSize: SCREEN_WIDTH > 400 ? 26 : 22,
    fontFamily: 'Lexend_800ExtraBold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },

  subtitulo: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH > 400 ? 14 : 13,
    fontFamily: 'Lexend_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  // ── Resumo Card ──────────────────────────────────────────
  resumoCard: {
    backgroundColor: paleta.BRANCO,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    padding: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  resumoTitulo: {
    color: paleta.ROXO,
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 12,
  },

  resumoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },

  resumoTexto: {
    color: paleta.ROXO,
    fontSize: 15,
    fontFamily: 'Lexend_400Regular',
  },

  // ── Seção ────────────────────────────────────────────────
  secaoTitulo: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: 'Lexend_700Bold',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  // ── Cards período ────────────────────────────────────────
  cardsContainer: {
    gap: 12,
  },

  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: paleta.BRANCO,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },

  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(94,184,94,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardLabel: {
    color: paleta.ROXO,
    fontSize: SCREEN_WIDTH > 400 ? 16 : 15,
    fontFamily: 'Lexend_700Bold',
    flex: 1,
  },

  // ── Footer ───────────────────────────────────────────────
  footer: { paddingVertical: 16 },

  footerLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  // ── Modal ────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 24, // Garante que o Modal também não morda os cantos da tela externa
  },

  modalBox: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#2E1840',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: paleta.VERDE,
  },

  modalTitulo: {
    color: paleta.BRANCO,
    fontSize: SCREEN_WIDTH > 400 ? 22 : 18,
    fontFamily: 'Lexend_800ExtraBold',
    textAlign: 'center',
    marginBottom: 16,
  },

  modalResumo: {
    backgroundColor: paleta.BRANCO,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: paleta.VERDE,
    padding: 14,
    marginBottom: 16,
    gap: 4,
  },

  modalResumoTexto: {
    color: paleta.ROXO,
    fontSize: 15,
    fontFamily: 'Lexend_700Bold',
  },

  modalSecao: {
    color: paleta.BRANCO,
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 10,
  },

  produtoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.07)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  posicaoBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(94,184,94,0.2)',
    borderWidth: 1,
    borderColor: paleta.VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  posicaoTexto: {
    color: paleta.VERDE,
    fontSize: 13,
    fontFamily: 'Lexend_700Bold',
  },

  produtoNome: {
    color: paleta.BRANCO,
    fontSize: 14,
    fontFamily: 'Lexend_700Bold',
  },

  produtoQtd: {
    color: paleta.VERDE,
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
    marginTop: 2,
  },

  fecharBtn: {
    marginTop: 16,
    backgroundColor: paleta.VERDE,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },

  fecharTexto: {
    color: paleta.BRANCO,
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
  },

  vazio: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
});