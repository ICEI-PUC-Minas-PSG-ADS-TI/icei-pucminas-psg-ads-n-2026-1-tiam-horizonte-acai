import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { paleta } from '@/constants/theme'
import { formatarMoeda } from '@/helpers/format'

function getMesAtual() {
  const agora = new Date()
  return {
    mes: agora.getMonth() + 1,
    ano: agora.getFullYear(),
  }
}

export default function BarraMeta({ totalVendas }) {
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    buscarMeta()
  }, [])

  async function buscarMeta() {
    setLoading(true)
    const { mes, ano } = getMesAtual()

    const { data, error } = await supabase
      .from('Meta_Mensal')
      .select('valor_meta')
      .eq('mes', mes)
      .eq('ano', ano)
      .maybeSingle()

    if (error) {
      console.error(error)
    }

    setMeta(data ? Number(data.valor_meta) : null)
    setLoading(false)
  }

  if (loading) {
    return null
  }

  if (meta === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.semMetaTexto}>
          Nenhuma meta cadastrada para este mês.
        </Text>
      </View>
    )
  }

  const progresso = Math.min((totalVendas / meta) * 100, 100)

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meta do mês</Text>

      <Text style={styles.valores}>
        {formatarMoeda(totalVendas)} / {formatarMoeda(meta)}
      </Text>

      <View style={styles.trilho}>
        <View style={[styles.preenchimento, { width: `${progresso}%` }]}>
          {progresso >= 15 && (
            <Text style={styles.porcentagemDentro}>{progresso.toFixed(0)}%</Text>
          )}
        </View>
        {progresso < 15 && (
          <Text style={styles.porcentagemFora}>{progresso.toFixed(0)}%</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: paleta.BRANCO,
    marginBottom: 8,
  },
  valores: {
    fontSize: 18,
    fontWeight: 'bold',
    color: paleta.BRANCO,
    marginBottom: 8,
  },
  trilho: {
    height: 36,
    backgroundColor: paleta.ROXO,
    borderRadius: 16,
    padding: 4,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: paleta.VERDE,
  },
  preenchimento: {
    height: '100%',
    backgroundColor: paleta.VERDE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    minWidth: 28,
  },
  porcentagemDentro: {
    fontSize: 13,
    fontWeight: 'bold',
    color: paleta.BRANCO,
  },
  porcentagemFora: {
    position: 'absolute',
    right: 12,
    fontSize: 13,
    fontWeight: 'bold',
    color: paleta.BRANCO,
  },
  semMetaTexto: {
    color: paleta.BRANCO,
    fontSize: 14,
    textAlign: 'center',
  },
})