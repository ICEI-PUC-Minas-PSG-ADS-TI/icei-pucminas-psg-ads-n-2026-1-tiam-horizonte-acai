import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  Alert,
  Image 
} from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';

const TelaRelatorios = () => {
  const [historico, setHistorico] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    carregarHistoricoCompleto();
  }, []);

  async function carregarHistoricoCompleto() {
    const { data, error } = await supabase
      .from('historico_movimentacoes')
      .select('*')
      .order('criado_em', { ascending: false });

    if (data) setHistorico(data);
    if (error) console.log(error.message);
  }

  const aplicarFiltro = async () => {
    if (!dataInicio || !dataFim) {
      Alert.alert("Atenção", "Por favor, digite as duas datas para filtrar.");
      return;
    }

    const { data, error } = await supabase
      .from('historico_movimentacoes')
      .select('*')
      .order('criado_em', { ascending: false });

    if (data) {
      if (dataInicio.trim() === dataFim.trim()) {
        const filtrados = data.filter(item => {
          const dataItem = item.data_registro ? item.data_registro.trim() : '';
          return dataItem === dataInicio.trim();
        });
        setHistorico(filtrados);
        if (filtrados.length === 0) {
          Alert.alert("Busca concluída", "Nenhum registro encontrado para este dia.");
        }
        return;
      }

      const formatarParaComparar = (dateStr) => {
        if (!dateStr || !dateStr.includes('/')) return 0;
        const [dia, mes, ano] = dateStr.trim().split('/');
        return Number(ano + mes.padStart(2, '0') + dia.padStart(2, '0'));
      };

      const inicioNum = formatarParaComparar(dataInicio);
      const fimNum = formatarParaComparar(dataFim);

      const filtrados = data.filter(item => {
        const itemNum = formatarParaComparar(item.data_registro);
        return itemNum >= inicioNum && itemNum <= fimNum;
      });

      setHistorico(filtrados);

      if (filtrados.length === 0) {
        Alert.alert("Busca concluída", "Nenhum registro encontrado para este período específico.");
      }
    }
    
    if (error) Alert.alert("Erro", "Erro ao filtrar: " + error.message);
  };

  const exportarExcel = () => {
    if (historico.length === 0) {
      Alert.alert("Aviso", "Não há dados na tabela para exportar.");
      return;
    }

    let csvContent = "Data;Produto;Tipo de Movimento;Quantidade;Motivo\n";

    historico.forEach(row => {
      csvContent += `${row.data_registro || 'Sem Data'};${row.nome_produto};${row.tipo};${row.quantidade};${row.motivo}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Relatorio_Estoque_Acai.csv`);
    link.click();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        
        {/* LOGO DO AÇAÍ VIA LINK DA WEB (NÃO CRASHA A TELA) */}
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5917/5917321.png' }} 
            style={styles.logoImagem}
            resizeMode="contain"
          />
        </View>

        {/* HEADER PADRONIZADO COM O TÍTULO EM DUAS CORES NO CENTRO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltarContainer}>
            <Text style={styles.iconBack}>⬅️</Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.titleBase}>
              <Text style={styles.titleBranco}>RELA</Text>
              <Text style={styles.titleVerde}>TÓRIO</Text>
            </Text>
          </View>
          
          <View style={styles.spacer} />
        </View>

        {/* ÁREA DOS FILTROS */}
        <View style={styles.filtroContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>De (DD/MM/AAAA)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="01/06/2026" 
              placeholderTextColor="#999"
              value={dataInicio} 
              onChangeText={setDataInicio}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Até (DD/MM/AAAA)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="30/06/2026" 
              placeholderTextColor="#999"
              value={dataFim} 
              onChangeText={setDataFim}
            />
          </View>
        </View>

        <View style={styles.acoesContainer}>
          <TouchableOpacity style={styles.btnFiltrar} onPress={aplicarFiltro}>
            <Text style={styles.btnText}>Filtrar Período</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnExcel} onPress={exportarExcel}>
            <Text style={styles.btnTextExcel}>📥 Exportar Excel</Text>
          </TouchableOpacity>
        </View>

        {/* LISTAGEM DOS REGISTROS */}
        <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
          {historico.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma movimentação exibida.</Text>
            </View>
          ) : (
            historico.map(h => (
              <View key={h.id} style={[styles.card, { borderLeftColor: h.tipo === 'ADICIONAR' ? '#28a745' : '#dc3545' }]}>
                <View style={styles.row}>
                  <Text style={styles.cardData}>{h.data_registro || 'Data não informada'}</Text>
                  <Text style={[styles.badge, { backgroundColor: h.tipo === 'ADICIONAR' ? '#28a745' : '#dc3545' }]}>
                    {h.tipo}
                  </Text>
                </View>
                <Text style={styles.cardProduto}>{h.nome_produto}</Text>
                <Text style={styles.cardDetalhe}>Quantidade: <Text style={{fontWeight: 'bold'}}>{h.quantidade} UND</Text></Text>
                <Text style={styles.cardDetalhe}>Motivo: {h.motivo}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4a3061' },
  box: { flex: 1, padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 10, height: 75, justifyContent: 'center' },
  logoImagem: { width: 75, height: 75 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 25 
  },
  btnVoltarContainer: { padding: 5, width: 40 },
  iconBack: { color: 'white', fontWeight: 'bold', fontSize: 22 },
  titleContainer: { flex: 1, alignItems: 'center' },
  titleBase: { fontSize: 24, fontWeight: 'bold', letterSpacing: 1 },
  titleBranco: { color: 'white' },
  titleVerde: { color: '#7ed957' },
  spacer: { width: 40 }, 
  filtroContainer: { flexDirection: 'row', gap: 12, marginBottom: 15 },
  inputGroup: { flex: 1 },
  label: { color: 'white', fontSize: 12, marginBottom: 6, fontWeight: 'bold' },
  input: { padding: 12, borderRadius: 8, backgroundColor: 'white', color: '#333', fontSize: 14 },
  acoesContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  btnFiltrar: { flex: 1, backgroundColor: '#7ed957', padding: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnExcel: { flex: 1, backgroundColor: '#28a745', padding: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#4a3061', fontWeight: 'bold', fontSize: 14 },
  btnTextExcel: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  lista: { flex: 1 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#b39ddb', fontSize: 15, fontStyle: 'italic' },
  card: { backgroundColor: 'white', padding: 14, borderRadius: 10, marginBottom: 12, borderLeftWidth: 6, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardData: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  badge: { color: 'white', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  cardProduto: { color: '#4a3061', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDetalhe: { color: '#555', fontSize: 13, marginTop: 2 }
});

export default TelaRelatorios;