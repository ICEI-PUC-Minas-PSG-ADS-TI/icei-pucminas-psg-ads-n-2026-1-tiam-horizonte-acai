import { Button } from '@react-navigation/elements'
import { Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
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
  const [periodoAtual, setPeriodoAtual] = useState('')

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
    setPeriodoAtual('Mensal')

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
    setPeriodoAtual('Trimestral')

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
    setPeriodoAtual('Anual')

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
        backgroundColor: '#46295A',
        paddingHorizontal: 25,
        paddingTop: 30,
      }}
    >

      <View
        style={{
          marginBottom: 40,
        }}
      >

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 25,
          }}
        >

          <Pressable
            onPress={() => {
              console.log('Voltar para menu')
            }}
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -30
            }}
          >
            <Ionicons
              name="home"
              size={40}
              color="white"
            />
          </Pressable>

          <Image
            source={require('../../assets/images/logo.png')}
            style={{
              width: 110,
              height: 110,
              resizeMode: 'contain',
            }}
          />

          <View
            style={{
              width: 52,
              height: 52,
            }}
          />

        </View>

        <Text
          style={{
            color: 'white',
            fontSize: 34,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Central de Relatórios
        </Text>

        <Text
          style={{
            color: '#d6d6d6',
            fontSize: 16,
            marginTop: 14,
            lineHeight: 24,
            textAlign: 'center',
          }}
        >
          Visualize o desempenho de vendas da operação,
          acompanhe faturamento e identifique os produtos
          mais vendidos por período.
        </Text>

      </View>

      <View
        style={{
          backgroundColor: '#5EB85E',
          borderRadius: 18,
          padding: 20,
          marginBottom: 35,
        }}
      >

        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
          }}
        >
          Resumo Atual {periodoAtual ? `- ${periodoAtual}` : ''}
        </Text>

        <Text
          style={{
            color: 'white',
            fontSize: 16,
            marginBottom: 6,
          }}
        >
          Total de vendas: {totalVendas}
        </Text>

        <Text
          style={{
            color: 'white',
            fontSize: 16,
          }}
        >
          Faturamento: R$ {faturamento.toFixed(2)}
        </Text>

      </View>

      <View
        style={{
          alignItems: 'center',
        }}
      >

        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 20,
          }}
        >
          Selecionar período
        </Text>

        <Pressable
          onPress={async () => {

            await relatorioMensal()

            const ranking = await buscarProdutosMaisVendidos(vendas)

            setProdutosMaisVendidos(ranking)

            setModalVisible(true)
          }}
          style={{
            backgroundColor: '#5EB85E',
            width: '100%',
            paddingVertical: 16,
            borderRadius: 14,
            marginBottom: 15,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              fontWeight: 'bold',
            }}
          >
            Relatório Mensal
          </Text>
        </Pressable>

        <Pressable
          onPress={async () => {

            await relatorioTrimestral()

            const ranking = await buscarProdutosMaisVendidos(vendas)

            setProdutosMaisVendidos(ranking)

            setModalVisible(true)
          }}
          style={{
            backgroundColor: '#5EB85E',
            width: '100%',
            paddingVertical: 16,
            borderRadius: 14,
            marginBottom: 15,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              fontWeight: 'bold',
            }}
          >
            Relatório Trimestral
          </Text>
        </Pressable>

        <Pressable
          onPress={async () => {

            await relatorioAnual()

            const ranking = await buscarProdutosMaisVendidos(vendas)

            setProdutosMaisVendidos(ranking)

            setModalVisible(true)
          }}
          style={{
            backgroundColor: '#5EB85E',
            width: '100%',
            paddingVertical: 16,
            borderRadius: 14,
            marginBottom: 15,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              fontWeight: 'bold',
            }}
          >
            Relatório Anual
          </Text>
        </Pressable>

      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.75)'
          }}
        >

          <View
            style={{
              width: '88%',
              maxHeight: '75%',
              backgroundColor: '#46295A',
              borderRadius: 20,
              padding: 25,
              borderWidth: 2,
              borderColor: '#5EB85E',
            }}
          >

            <Text
              style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 25,
                textAlign: 'center',
              }}
            >
              Relatório de Desempenho
            </Text>

            <View
              style={{
                backgroundColor: '#5EB85E',
                borderRadius: 15,
                padding: 15,
                marginBottom: 25,
              }}
            >

              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  marginBottom: 8,
                  fontWeight: 'bold',
                }}
              >
                Total de vendas: {totalVendas}
              </Text>

              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Faturamento total: R$ {faturamento.toFixed(2)}
              </Text>

            </View>

            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 15,
              }}
            >
              Produtos mais vendidos
            </Text>

            <ScrollView>
              {produtosMaisVendidos.map((item, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    padding: 14,
                    borderRadius: 12,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    {index + 1}. {item.nome}
                  </Text>

                  <Text
                    style={{
                      color: '#5EB85E',
                      marginTop: 5,
                      fontSize: 14,
                    }}
                  >
                    {item.quantidade} unidades vendidas
                  </Text>

                </View>
              ))}
            </ScrollView>

            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 20,
                backgroundColor: '#5EB85E',
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >

              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Fechar relatório
              </Text>

            </Pressable>

          </View>

        </View>

      </Modal>

    </View>
  )
}