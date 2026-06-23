import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Modal, 
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '../components/Sidebar'; 

const logoAcai = "https://cdn-icons-png.flaticon.com/512/5917/5917321.png";

const TelaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  
  // ESTADOS PARA MOVIMENTAÇÃO
  const [modalMoverAberto, setModalMoverAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [tipoMovimentacao, setTipoMovimentacao] = useState('ADICIONAR'); 
  const [qtdMovimentar, setQtdMovimentar] = useState('');
  
  // ESTADOS PARA RETIRADA
  const [motivo, setMotivo] = useState('Uso Interno');
  const [dataBaixa, setDataBaixa] = useState(new Date().toLocaleDateString('pt-BR'));

  const navigation = useNavigation();

  // 1. Perfil do Usuário Logado (Altere o cargo aqui para testar os acessos: 'ADM', 'Gestor', 'Estoque' ou 'Vendas')
  const [usuarioLogado] = useState({ nome: 'Marcos', cargo: 'ADM' });

  // 2. Variáveis de validação de permissões para facilitar a leitura do código
  const eAdmOuGestor = usuarioLogado.cargo === 'ADM' || usuarioLogado.cargo === 'Gestor';
  const podeGerenciarEstoque = eAdmOuGestor || usuarioLogado.cargo === 'Estoque';
  const ehTimeVendas = usuarioLogado.cargo === 'Vendas';

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome', { ascending: true });
      
      if (data) setProdutos(data);
      if (error) console.log("Erro ao buscar:", error.message);
    } catch (err) {
      console.log("Erro de conexão:", err);
    }
  }

  const handleExcluir = async () => {
    if (!podeGerenciarEstoque) {
      alert("Seu perfil não tem permissão para excluir produtos.");
      return;
    }

    if (produtoParaExcluir) {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', produtoParaExcluir.id);

      if (!error) {
        setModalExcluirAberto(false);
        setProdutoParaExcluir(null);
        fetchProdutos();
      } else {
        alert("Erro ao excluir: " + error.message);
      }
    }
  };

  const handleMovimentacao = async () => {
    if (!podeGerenciarEstoque) {
      alert("Seu perfil não tem permissão para movimentar o estoque.");
      return;
    }

    const quantidadeDigitada = Number(qtdMovimentar);

    if (!qtdMovimentar || isNaN(quantidadeDigitada) || quantidadeDigitada <= 0) {
      alert("Por favor, digite uma quantidade válida maior que zero.");
      return;
    }

    const estoqueAtual = Number(produtoSelecionado?.quantidade || 0);
    let novoEstoque = estoqueAtual;

    if (tipoMovimentacao === 'ADICIONAR') {
      novoEstoque = estoqueAtual + quantidadeDigitada;
    } else {
      if (quantidadeDigitada > estoqueAtual) {
        alert("Quantidade de retirada maior do que o saldo em estoque!");
        return;
      }
      novoEstoque = estoqueAtual - quantidadeDigitada;
    }

    const { error: erroEstoque } = await supabase
      .from('produtos')
      .update({ quantidade: novoEstoque })
      .eq('id', produtoSelecionado.id);

    if (!erroEstoque) {
      const { error: erroHistorico } = await supabase
        .from('historico_movimentacoes')
        .insert([
          {
            produto_id: produtoSelecionado.id,
            nome_produto: produtoSelecionado.nome,
            tipo: tipoMovimentacao,
            quantidade: quantidadeDigitada,
            motivo: tipoMovimentacao === 'ADICIONAR' ? 'Reposição/Entrada' : motivo,
            data_registro: dataBaixa
          }
        ]);

      if (erroHistorico) {
        console.log("Erro ao salvar histórico:", erroHistorico.message);
      }

      setModalMoverAberto(false);
      setQtdMovimentar('');
      setMotivo('Uso Interno'); 
      fetchProdutos(); 
    } else {
      alert("Não foi possível atualizar o estoque: " + erroEstoque.message);
    }
  };

  // 3. REGRA DE FILTRO DE PRODUTOS: Se for de Vendas, esconde o que for 'Interno'
  const produtosFiltrados = produtos.filter(p => {
    const bateComBusca = p.nome?.toLowerCase().includes(busca.toLowerCase());
    
    if (ehTimeVendas) {
      // Se for time de vendas, precisa bater a busca E o tipo ser obrigatóriamente 'Venda'
      return bateComBusca && p.tipo === 'Venda';
    }
    
    return bateComBusca; // Adm, Gestores e Estoque vêem tudo
  });

  return (
    <div style={{ 
      height: '100vh', 
      overflowY: 'auto', 
      backgroundColor: '#4a3061',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <Image source={{ uri: logoAcai }} style={styles.marcaDagua} />

        <View style={styles.box}>
          <View style={styles.logoContainer}>
            <Image source={{ uri: logoAcai }} style={styles.logoTopo} />
          </View>

          <View style={styles.header}>
            {/* PERMISSÃO DE RELATÓRIO: Só exibe o botão se for ADM ou Gestor */}
            {eAdmOuGestor ? (
              <TouchableOpacity onPress={() => navigation.navigate('TelaRelatorios')}>
                <Text style={styles.icon}>📊</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 30 }} /> // Espaçador para manter o título alinhado no meio
            )}

            <Text style={styles.logoText}>PROD<Text style={{color: '#7ed957'}}>UTOS</Text></Text>
            <TouchableOpacity onPress={() => setMenuAberto(true)}>
              <Text style={styles.icon}>☰</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buscar Produto</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Digite o nome..." 
              placeholderTextColor="#666"
              value={busca} 
              onChangeText={(text) => setBusca(text)} 
            />
          </View>

          {/* LISTAGEM DOS PRODUTOS */}
          <View style={styles.listaContainer}>
            {produtosFiltrados.map(p => {
              const qtdProduto = Number(p.quantidade || 0);

              return (
                <View key={p.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{p.nome || 'Produto Sem Nome'}</Text>
                  
                  <View style={styles.estoqueRow}>
                    <Text style={styles.estoqueText}>Estoque: {qtdProduto} UND</Text>
                    <View style={styles.statusGroup}>
                      <View style={[
                        styles.bolinha, 
                        { backgroundColor: qtdProduto <= 10 ? 'red' : '#7ed957' }
                      ]} />
                      <Text style={styles.statusText}>
                        {qtdProduto <= 10 ? 'Baixo' : 'OK'}
                      </Text>
                    </View>
                  </View>

                  {/* BLOCO DE AÇÕES DO CARD COM RESTRIÇÕES */}
                  <View style={styles.actions}>
                    {podeGerenciarEstoque ? (
                      <>
                        <TouchableOpacity 
                          style={[styles.btnAction, { backgroundColor: '#7ed957' }]} 
                          onPress={() => {
                            setProdutoSelecionado(p);
                            setTipoMovimentacao('ADICIONAR');
                            setModalMoverAberto(true);
                            setDataBaixa(new Date().toLocaleDateString('pt-BR')); 
                          }}
                        >
                          <Text style={[styles.btnActionText, { color: '#4a3061' }]}>Qtd +/-</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.btnAction} 
                          onPress={() => navigation.navigate('EditarProduto', { id: p.id })}
                        >
                          <Text style={styles.btnActionText}>Editar</Text>
                        </TouchableOpacity>
                      </>
                    ) : null}
                    
                    {/* Botão Ver Mais fica visível para todos os cargos */}
                    <TouchableOpacity 
                      style={styles.btnAction} 
                      onPress={() => navigation.navigate('DetalhesProduto', { id: p.id })}
                    >
                      <Text style={styles.btnActionText}>Ver Mais</Text>
                    </TouchableOpacity>

                    {podeGerenciarEstoque ? (
                      <TouchableOpacity 
                        style={[styles.btnAction, { backgroundColor: 'red' }]} 
                        onPress={() => {
                          setProdutoParaExcluir(p);
                          setModalExcluirAberto(true);
                        }}
                      >
                        <Text style={styles.btnActionText}>Excluir</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
          
          {/* PERMISSÃO DO BOTÃO CADASTRO: Oculta o botão se for do time de Vendas */}
          {podeGerenciarEstoque ? (
            <TouchableOpacity 
              style={styles.btnNovo} 
              onPress={() => navigation.navigate('NovoProduto')}
            >
              <Text style={styles.btnNovoText}>Novo Produto +</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* MODAL DE MOVIMENTAÇÃO */}
        <Modal visible={modalMoverAberto} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Movimentar Estoque</Text>
                <Image source={{ uri: logoAcai }} style={{width: 30, height: 30}} />
              </View>

              <Text style={{color: '#4a3061', fontWeight: 'bold', textAlign: 'center', marginBottom: 15}}>
                {produtoSelecionado?.nome} (Atual: {produtoSelecionado?.quantidade || 0} UND)
              </Text>

              <View style={styles.abasContainer}>
                <TouchableOpacity 
                  style={[styles.abaBotao, tipoMovimentacao === 'ADICIONAR' && styles.abaAtivaVerde]}
                  onPress={() => setTipoMovimentacao('ADICIONAR')}
                >
                  <Text style={[styles.abaTexto, tipoMovimentacao === 'ADICIONAR' && styles.textoAtivo]}>+ Adicionar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.abaBotao, tipoMovimentacao === 'RETIRAR' && styles.abaAtivaVermelha]}
                  onPress={() => setTipoMovimentacao('RETIRAR')}
                >
                  <Text style={[styles.abaTexto, tipoMovimentacao === 'RETIRAR' && styles.textoAtivo]}>- Retirar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.labelForm}>Quantidade</Text>
              <TextInput 
                style={[styles.input, {backgroundColor: 'white', marginBottom: 12}]}
                placeholder="Ex: 5"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={qtdMovimentar}
                onChangeText={setQtdMovimentar}
              />

              {tipoMovimentacao === 'RETIRAR' && (
                <View>
                  <Text style={styles.labelForm}>Motivo da Retirada</Text>
                  <select 
                    value={motivo} 
                    onChange={(e) => setMotivo(e.target.value)}
                    style={webStyles.select}
                  >
                    <option value="Uso Interno">Uso / Consumo Interno</option>
                    <option value="Avaria">Produto Danificado / Avaria</option>
                    <option value="Validade Vencida">Validade Vencida</option>
                    <option value="Outros">Outros Motivos</option>
                  </select>

                  <Text style={styles.labelForm}>Data do Registro</Text>
                  <TextInput 
                    style={[styles.input, {backgroundColor: '#e6e6e6', color: '#555', marginBottom: 15}]}
                    value={dataBaixa}
                    onChangeText={setDataBaixa}
                    placeholder="DD/MM/AAAA"
                  />
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.btnModalConfirm, { backgroundColor: tipoMovimentacao === 'ADICIONAR' ? '#28a745' : '#dc3545' }]} 
                  onPress={handleMovimentacao}
                >
                  <Text style={styles.btnActionText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnModalCancel} onPress={() => { setModalMoverAberto(false); setQtdMovimentar(''); }}>
                  <Text style={styles.btnActionText}>Voltar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* MODAL DE EXCLUIR */}
        <Modal visible={modalExcluirAberto} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Excluir Produto</Text>
                <Image source={{ uri: logoAcai }} style={{width: 30, height: 30}} />
              </View>
              <Text style={styles.modalBody}>
                Deseja realmente excluir o produto{"\n"}
                <Text style={{fontWeight: 'bold'}}>{produtoParaExcluir?.nome}</Text>?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.btnModalConfirm} onPress={handleExcluir}>
                  <Text style={styles.btnActionText}>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnModalCancel} onPress={() => setModalExcluirAberto(false)}>
                  <Text style={styles.btnActionText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Sidebar isOpen={menuAberto} onClose={() => setMenuAberto(false)} user={usuarioLogado} />
      </SafeAreaView>
    </div>
  );
};

const webStyles = {
  select: { padding: '12px', borderRadius: '8px', backgroundColor: 'white', fontSize: '16px', color: '#333', border: 'none', width: '100%', marginBottom: '12px' }
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  marcaDagua: { position: 'absolute', top: '25%', left: '10%', width: 300, height: 300, opacity: 0.1, transform: [{ rotate: '45deg' }] },
  box: { padding: 20, paddingBottom: 80 }, 
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  logoTopo: { width: 60, height: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  logoText: { color: 'white', fontWeight: 'bold', fontSize: 22 },
  icon: { color: 'white', fontSize: 24 },
  inputGroup: { marginBottom: 20 },
  label: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  labelForm: { color: '#4a3061', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  input: { padding: 12, borderRadius: 8, backgroundColor: '#d1d1d1', fontSize: 16, color: '#333' },
  listaContainer: { width: '100%' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#7ed957' },
  cardTitle: { color: '#4a3061', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  estoqueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  estoqueText: { color: '#4a3061', fontWeight: 'bold' },
  statusGroup: { flexDirection: 'row', alignItems: 'center' },
  bolinha: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#4a3061' },
  actions: { flexDirection: 'row', gap: 6 },
  btnAction: { flex: 1, paddingVertical: 8, backgroundColor: '#4a3061', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  btnActionText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  btnNovo: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  btnNovoText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#d1d1d1', padding: 20, borderRadius: 10, width: '85%', maxWidth: 450 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalBody: { color: '#333', textAlign: 'center', marginVertical: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 },
  btnModalConfirm: { backgroundColor: 'red', padding: 10, borderRadius: 5, width: '42%', alignItems: 'center' },
  btnModalCancel: { backgroundColor: 'gray', padding: 10, borderRadius: 5, width: '42%', alignItems: 'center' },
  abasContainer: { flexDirection: 'row', borderRadius: 8, backgroundColor: '#bbb', padding: 3, marginBottom: 15 },
  abaBotao: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  abaAtivaVerde: { backgroundColor: '#28a745' },
  abaAtivaVermelha: { backgroundColor: '#dc3545' },
  abaTexto: { fontWeight: 'bold', color: '#555' },
  textoAtivo: { color: 'white' }
});

export default TelaProdutos;