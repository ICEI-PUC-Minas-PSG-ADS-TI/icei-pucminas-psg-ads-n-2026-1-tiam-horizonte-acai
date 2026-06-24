import ProtectedRoute from '@/components/ProtectedRoute';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import {
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    salvarVendaOffline
} from '@/utils/venda-service';

export default function RegistrarVenda() {

    const [buscaCliente, setBuscaCliente] = useState('');
    const [buscaProduto, setBuscaProduto] = useState('');

    const [clientes, setClientes] = useState<any[]>([]);
    const [produtos, setProdutos] = useState<any[]>([]);

    const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

    const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
    const [quantidade, setQuantidade] = useState('');

    const [itensVenda, setItensVenda] = useState<any[]>([]);
    const [total, setTotal] = useState(0);

    const router = useRouter();

    const [carregando, setCarregando] = useState(false);

    const [mostrarClientes, setMostrarClientes] = useState(false);
    const [mostrarProdutos, setMostrarProdutos] = useState(false);

    useEffect(() => {
        carregarClientes();
        carregarProdutos();
    }, []);

    function formatarMoeda(valor: number) {
        return valor.toLocaleString(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL',
            }
        );
    }

    async function carregarClientes() {
        const { data } = await supabase
            .from('Cliente')
            .select('*')
            .order('nome');

        if (data) setClientes(data);
    }

    function removerItem(id: number) {
        const novaLista = itensVenda.filter(
            item => item.id !== id
        );

        setItensVenda(novaLista);

        recalcularTotal(novaLista);
    }

    async function carregarProdutos() {
        const { data } = await supabase
            .from('produtos')
            .select('*')
            .order('nome');

        if (data) setProdutos(data);
    }

    function removerAcentos(texto: string) {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    const clientesFiltrados = clientes.filter(cliente =>
        removerAcentos(cliente.nome?.toLowerCase() || '')
            .includes(
                removerAcentos(buscaCliente.toLowerCase())
            )
    );
    const produtosFiltrados = produtos.filter(produto =>
        removerAcentos(produto.nome?.toLowerCase() || '')
            .includes(
                removerAcentos(buscaProduto.toLowerCase())
            )
    );
    async function finalizarVenda() {
    try {
        if (!clienteSelecionado) {
            Alert.alert('Selecione um cliente');
            return;

        }

        if (itensVenda.length === 0) {
            Alert.alert('Adicione pelo menos um produto');
            return;
        }
        for (const item of itensVenda) {

            const {
                data: produto,
                error
            } = await supabase
                .from('produtos')
                .select('*')
                .eq('id', item.id)
                .single();

            if (error) {
                throw error;
            }

            if (!produto) {
                Alert.alert(
                    'Produto não encontrado'
                );
                return;
            }

            if (produto.quantidade < item.quantidade) {
                Alert.alert(
                    'Estoque insuficiente',
                    `${produto.nome} possui apenas ${produto.quantidade} unidades`
                );
                return;
            }
        }
        const idVendedor = Number(
            await AsyncStorage.getItem(
                'idFuncionario'
            )
        );
        const { data: venda } =
            await supabase
                .from('Venda')
                .insert({
                    id_cliente:
                        clienteSelecionado.id,

                    id_vendedor:
                        idVendedor,

                    valor_total: total,

                    sincronizado: true,
                })
                .select()
                .single();

        for (const item of itensVenda) {
            await supabase
                .from('Venda_Produto')
                .insert({
                    id_venda: venda.id,

                    id_produto: item.id,

                    quantidade:
                        item.quantidade,

                    preco_unitario:
                        item.preco,
                });
        }

        for (const item of itensVenda) {

            const { data: produto } =
                await supabase
                    .from('produtos')
                    .select('*')
                    .eq('id', item.id)
                    .single();

            await supabase
                .from('produtos')
                .update({
                    quantidade:
                        produto.quantidade -
                        item.quantidade,
                })
                .eq('id', item.id);
        }
        Alert.alert(
            'Sucesso',
            'Venda registrada com sucesso!'
        );

        setItensVenda([]);
        setTotal(0);
        setClienteSelecionado(null);
        setProdutoSelecionado(null);
        setBuscaCliente('');
        setBuscaProduto('');
        setQuantidade('');

        router.back();
    } catch (error: any) {
        const erroConexao =
            error?.message?.includes('Network') ||
            error?.message?.includes('Failed to fetch');

        if (erroConexao) {

            const idVendedor = Number(
                await AsyncStorage.getItem('idFuncionario')
            );

            await salvarVendaOffline({
                cliente: clienteSelecionado,
                itens: itensVenda,
                total,
                idVendedor,
                data: new Date().toISOString(),
            });

            Alert.alert(
                'Sem internet',
                'Venda salva localmente e será sincronizada depois.'
            );

        } else {
            Alert.alert(
                'Erro',
                error?.message ||
                'Não foi possível registrar a venda.'
            );

        }
    } finally {
        setCarregando(false);
    }
}
    function confirmarVenda() {
        Alert.alert(
            'Confirmar venda',
            `Total: ${formatarMoeda(total)}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: finalizarVenda,
                },
            ]
        );
    }
    function adicionarProduto() {
        if (!produtoSelecionado) {
            Alert.alert(
                'Selecione um produto'
            );
            return;
        }

        const qtd = Number(quantidade);

        if (!quantidade || isNaN(qtd) || qtd <= 0) {
            Alert.alert(
                'Quantidade inválida',
                'Informe uma quantidade válida.'
            );
            return;
        }

        const estoqueDisponivel =
            Number(produtoSelecionado.quantidade);

        if (qtd > estoqueDisponivel) {
            Alert.alert(
                'Estoque insuficiente',
                `${produtoSelecionado.nome} possui apenas ${estoqueDisponivel} unidades em estoque.`
            );
            return;
        }

        const itemExistente = itensVenda.find(
            item => item.id === produtoSelecionado.id
        );

        const quantidadeJaAdicionada =
            itemExistente?.quantidade ?? 0;

        const quantidadeTotal =
            quantidadeJaAdicionada + qtd;

        if (quantidadeTotal > estoqueDisponivel) {
            Alert.alert(
                'Estoque insuficiente',
                `${produtoSelecionado.nome} possui apenas ${estoqueDisponivel} unidades em estoque.`
            );
            return;
        }

        const subtotal =
            produtoSelecionado.preco * qtd;

        if (itemExistente) {

            const novosItens = [...itensVenda];

            const indice = novosItens.findIndex(
                item => item.id === produtoSelecionado.id
            );

            novosItens[indice].quantidade += qtd;

            novosItens[indice].subtotal =
                novosItens[indice].quantidade *
                novosItens[indice].preco;

            setItensVenda(novosItens);

        } else {

            const novoItem = {
                id: produtoSelecionado.id,
                nome: produtoSelecionado.nome,
                preco: produtoSelecionado.preco,
                quantidade: qtd,
                subtotal,
                estoque: produtoSelecionado.quantidade,
            };

            setItensVenda([
                ...itensVenda,
                novoItem
            ]);
        }

        setTotal(prev => prev + subtotal);

        setQuantidade('');
    }
    function aumentarQuantidade(id: number) {
        const novaLista = itensVenda.map(item => {

            if (item.id !== id) return item;

            const produtoOriginal = produtos.find(
                p => p.id === id
            );

            if (
                item.quantidade + 1 >
                produtoOriginal.quantidade
            ) {
                Alert.alert(
                    'Estoque insuficiente',
                    `Restam apenas ${produtoOriginal.quantidade} unidades.`
                );

                return item;
            }

            return {
                ...item,
                quantidade: item.quantidade + 1,
                subtotal:
                    (item.quantidade + 1) *
                    item.preco,
            };
        });

        setItensVenda(novaLista);

        recalcularTotal(novaLista);
    }

    function diminuirQuantidade(id: number) {
        const novaLista = itensVenda
            .map(item => {

                if (item.id !== id) return item;

                return {
                    ...item,
                    quantidade: item.quantidade - 1,
                    subtotal:
                        (item.quantidade - 1) *
                        item.preco,
                };
            })
            .filter(item => item.quantidade > 0);

        setItensVenda(novaLista);

        recalcularTotal(novaLista);
    }

    function recalcularTotal(lista: any[]) {
        const novoTotal = lista.reduce(
            (soma, item) =>
                soma + item.subtotal,
            0
        );

        setTotal(novoTotal);
    }
    
    return (
        <ProtectedRoute
              permitidos={[
                'VENDEDOR',
                'ADMINISTRADOR',
              ]}
            >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>

                    <Text style={styles.titulo}>
                        Registrar Venda
                    </Text>

                    <Text style={styles.label}>
                        Cliente
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Pesquisar cliente..."
                        value={buscaCliente}
                        onFocus={() => setMostrarClientes(true)}
                        onChangeText={setBuscaCliente}
                    />

                    {mostrarClientes && buscaCliente.length > 0 && (
                        <View style={styles.listaPesquisa}>
                            {clientesFiltrados.slice(0, 5).map(cliente => (
                                <TouchableOpacity
                                    key={cliente.id}
                                    style={styles.itemPesquisa}
                                    onPress={() => {
                                        setClienteSelecionado(cliente);
                                        setBuscaCliente(cliente.nome);
                                        setMostrarClientes(false);
                                    }}
                                >
                                    <Text>{cliente.nome}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <Text style={styles.label}>
                        Produto
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Pesquisar produto..."
                        value={buscaProduto}
                        onFocus={() => setMostrarProdutos(true)}
                        onChangeText={setBuscaProduto}
                    />

                    {mostrarProdutos && buscaProduto.length > 0 && (
                        <View style={styles.listaPesquisa}>
                            {produtosFiltrados.slice(0, 5).map(produto => (
                                <TouchableOpacity
                                    key={produto.id}
                                    style={styles.itemPesquisa}
                                    onPress={() => {
                                        setProdutoSelecionado(produto);
                                        setBuscaProduto(produto.nome);
                                        setMostrarProdutos(false);
                                    }}
                                >
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {produto.nome}
                                    </Text>

                                    <Text>
                                        Estoque: {produto.quantidade}
                                    </Text>

                                    <Text>
                                        {formatarMoeda(produto.preco)
                                        }
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <Text style={styles.label}>
                        Quantidade
                    </Text>

                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={quantidade}
                        onChangeText={(texto) => {
                            const apenasNumeros = texto.replace(/[^0-9]/g, '');
                            setQuantidade(apenasNumeros);
                        }}
                        placeholder="Quantidade"
                    />

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={adicionarProduto}
                    >
                        <Text style={styles.botaoTexto}>
                            Adicionar Produto
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>
                        Itens da Venda
                    </Text>

                    {itensVenda.map((item, index) => (
                        <View key={index} style={styles.card}>

                            <Text style={styles.nomeProduto}>
                                {item.nome}
                            </Text>

                            <Text>
                                {item.quantidade} x {formatarMoeda(item.preco)}
                            </Text>

                            <Text>
                                Subtotal:{' '}
                                {formatarMoeda(item.subtotal)}
                            </Text>

                            <View style={styles.controlesQuantidade}>

                                <TouchableOpacity
                                    style={styles.botaoMenos}
                                    onPress={() => diminuirQuantidade(item.id)}
                                >
                                    <Text style={styles.textoBotao}>−</Text>
                                </TouchableOpacity>

                                <Text style={styles.quantidadeTexto}>
                                    {item.quantidade}
                                </Text>

                                <TouchableOpacity
                                    style={[
                                        styles.botaoMais,
                                        item.quantidade >= item.estoque &&
                                        styles.botaoDesabilitado
                                    ]}
                                    disabled={item.quantidade >= item.estoque}
                                    onPress={() => aumentarQuantidade(item.id)}
                                >
                                    <Text style={styles.textoBotao}>+</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.botaoExcluir}
                                    onPress={() =>
                                        Alert.alert(
                                            'Remover item',
                                            `Deseja remover ${item.nome} da venda?`,
                                            [
                                                {
                                                    text: 'Cancelar',
                                                    style: 'cancel',
                                                },
                                                {
                                                    text: 'Remover',
                                                    style: 'destructive',
                                                    onPress: () => removerItem(item.id),
                                                },
                                            ]
                                        )
                                    }
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={25}
                                        color="#f44336"
                                    />
                                </TouchableOpacity>

                            </View>

                        </View>
                    ))}

                    < Text style={styles.total} >
                        Total:{' '}
                        {formatarMoeda(total)}
                    </Text>

                    <TouchableOpacity
                        disabled={
                            !clienteSelecionado ||
                            itensVenda.length === 0
                        }
                        style={[
                            styles.botaoFinalizar,
                            (
                                !clienteSelecionado ||
                                itensVenda.length === 0
                            ) && styles.botaoDesabilitado
                        ]}
                        onPress={confirmarVenda}
                    >
                        <Text style={styles.botaoTexto}>
                            Finalizar Venda
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView >
        </ProtectedRoute>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },

    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
    },

    card: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },

    total: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },

    botao: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },

    botaoFinalizar: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
        alignItems: 'center',
    },

    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listaPesquisa: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginTop: 4,
        marginBottom: 10,
    },

    itemPesquisa: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    controlesQuantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 8,
    },

    botaoMenos: {
        backgroundColor: '#f44336',
        width: 25,
        height: 25,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    botaoMais: {
        backgroundColor: '#4CAF50',
        width: 25,
        height: 25,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    botaoDesabilitado: {
        backgroundColor: '#999',
    },

    botaoExcluir: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },

    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },

    quantidadeTexto: {
        fontSize: 18,
        fontWeight: 'bold',
        minWidth: 25,
        textAlign: 'center',
    },

    nomeProduto: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});