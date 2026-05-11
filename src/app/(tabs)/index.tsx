import { Button } from '@react-navigation/elements'
import { useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native'
import { supabase } from '../../../src/services/supabase'

export default function Home() {
  const [totalVendas, setTotalVendas] = useState(0)
  const [faturamento, setFaturamento] = useState(0)
  const [vendas, setVendas] = useState<any[]>([])

  const [modalVisible, setModalVisible] = useState(false)
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState<any[]>([])

  async function buscarRelatorio(dataInicial: Date, dataFinal: Date) {
    const { data, error } = await supabase
      .from('Venda')
      .select('*')
      .gte('data', dataInicial.toISOString())
      .lte('data', dataFinal.toISOString())

    if (error) {
      console.log('ERRO:', error)
      return
    }

    setVendas(data)

    const quantidadeVendas = data.length

    const totalFaturamento = data.reduce(
      (acc, venda) => acc + Number(venda.valor_total),
      0
    )

    console.log('RELATORIO MENSAL:', data)
    setTotalVendas(quantidadeVendas)
    setFaturamento(totalFaturamento)
  }

  async function relatorioMensal() {
    const now = new Date()

    const inicioMesPassado = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    )

    const fimMesPassado = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23, 59, 59, 999
    )

    await buscarRelatorio(inicioMesPassado, fimMesPassado)
  }

  async function relatorioTrimestral() {
    const now = new Date()

    const inicio = new Date(
      now.getFullYear(),
      now.getMonth() - 3,
      1
    )

    const fim = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23, 59, 59, 999
    )

    await buscarRelatorio(inicio, fim)
  }

  async function relatorioAnual() {
    const now = new Date()

    const inicioAnoAnterior = new Date(
      now.getFullYear() - 1,
      0,
      1
    )

    const fimAnoAnterior = new Date(
      now.getFullYear() - 1,
      11,
      31,
      23, 59, 59, 999
    )

    await buscarRelatorio(inicioAnoAnterior, fimAnoAnterior)
  }




  function montarRanking(data: any[]) {
    const ranking: Record<string, number> = {}

    data.forEach((item: any) => {
      const nome = item.produtos.nome

      if (!ranking[nome]) {
        ranking[nome] = 0
      }

      ranking[nome] += item.quantidade
    })

    return Object.entries(ranking)
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
  }



  async function buscarProdutosMaisVendidos(vendas: any[]) {
    const idsVendas = vendas.map(v => v.id)

    const { data, error } = await supabase
      .from('Venda_Produto')
      .select(`
      id_produto,
      quantidade,
      produtos (
        nome
      )
    `)
      .in('id_venda', idsVendas)

    if (error) {
      console.log(error)
      return []
    }

    return montarRanking(data)
  }

  return (

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
      }}
    >
      <Button
        style={{
          margin: 10,
        }}
        onPress={relatorioMensal}
      >
        Mensal
      </Button>


      <Button
        style={{
          margin: 10,
        }}
        onPress={relatorioTrimestral}
      >
        Trimestral
      </Button>


      <Button
        style={{
          margin: 10,
        }}
        onPress={relatorioAnual}>
        Anual
      </Button>

      <Button
        style={{
          margin: 10,
        }}
        onPress={async () => {

          const ranking = await buscarProdutosMaisVendidos(vendas)

          setProdutosMaisVendidos(ranking)

          setModalVisible(true)
        }}
      >
        Produtos mais vendidos
      </Button>

      <Text style={{ color: 'white', marginTop: 20 }}>
        Total de vendas: {totalVendas}
      </Text>

      <Text style={{ color: 'white' }}>
        Faturamento: R$ {faturamento}
      </Text>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)'
          }}
        >

          <View
            style={{
              width: '85%',
              maxHeight: '70%',
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20
            }}
          >

            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 15
              }}
            >
              Produtos mais vendidos
            </Text>

            <ScrollView>
              {produtosMaisVendidos.map((item, index) => (
                <Text
                  key={index}
                  style={{
                    marginBottom: 10,
                    fontSize: 16
                  }}
                >
                  {index + 1}. {item.nome} - {item.quantidade} vendidos
                </Text>
              ))}
            </ScrollView>

            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 15,
                alignSelf: 'center'
              }}
            >
              <Text
                style={{
                  color: 'blue',
                  fontSize: 16
                }}
              >
                Fechar
              </Text>
            </Pressable>

          </View>

        </View>
      </Modal>
    </View>
  )
}