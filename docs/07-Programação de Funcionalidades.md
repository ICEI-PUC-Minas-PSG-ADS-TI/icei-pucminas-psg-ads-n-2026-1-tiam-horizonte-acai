# Programação de Funcionalidades

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Especificação do Projeto</a></span>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>, <a href="4-Metodologia.md"> Metodologia</a>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>, <a href="5-Arquitetura da Solução.md"> Arquitetura da Solução</a>

## Relação entre Requisitos e Implementação

A implementação do sistema foi realizada com base nos requisitos funcionais definidos na etapa de especificação. Cada funcionalidade foi desenvolvida utilizando React Native com integração ao Supabase, garantindo persistência de dados, autenticação e controle de acesso.

## Requisitos Implementados
RF-01 – Autenticação de Usuários

Descrição: Login com usuário e senha

Responsável: Maria Clara

Código:

  const login = async (email, senha) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });
  if (error) throw error;
  return data;
};

RF-02 – Gerenciamento de Estoque

Descrição: Adicionar, editar e remover produtos

Responsável: Maria Clara

Código:

await supabase.from('produtos').insert([{nome, quantidade, preco]});

await supabase.from('produtos').update({ quantidade }).eq('id', id);

await supabase.from('produtos').delete().eq('id', id);

RF-03 – Cadastro de Clientes

Responsável: Samuel Vitor

Código:

await supabase.from('clientes').insert([{nome, cnpj, endereco, telefone}]);

RF-04 – Cadastro de Colaboradores

Descrição: Controle de perfis (admin, gestor, vendedor, estoquista)

Responsável: Samuel Vitor

Implementação:

Uso de autenticação do Supabase
Definição de roles no banco

Como testar:

Criar usuários com perfis diferentes
Validar permissões de acesso

RF-05 – Baixa Automática de Estoque

Responsável: Lucas Vinícius

Código:

const registrarVenda = async (venda) => {
  await supabase.from('vendas').insert([venda]);

  await supabase
    .from('produtos')
    .update({
      quantidade: supabase.raw('quantidade - ' + venda.quantidade)
    })
    .eq('id', venda.produto_id);
};

RF-06 – Registro de Vendas

Responsável: Samuel Vitor

Código:

await supabase.from('vendas').insert([{cliente_id, produto_id, quantidade, data: new Date()}]);

RF-07 – Relatórios de Vendas

Responsável: Lucas Vinícius

Código:

const relatorioMensal = async () => {
  return await supabase
    .from('vendas')
    .select('*')
    .gte('data', inicioMes)
    .lte('data', fimMes);
};

RF-08 – Ranking de Vendedores

Responsável: Carlos Santos

Código:

await supabase
  .from('vendas')
  .select('funcionario_id, sum(valor)')
  .group('funcionario_id')
  .order('sum', { ascending: false });

RF-09 – Ranking de Clientes

Responsável: Carlos Santos

Implementação: Consulta agregada no banco

RF-10 – Comparação com Meta

Responsável: Carlos Santos

Código: 

const total = vendas.reduce((acc, v) => acc + v.valor, 0);
const atingiuMeta = total >= metaMensal;


## Integração com a Arquitetura

A implementação está alinhada com a arquitetura definida:

- Frontend: React Native (Expo)
- Backend: Supabase
- Banco de dados: PostgreSQL
- Comunicação: API REST automática

## Verificação da Implementação

A validação das funcionalidades foi realizada por meio de:

- Testes manuais no aplicativo
- Verificação direta no painel do Supabase
- Execução dos fluxos principais:
- Login
- Cadastro
- Venda
- Relatórios

> **Links Úteis**:
>
> - [Trabalhando com HTML5 Local Storage e JSON](https://www.devmedia.com.br/trabalhando-com-html5-local-storage-e-json/29045)
> - [JSON Tutorial](https://www.w3resource.com/JSON)
> - [JSON Data Set Sample](https://opensource.adobe.com/Spry/samples/data_region/JSONDataSetSample.html)
> - [JSON - Introduction (W3Schools)](https://www.w3schools.com/js/js_json_intro.asp)
> - [JSON Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/json/index.htm)
