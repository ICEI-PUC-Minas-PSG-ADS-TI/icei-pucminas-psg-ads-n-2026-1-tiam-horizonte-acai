import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { paleta } from '@/constants/theme'
import { formatarMoeda } from '@/helpers/format'

const PERIODOS = ['Mensal', 'Trimestral', 'Anual']

function getIntervalo(periodo) {
  const agora = new Date()
  let inicio

  if (periodo === 'Mensal') {
    inicio = new Date(agora.getFullYear(), agora.getMonth() - 1, 1)
  } else if (periodo === 'Trimestral') {
    inicio = new Date(agora.getFullYear(), agora.getMonth() - 3, 1)
  } else {
    inicio = new Date(agora.getFullYear() - 1, agora.getMonth(), 1)
  }

  return inicio.toISOString()
}

export default function RankingClientes() {
  const [periodo, setPeriodo] = useState('Mensal')
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    buscarRanking()
  }, [periodo])

  async function buscarRanking() {
    setLoading(true)
    const inicio = getIntervalo(periodo)

    const { data, error } = await supabase
      .from('Venda')
      .select('id_cliente, valor_total, Cliente(nome)')
      .gte('data', inicio)

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const agrupado = {}
    data.forEach((venda) => {
      const id = venda.id_cliente
      if (!agrupado[id]) {
        agrupado[id] = {
          id,
          nome: venda.Cliente?.nome ?? 'Cliente desconhecido',
          total: 0,
        }
      }
      agrupado[id].total += Number(venda.valor_total)
    })

    const ordenado = Object.values(agrupado).sort((a, b) => b.total - a.total)
    setRanking(ordenado)
    setLoading(false)
  }

  const top3 = ranking.slice(0, 3)
  const resto = ranking.slice(3)

  const medalhas = ['🥇', '🥈', '🥉']
  const coresPodio = ['#FFD700', '#C0C0C0', '#CD7F32']

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ranking de Clientes</Text>

      <View style={styles.seletor}>
        {PERIODOS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.botaoPeriodo, periodo === p && styles.botaoAtivo]}
            onPress={() => setPeriodo(p)}
          >
            <Text style={[styles.textoPeriodo, periodo === p && styles.textoAtivo]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={paleta.BRANCO} style={{ marginTop: 40 }} />
      ) : ranking.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma venda encontrada neste período.</Text>
      ) : (
        <>
          <View style={styles.podio}>
            {top3.map((cliente, index) => (
              <View
                key={cliente.id}
                style={[
                  styles.cartaoPodio,
                  { borderColor: coresPodio[index] },
                  index === 0 && styles.primeiro,
                ]}
              >
                <Text style={styles.medalha}>{medalhas[index]}</Text>
                <Text style={styles.nomePodio} numberOfLines={1}>
                  {cliente.nome}
                </Text>
                <Text style={[styles.valorPodio, { color: coresPodio[index] }]}>
                  {formatarMoeda(cliente.total)}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: paleta.ROXO,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: paleta.BRANCO,
    textAlign: 'center',
    marginBottom: 20,
  },
  seletor: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  botaoPeriodo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: paleta.BRANCO,
    backgroundColor: paleta.ROXO,
  },
  botaoAtivo: {
    backgroundColor: paleta.BRANCO,
    borderColor: paleta.VERDE,
  },
  textoPeriodo: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  textoAtivo: {
    color: paleta.VERDE,
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