import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const menus = [
  { label: 'Relatórios', icon: 'bar-chart-outline', rota: '/(tabs)/index' },
  { label: 'Clientes', icon: 'people-outline', rota: '/(tabs)/clientes' },
  { label: 'Ranking de Clientes', icon: 'trophy-outline', rota: '/(tabs)/ranking-cliente' },
  { label: 'Relatório de Vendas', icon: 'stats-chart-outline', rota: '/(tabs)/relatorio-vendas' },
  { label: 'Produtos', icon: 'basket-outline', rota: '/(tabs)/produtos' },
  { label: 'Configurações', icon: 'settings-outline', rota: '/(tabs)/configuracoes' },
  { label: 'Cadastrar Cliente', icon: 'person-add-outline', rota: '/cadastrar-cliente' },
  { label: 'Editar Cliente', icon: 'create-outline', rota: '/editar-cliente' },
  { label: 'Novo Produto', icon: 'add-circle-outline', rota: '/novo-produto' },
  { label: 'Login', icon: 'log-in-outline', rota: '/login' },
]

export default function Menu() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>HORIZONTE</Text>
      <Text style={styles.subtitulo}>AÇAÍ</Text>
      <Text style={styles.descricao}>Selecione uma tela</Text>

      {menus.map((item) => (
        <TouchableOpacity
          key={item.rota}
          style={styles.botao}
          onPress={() => router.push(item.rota as any)}
        >
          <Ionicons name={item.icon as any} size={24} color="#5EB85E" />
          <Text style={styles.botaoTexto}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#46295A' },
  conteudo: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  titulo: { color: '#fff', fontSize: 36, fontWeight: '900', textAlign: 'center', letterSpacing: 4 },
  subtitulo: { color: '#5EB85E', fontSize: 36, fontWeight: '900', textAlign: 'center', letterSpacing: 4, marginBottom: 8 },
  descricao: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 32 },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(94,184,94,0.3)',
  },
  botaoTexto: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
})