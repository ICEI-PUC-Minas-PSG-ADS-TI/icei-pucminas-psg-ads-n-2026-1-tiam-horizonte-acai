import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { paleta } from '@/constants/theme'
import BarraMeta from '@/components/barra-meta'
import { formatarMoeda } from '@/helpers/format'
import { LinearGradient } from 'expo-linear-gradient'
import { pageGradientProps } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

function getInicioMesAtual() {
  const agora = new Date()
  return new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString()
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function getMesAnoAtual() {
  const agora = new Date()
  return `${MESES[agora.getMonth()]} / ${agora.getFullYear()}`
}

export default function RankingVendedores() {
  const router = useRouter()
  const [ranking, setRanking] = useState([])
  const [totalGeral, setTotalGeral] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    buscarRanking()
  }, [])

  async function buscarRanking() {
    setLoading(true)
    const inicio = getInicioMesAtual()

    const { data, error } = await supabase
      .from('Venda')
      .select('id_vendedor, valor_total, Funcionario(nome)')
      .gte('data', inicio)

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const agrupado = {}
    let total = 0
    data.forEach((venda) => {
      total += Number(venda.valor_total)
      const id = venda.id_vendedor
      if (!agrupado[id]) {
        agrupado[id] = {
          id,
          nome: venda.Funcionario?.nome ?? 'Funcionário desconhecido',
          total: 0,
        }
      }
      agrupado[id].total += Number(venda.valor_total)
    })

    const ordenado = Object.values(agrupado).sort((a, b) => b.total - a.total)
    setRanking(ordenado)
    setTotalGeral(total)
    setLoading(false)
  }

  const top3 = ranking.slice(0, 3)
  const resto = ranking.slice(3)

  const medalhas = ['🥇', '🥈', '🥉']
  const coresPodio = ['#FFD700', '#C0C0C0', '#CD7F32']

  return (
    <LinearGradient {...pageGradientProps()}>
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={paleta.BRANCO} />
        </TouchableOpacity>
        <View style={{ width: 36 }} />
      </View>
    <View style={styles.container}>
      <Text style={styles.titulo}>Ranking de Vendedores</Text>
      <Text style={styles.subtitulo}>{getMesAnoAtual()}</Text>

      <BarraMeta totalVendas={totalGeral} />

      {loading ? (
        <ActivityIndicator size="large" color={paleta.BRANCO} style={{ marginTop: 40 }} />
      ) : ranking.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma venda registrada neste mês.</Text>
      ) : (
        <>
          <View style={styles.podio}>
            {top3.map((funcionario, index) => (
              <View
                key={funcionario.id}
                style={[
                  styles.cartaoPodio,
                  { borderColor: coresPodio[index] },
                  index === 0 && styles.primeiro,
                ]}
              >
                <Text style={styles.medalha}>{medalhas[index]}</Text>
                <Text style={styles.nomePodio} numberOfLines={1}>
                  {funcionario.nome}
                </Text>
                <Text style={[styles.valorPodio, { color: coresPodio[index] }]}>
                  {formatarMoeda(funcionario.total)}
                </Text>
              </View>
            ))}
          </View>

          {resto.length > 0 && (
            <FlatList
              data={resto}
              keyExtractor={(item) => String(item.id)}
              style={styles.lista}
              renderItem={({ item, index }) => (
                <View style={styles.itemLista}>
                  <Text style={styles.posicao}>{index + 4}º</Text>
                  <Text style={styles.nomeLista} numberOfLines={1}>
                    {item.nome}
                  </Text>
                  <Text style={styles.valorLista}>
                    {formatarMoeda(item.total)}
                  </Text>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
    </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 8,
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

  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 0,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: paleta.BRANCO,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: '#dddddd',
    textAlign: 'center',
    marginBottom: 24,
  },
  podio: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 24,
  },
  cartaoPodio: {
    flex: 1,
    backgroundColor: paleta.BRANCO,
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
  },
  primeiro: {
    paddingVertical: 20,
    transform: [{ scale: 1.05 }],
  },
  medalha: {
    fontSize: 28,
    marginBottom: 6,
  },
  nomePodio: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 4,
  },
  valorPodio: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  lista: {
    flex: 1,
  },
  itemLista: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: paleta.BRANCO,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
  },
  posicao: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    width: 32,
  },
  nomeLista: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a2e',
  },
  valorLista: {
    fontSize: 14,
    fontWeight: '600',
    color: paleta.ROXO_CLARO,
  },
  vazio: {
    textAlign: 'center',
    color: paleta.BRANCO,
    marginTop: 40,
    fontSize: 15,
  },
})