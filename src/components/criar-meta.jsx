import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { paleta } from '@/constants/theme'
import { pageGradientProps } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { formatarMoeda } from '@/helpers/format'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function getMesAtual() {
  const agora = new Date()
  return {
    mes: agora.getMonth() + 1,
    ano: agora.getFullYear(),
    label: `${MESES[agora.getMonth()]} / ${agora.getFullYear()}`,
  }
}

export default function CriarMeta() {
  const router = useRouter()
  const [valorDisplay, setValorDisplay] = useState('')
  const [valorNumerico, setValorNumerico] = useState(0)
  const [metaExistente, setMetaExistente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)

  const { mes, ano, label } = getMesAtual()

  useEffect(() => {
    buscarMetaAtual()
  }, [])

  function handleChangeValor(texto) {
  const apenasNumeros = texto.replace(/\D/g, '')
  const centavos = parseInt(apenasNumeros || '0', 10)
  const reais = centavos / 100
  setValorNumerico(reais)
  setValorDisplay(reais > 0 ? formatarMoeda(reais) : '')
}

  async function buscarMetaAtual() {
    setLoading(true)

    const { data, error } = await supabase
      .from('Meta_Mensal')
      .select('*')
      .eq('mes', mes)
      .eq('ano', ano)
      .maybeSingle()

    if (error) {
      console.error(error)
    }

    if (data) {
        setMetaExistente(data)
        setValorNumerico(Number(data.valor_meta))
setValorDisplay(formatarMoeda(Number(data.valor_meta)))
    }

    setLoading(false)
  }

  async function salvarMeta() {
    if (valorNumerico <= 0) {
        Alert.alert('Valor inválido', 'Digite um valor maior que zero.')
        return
    }

    setSalvando(true)

    if (metaExistente) {
      const { error } = await supabase
        .from('Meta_Mensal')
        .update({ valor_meta: valorNumerico })
        .eq('id', metaExistente.id)

      if (error) {
        console.error(error)
        Alert.alert('Erro', 'Não foi possível atualizar a meta.')
      } else {
        Alert.alert('Sucesso', 'Meta atualizada com sucesso!')
        setMetaExistente({ ...metaExistente, valor_meta: valorNumerico })
      }
    } else {
      const { data, error } = await supabase
        .from('Meta_Mensal')
        .insert({
          mes,
          ano,
          valor_meta: valorNumerico,
          criado_por: 1,
        })
        .select()
        .single()

      if (error) {
        console.error(error)
        Alert.alert('Erro', 'Não foi possível cadastrar a meta.')
      } else {
        Alert.alert('Sucesso', 'Meta cadastrada com sucesso!')
        setMetaExistente(data)
      }
    }

    setSalvando(false)
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  }

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
      <Text style={styles.titulo}>
        {metaExistente ? 'Atualizar meta' : 'Cadastrar meta'}
      </Text>
      <Text style={styles.subtitulo}>{label}</Text>

      {metaExistente && (
        <Text style={styles.metaAtual}>
          Meta atual: {formatarMoeda(Number(metaExistente.valor_meta))}
        </Text>
      )}

      <Text style={styles.label}>Valor da meta (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="R$ 0,00"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={valorDisplay}
        onChangeText={handleChangeValor}
        />

      <TouchableOpacity
        style={styles.botao}
        onPress={salvarMeta}
        disabled={salvando}
      >
        {salvando ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.botaoTexto}>
            {metaExistente ? 'Atualizar' : 'Cadastrar'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
    </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 12,
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
    paddingTop: 16,
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
    fontSize: 14,
    color: '#dddddd',
    textAlign: 'center',
    marginBottom: 24,
  },
  metaAtual: {
    fontSize: 15,
    color: paleta.VERDE,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
  },
  botao: {
    backgroundColor: paleta.VERDE,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
})