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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFonts, Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold } from '@expo-google-fonts/lexend';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { paleta } from '@/constants/theme';
import { pageGradientProps } from '@/constants/theme';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type TipoFuncionario = 'GESTOR' | 'VENDEDOR' | 'ESTOQUISTA' | 'ADMINISTRADOR';

interface Funcionario {
  id: number;
  nome: string;
  usuario: string;
  tipo: TipoFuncionario;
  ativo: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIPO_COR: Record<TipoFuncionario, string> = {
  GESTOR: '#7c3aed',
  VENDEDOR: '#5EB85E',
  ESTOQUISTA: '#d97706',
  ADMINISTRADOR: '#d31314',
};

const TIPO_LABEL: Record<TipoFuncionario, string> = {
  GESTOR: 'Gestor',
  VENDEDOR: 'Vendedor',
  ESTOQUISTA: 'Estoquista',
  ADMINISTRADOR: 'ADM',
};

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function ColaboradoresScreen() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [filtrados, setFiltrados] = useState<Funcionario[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [funcParaExcluir, setFuncParaExcluir] = useState<Funcionario | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold, Lexend_800ExtraBold });

  useFocusEffect(
    useCallback(() => {
      buscarFuncionarios();
    }, [])
  );

  useEffect(() => {
    const termo = busca.toLowerCase();
    setFiltrados(
      funcionarios.filter(
        (f) =>
          f.nome.toLowerCase().includes(termo) ||
          f.usuario.toLowerCase().includes(termo) ||
          f.tipo.toLowerCase().includes(termo),
      ),
    );
  }, [busca, funcionarios]);

  async function buscarFuncionarios() {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('Funcionario')
        .select('id, nome, usuario, tipo, ativo')
        .order('nome', { ascending: true });

      if (error) throw error;

      setFuncionarios(data ?? []);
      setFiltrados(data ?? []);
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível carregar os colaboradores.');
    } finally {
      setCarregando(false);
    }
  }

  async function excluirFuncionario() {
    if (!funcParaExcluir) return;
    setExcluindo(true);
    try {
      const { error } = await supabase
        .from('Funcionario')
        .delete()
        .eq('id', funcParaExcluir.id);

      if (error) throw error;

      setFuncionarios((prev) => prev.filter((f) => f.id !== funcParaExcluir.id));
      setFuncParaExcluir(null);
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível excluir o colaborador.');
    } finally {
      setExcluindo(false);
    }
  }

  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;

  function CardFuncionario({ item }: { item: Funcionario }) {
    const cor = TIPO_COR[item.tipo] ?? paleta.VERDE;
    return (
      <View style={styles.card}>
        <View style={styles.cardConteudo}>
          <View style={[styles.avatar, { backgroundColor: cor }]}>
            <Text style={styles.avatarLetra}>{item.nome.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.cardTopo}>
              <Text style={styles.cardNome} numberOfLines={1}>{item.nome}</Text>
              <View style={[styles.badge, { backgroundColor: cor + '22', borderColor: cor }]}>
                <Text style={[styles.badgeTexto, { color: cor }]}>{TIPO_LABEL[item.tipo]}</Text>
              </View>
            </View>

            <Text style={styles.cardUsuario}>@{item.usuario}</Text>

            <View style={styles.cardStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: item.ativo ? paleta.VERDE : paleta.VERMELHO }]} />
              <Text style={styles.cardStatus}>{item.ativo ? 'Ativo' : 'Inativo'}</Text>
            </View>

            <View style={styles.cardBotoes}>
              <TouchableOpacity
                style={[styles.botaoCard, styles.botaoEditar]}
                onPress={() =>
                  router.push({
                    pathname: '/colaborador/editar-colaborador' as any,
                    params: {
                      id: item.id,
                      nome: item.nome,
                      usuario: item.usuario,
                      tipo: item.tipo,
                      ativo: item.ativo ? 'true' : 'false',
                    },
                  })
                }
              >
                <Text style={styles.botaoCardTexto}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoCard, styles.botaoExcluir]}
                onPress={() => setFuncParaExcluir(item)}
              >
                <Text style={styles.botaoCardTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <LinearGradient {...pageGradientProps()}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/' as any)}>
          <Ionicons name="home" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleWrapper}>
            <Text style={styles.headerTitulo}>COLABORADORES</Text>
          </View>
          <View style={{ width: 36 }} />
      </View>

      {/* Busca */}
      <View style={styles.buscaContainer}>
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar por nome, usuário ou tipo"
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />
        <Ionicons name="search" size={20} color="#555" style={styles.buscaIcone} />
      </View>

      {/* Lista */}
      {carregando ? (
        <ActivityIndicator size="large" color={paleta.VERDE} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardFuncionario item={item} />}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum colaborador encontrado.</Text>
          }
        />
      )}

      {/* Botão Novo */}
      <TouchableOpacity
        style={styles.botaoNovo}
        onPress={() => router.push('colaborador/cadastrar-colaborador' as any)}
      >
        <Text style={styles.botaoNovoTexto}>Novo Colaborador  +</Text>
      </TouchableOpacity>

      {/* Modal exclusão */}
      <Modal
        visible={!!funcParaExcluir}
        transparent
        animationType="fade"
        onRequestClose={() => setFuncParaExcluir(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIcone}>
              <Ionicons name="trash" size={32} color="#fff" />
            </View>
            <Text style={styles.modalTitulo}>Excluir colaborador</Text>
            <Text style={styles.modalTexto}>
              Tem certeza que deseja apagar{'\n'}
              <Text style={styles.modalNome}>"{funcParaExcluir?.nome}"</Text>?
              {'\n'}Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.modalBotao, styles.modalBotaoCancelar]}
                onPress={() => setFuncParaExcluir(null)}
                disabled={excluindo}
              >
                <Text style={styles.modalBotaoTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBotao, styles.modalBotaoExcluir]}
                onPress={excluirFuncionario}
                disabled={excluindo}
              >
                {excluindo ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalBotaoTextoExcluir}>Sim, excluir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </LinearGradient>
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
    paddingBottom: 12,
  },
  headerTitulo: {
    fontSize: 29,
    fontFamily: 'Lexend_800ExtraBold',
    color: paleta.VERDE,
    letterSpacing: 2,
  },

  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

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
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 3,
    borderColor: paleta.VERDE,
    overflow: 'hidden',
  },
  cardConteudo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  avatarLetra: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Lexend_800ExtraBold',
  },
  cardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 8,
  },
  cardNome: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    color: '#222',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeTexto: {
    fontSize: 11,
    fontFamily: 'Lexend_700Bold',
  },
  cardUsuario: {
    fontSize: 13,
    fontFamily: 'Lexend_400Regular',
    color: '#777',
    marginBottom: 4,
  },
  cardStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardStatus: {
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
    color: '#555',
  },
  cardBotoes: { flexDirection: 'row', gap: 8 },
  botaoCard: { paddingVertical: 5, paddingHorizontal: 14, borderRadius: 6 },
  botaoCardTexto: { color: '#fff', fontFamily: 'Lexend_700Bold', fontSize: 12 },
  botaoEditar: { backgroundColor: paleta.ROXO },
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
  },
  botaoNovoTexto: { color: '#1a1a1a', fontFamily: 'Lexend_800ExtraBold', fontSize: 15 },

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