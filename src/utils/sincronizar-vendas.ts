import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export async function sincronizarVendas() {

    const vendasPendentes =
        await AsyncStorage.getItem('vendasPendentes');

    console.log('VENDAS OFFLINE:', vendasPendentes);
    if (!vendasPendentes) return;

    const lista =
        JSON.parse(vendasPendentes);

    const vendasRestantes = [];

    for (const vendaOffline of lista) {

        try {

            // verifica estoque

            let estoqueValido = true;

            for (const item of vendaOffline.itens) {

                const { data: produto } =
                    await supabase
                        .from('produtos')
                        .select('*')
                        .eq('id', item.id)
                        .single();

                if (
                    !produto ||
                    produto.quantidade < item.quantidade
                ) {
                    estoqueValido = false;
                    break;
                }
            }

            if (!estoqueValido) {

                Alert.alert(
                    'Venda offline cancelada',
                    'Um dos produtos não possui mais estoque.'
                );

                continue;
            }
            const {
                data: venda,
                error: erroVenda
            } = await supabase
                .from('Venda')
                .insert({
                    id_cliente: vendaOffline.cliente.id,
                    id_vendedor: vendaOffline.idVendedor,
                    valor_total: vendaOffline.total,
                    sincronizado: true,
                })
                .select()
                .single();

            console.log(
                'ERRO VENDA:',
                erroVenda
            );

            // itens

            for (const item of vendaOffline.itens) {

                await supabase
                    .from('Venda_Produto')
                    .insert({
                        id_venda: venda.id,
                        id_produto: item.id,
                        quantidade: item.quantidade,
                        preco_unitario: item.preco,
                    });

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
                'Venda sincronizada',
                `Venda de R$ ${vendaOffline.total.toFixed(2)} enviada com sucesso.`
            );

        } catch (error) {

            console.log(
                'ERRO SINCRONIZANDO:',
                error
            );
            vendasRestantes.push(vendaOffline);
        }
    }

    await AsyncStorage.setItem(
        'vendasPendentes',
        JSON.stringify(vendasRestantes)
    );
}