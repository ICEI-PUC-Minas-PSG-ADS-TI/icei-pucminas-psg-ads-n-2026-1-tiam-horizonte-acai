# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do  diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais além das restrições do projeto.

Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto

## Personas

Jhonatan Goulart Rocha é sócio administrador da Horizonte do Açaí, atuando no comércio varejista de produtos alimentícios. Ele é responsável pela gestão do negócio, incluindo controle de vendas, estoque e decisões estratégicas.
Atualmente, utiliza o Excel para realizar o controle das informações, mas enfrenta dificuldades com a falta de integração dos dados e organização. Por isso, busca uma solução prática e intuitiva que otimize os processos e facilite a tomada de decisões.

Márcio Maciel é consultor na Horizonte do Açaí e atua atendendo clientes na região de Betim. Seu trabalho envolve acompanhar pedidos, manter o relacionamento com os clientes e apoiar nas vendas da empresa.
Ele precisa de acesso rápido às informações de produtos, estoque e clientes para realizar um atendimento eficiente. Atualmente, pode enfrentar dificuldades devido à falta de integração dos dados, o que pode impactar na agilidade e na qualidade do atendimento.

Hiago Carneiro Campos tem 23 anos e é o responsável pelo controle de estoque da fábrica. Ele organiza a entrada e saída de produtos e insumos, sendo uma peça fundamental para o funcionamento do negócio. Marcos precisa manter o estoque sempre atualizado e evitar tanto a falta quanto o excesso de produtos. No entanto, ele enfrenta problemas devido à ausência de um sistema automatizado, o que dificulta o controle preciso e a identificação do momento ideal para reposição dos itens.

Poliana Maciel de Souza Goulart é sócia administradora da Horizonte do Açaí e atua na parte administrativa da empresa. Ela é responsável pela organização de processos, controle de informações e apoio na gestão do negócio.
No seu dia a dia, precisa lidar com dados de vendas, clientes e estoque, buscando manter tudo organizado e atualizado. No entanto, enfrenta dificuldades com a falta de integração das informações, o que pode gerar retrabalho e dificultar a tomada de decisões. Por isso, busca uma solução prática que facilite a gestão e melhore a eficiência das atividades administrativas.

Enumere e detalhe as personas da sua solução. Para tanto, baseie-se tanto nos documentos disponibilizados na disciplina e/ou nos seguintes links:

> **Links Úteis**:
> - [Rock Content](https://rockcontent.com/blog/personas/)
> - [Hotmart](https://blog.hotmart.com/pt-br/como-criar-persona-negocio/)
> - [O que é persona?](https://resultadosdigitais.com.br/blog/persona-o-que-e/)
> - [Persona x Público-alvo](https://flammo.com.br/blog/persona-e-publico-alvo-qual-a-diferenca/)
> - [Mapa de Empatia](https://resultadosdigitais.com.br/blog/mapa-da-empatia/)
> - [Mapa de Stalkeholders](https://www.racecomunicacao.com.br/blog/como-fazer-o-mapeamento-de-stakeholders/)
>
Lembre-se que você deve ser enumerar e descrever precisamente e personalizada todos os clientes ideais que sua solução almeja.

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
|Estoquista          | Cadastrar, editar e remover produtos do estoque       |Manter o controle atualizado dos insumos 
|Gestor              | Visualizar o estoque em tempo real                    |Tomar decisões de compra
|Vendedor            | Registrar vendas rapidamente                          |Agilizar o atendimento 
|Sistema             | Atualizar automaticamente o estoque após uma venda    |Evitar inconsistências 
|Gestor              | Visualizar clientes mais ativos                       |Criar estratégias de fidelização 
|Administrador       | Cadastrar usuários com diferentes permissões          |Controlar o acesso ao sistema 
|Gestor              | Gerar relatórios de vendas por período                | Analisar o desempenho da empresa |
|Gestor              | Visualizar ranking de vendedores                      |Acompanhar produtividade

Apresente aqui as histórias de usuário que são relevantes para o projeto de sua solução. As Histórias de Usuário consistem em uma ferramenta poderosa para a compreensão e elicitação dos requisitos funcionais e não funcionais da sua aplicação. Se possível, agrupe as histórias de usuário por contexto, para facilitar consultas recorrentes à essa parte do documento.

> **Links Úteis**:
> - [Histórias de usuários com exemplos e template](https://www.atlassian.com/br/agile/project-management/user-stories)
> - [Como escrever boas histórias de usuário (User Stories)](https://medium.com/vertice/como-escrever-boas-users-stories-hist%C3%B3rias-de-usu%C3%A1rios-b29c75043fac)
> - [User Stories: requisitos que humanos entendem](https://www.luiztools.com.br/post/user-stories-descricao-de-requisitos-que-humanos-entendem/)
> - [Histórias de Usuários: mais exemplos](https://www.reqview.com/doc/user-stories-example.html)
> - [9 Common User Story Mistakes](https://airfocus.com/blog/user-story-mistakes/)


## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade | Responsável |
|------|-----------------------------------------|----| ----|
|RF-01| O sistema deve permitir que os colaboradores acessem as funcionalidades do aplicativo mediante a inserção de credenciais válidas (usuário e senha). | ALTA | Maria Clara |
|RF-02| O sistema deve permitir que o usuário a inclua, remova e altere itens(produtos/insumos) no estoque | ALTA | Maria Clara |
|RF-03| O sistema deve permitir o cadastro e a edição de clientes para registro de dados para histórico de compras e fidelização | ALTA | Samuel Vitor |
|RF-04| O sistema deve permitir o cadastro de colaboradores com perfis de acesso distintos(vendedor, estoque, gestor e administrador) | ALTA | Samuel Vitor |
|RF-05| O sistema deve abater os itens do estoque automaticamente ao finalizar uma venda | MÉDIA | Lucas Vinícius |
|RF-06| O sistema deve permitir que usuários com o perfil de Vendedor ou Gestor realizem o lançamento de vendas | ALTA | Samuel Vitor |
|RF-07| O sistema deve permitir a geração de relatórios de desempenho de vendas, oferecendo filtros pré-definidos de períodos fechados. Sendo eles: Mensal: Consolidação de dados do mês anterior completo; Trimestral: Consolidação dos últimos três meses fiscais fechados; Anual: Consolidação do ano civil anterior ou dos últimos 12 meses | ALTA | Lucas Vinícius |
|RF-08| O sistema deve exibir um ranking decrescente de vendas(valor monetário) por funcionário baseado no mês atual | BAIXA | Carlos Santos |
|RF-09| O sistema deve exibir um ranking decrescente dos clientes que geraram maior receita para a fábrica em períodos selecionados (Mensal, Trimestral ou Anual) | ALTA | Carlos Santos |
|RF-10| O sistema deve calcular o somatório das vendas realizadas no mês corrente e compará-lo com a meta mensal pré-estabelecida pela gerência | BAIXA | Carlos Santos |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-01| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-02| Deve processar requisições do usuário em no máximo 3s |  BAIXA | 
|RNF-03| O aplicativo deve permitir o registro de vendas mesmo sem conexão com a internet, armazenando os dados localmente e sincronizando-os assim que a conexão for restabelecida |  BAIXA | 
|RNF-04| O sistema de estar em conformidade com a Lei Geral de Proteção de Dados(LGPD) |  ALTA | 
|RNF-05| O sistema deve seguir normas de acessibilidade WCAG 2.2 (Web Content Accessibility Guidelines) |  ALTA | 
|RNF-06| O aplicativo deve ser desenvolvido utilizando o framework React Native (Cross-Platform), garantindo uma experiência próxima à nativa e suporte estável nas últimas 5 versões do sistema operacional Android |  ALTA | 

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

## Diagrama de Casos de Uso


**Gerenciar Funcionários**

<img width="880" height="666" alt="Gerenciar Funcionarios" src="https://github.com/user-attachments/assets/557680c3-0a81-4862-a498-ed72cf079713" />


**Gerenciar Estoque**

<img width="880" height="666" alt="Gerenciar Estoque" src="https://github.com/user-attachments/assets/6b6bbc53-1751-4a7f-bed1-f8416f171168" />


**Gerenciar Clientes**

<img width="880" height="666" alt="Gerenciar Clientes" src="https://github.com/user-attachments/assets/604c38af-305e-4b96-a02a-5cfccfccd085" />


**Registrar Venda**

<img width="880" height="666" alt="Registar Venda" src="https://github.com/user-attachments/assets/e01d561b-523b-4989-baaa-cde5dd62f8e9" />


**Gerar Relatório de Vendas**

<img width="880" height="666" alt="Consultar Relatorio de Vendas" src="https://github.com/user-attachments/assets/36f677c4-d8de-4bb8-9906-617bffc0836c" />


**Consultar Ranking de Vendedores**

<img width="880" height="670" alt="Consultar Ranking Vendedores" src="https://github.com/user-attachments/assets/79af490e-41c5-424b-8184-72ef88bfd701" />


**Consultar Ranking de Clientes**

<img width="880" height="666" alt="Consultar Ranking Clientes" src="https://github.com/user-attachments/assets/d0b6cf2c-c817-4457-bbb3-2ecad2430e1a" />

| Ator | Descrição                                             |
|--|-------------------------------------------------------|
| Funcionário | Ator generalista que representa qualquer colaborador autenticado no sistema |
| Vendedor | Colaborador responsável pelo atendimento direto e registro de vendas |
| Estoque | Colaborador responsável pela manutenção física e digital dos insumos e produtos |
| Gestor | Usuário com permissões estratégicas para visualização de performance e metas |
| Administrador | Usuário com permissões totais, incluindo a gestão de contas de outros funcionários |

| Caso de Uso | Descrição        | Ator(es) |
|--|------------------------------|-------------------------|
| Gerenciar Funcionários | Funcionários	Criação e manutenção de perfis de acesso dos colaboradores da fábrica | Administrador |
| Gerenciar Estoque | Permite incluir, alterar e excluir itens (insumos/produtos) e ajustar quantidades | Estoquista, Gestor |
| Gerenciar Cliente | Cadastro e edição de informações de clientes para histórico e fidelização | Vendedor, Gestor |
| Registrar Venda | Realiza o lançamento de vendas e dispara a baixa automática de itens no estoque | Vendedor, Gestor |
| Gerar Relatório de Vendas | Gera consolidados financeiros mensais, trimestrais ou anuais | Gestor |
| Consultar Ranking Vendedores | Exibe a performance dos vendedores por volume de vendas no período | Vendedor, Gestor |
| Consultar Ranking Clientes | Lista os clientes que geraram maior faturamento para a fábrica | Gestor |

> **Links Úteis**:
> - [Criando Casos de Uso](https://www.ibm.com/docs/pt-br/elm/6.0?topic=requirements-creating-use-cases)
> - [Como Criar Diagrama de Caso de Uso: Tutorial Passo a Passo](https://gitmind.com/pt/fazer-diagrama-de-caso-uso.html/)
> - [Lucidchart](https://www.lucidchart.com/)
> - [Astah](https://astah.net/)
> - [Diagrams](https://app.diagrams.net/)

# Matriz de Rastreabilidade

|ID    | Descrição do Requisito  | Funcionalidade | Tela | Status |
|------|-----------------------------------------|----| ----| ---- |
|RF-01| O sistema deve permitir que os colaboradores acessem as funcionalidades do aplicativo mediante a inserção de credenciais válidas (usuário e senha). | Realizar Login | Tela de Login | Pendente |
|RF-02| O sistema deve permitir que o usuário a inclua, remova e altere itens(produtos/insumos) no estoque | Gerenciar Estoque | Tela de Estoque | Pendente |
|RF-03| O sistema deve permitir o cadastro e a edição de clientes para registro de dados para histórico de compras e fidelização | Gerenciar Clientes | Tela de Clientes | Pendente |
|RF-04| O sistema deve permitir o cadastro de colaboradores com perfis de acesso distintos(vendedor, estoque, gestor e administrador) | Gerenciar Colaboradores e Permissões | Tela de Funcionários | Pendente |
|RF-05| O sistema deve abater os itens do estoque automaticamente ao finalizar uma venda | Atualizar Estoque | Tela de Vendas | Pendente |
|RF-06| O sistema deve permitir que usuários com o perfil de Vendedor ou Gestor realizem o lançamento de vendas | Gerenciar Vendas | Tela de Vendas | Pendente |
|RF-07| O sistema deve permitir a geração de relatórios de desempenho de vendas, oferecendo filtros pré-definidos de períodos fechados. Sendo eles: Mensal: Consolidação de dados do mês anterior completo; Trimestral: Consolidação dos últimos três meses fiscais fechados; Anual: Consolidação do ano civil anterior ou dos últimos 12 meses | Gerar Relatórios | Tela de Relatórios | Pendente |
|RF-08| O sistema deve exibir um ranking decrescente de vendas(valor monetário) por funcionário baseado no mês atual | Gerar Ranking de Vendas por Funcionário | Tela de Rankings | Pendente |
|RF-09| O sistema deve exibir um ranking decrescente dos clientes que geraram maior receita para a fábrica em períodos selecionados (Mensal, Trimestral ou Anual) | Gerar Ranking de Clientes por Receita | Tela de Rankings | Pendente |
|RF-10| O sistema deve calcular o somatório das vendas realizadas no mês corrente e compará-lo com a meta mensal pré-estabelecida pela gerência | Gerenciar Metas | Tela de Metas | Pendente |


|ID    | Descrição do Requisito  | Funcionalidade | Tela | Status |
|------|-----------------------------------------|----| ----| ---- |
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | Adaptar interface para diferentes tamanhos de tela | Todas as Telas | Pendente |
|RNF-002| Deve processar requisições do usuário em no máximo 3s | Otimizar desempenho das requisições | Todas as Telas |
Pendente|
|RNF-003| O aplicativo deve permitir o registro de vendas mesmo sem conexão com a internet, armazenando os dados localmente e sincronizando-os assim que a conexão for restabelecida |  Implementar modo offline e sincronização de dados | Tela de Vendas | Pendente |
|RNF-004| O sistema de estar em conformidade com a Lei Geral de Proteção de Dados(LGPD) | Garantir segurança e privacidade dos dados dos usuários | Todas as telas | Pendente |
|RNF-005| O sistema deve seguir normas de acessibilidade WCAG 2.2 (Web Content Accessibility Guidelines) |  Implementar acessibilidade na interface (cores, contraste, navegação) | Todas as telas | Pendente |


> **Links Úteis**:
> - [Artigo Engenharia de Software 13 - Rastreabilidade](https://www.devmedia.com.br/artigo-engenharia-de-software-13-rastreabilidade/12822/)
> - [Verificação da rastreabilidade de requisitos usando a integração do IBM Rational RequisitePro e do IBM ClearQuest Test Manager](https://developer.ibm.com/br/tutorials/requirementstraceabilityverificationusingrrpandcctm/)
> - [IBM Engineering Lifecycle Optimization – Publishing](https://www.ibm.com/br-pt/products/engineering-lifecycle-optimization/publishing/)


# Gerenciamento de Projeto

O gerenciamento do projeto será baseado nas boas práticas do Project Management Institute, conforme descritas no PMBOK, considerando as principais áreas de conhecimento.
O projeto será conduzido de forma incremental, utilizando conceitos de metodologias ágeis, permitindo entregas contínuas e adaptação às necessidades identificadas ao longo do desenvolvimento.

 **Integração:**

A integração do projeto será realizada por meio de reuniões periódicas da equipe, garantindo alinhamento entre os membros e acompanhamento do progresso das atividades. Ferramentas como quadros Kanban serão utilizadas para organização das tarefas.

**Escopo:**

O escopo do projeto contempla o desenvolvimento de um aplicativo móvel para gestão de uma fábrica de açaí, incluindo funcionalidades como:
 - Controle de estoque
 - Registro de vendas
 - Gestão de clientes
 - Relatórios e rankings
   
Qualquer alteração no escopo deverá ser discutida e validada pela equipe.

**Cronograma:**

O projeto será dividido em Sprints, com entregas incrementais ao longo do semestre. Cada Sprint terá duração definida (ex: 1 ou 2 semanas), com metas específicas, como:

 - Sprint 1: Levantamento de requisitos e prototipação
 - Sprint 2: Desenvolvimento do módulo de login e usuários
 - Sprint 3: Implementação do controle de estoque
 - Sprint 4: Registro de vendas
 - Sprint 5: Relatórios e rankings

**Custos:**

O orçamento estimado do projeto é de R$ 162.900,00, distribuído entre recursos humanos, infraestrutura, software e serviços. O controle de custos será feito com base no planejamento inicial, evitando extrapolação do orçamento.

**Qualidade:**

Serão adotadas boas práticas de desenvolvimento, testes funcionais e validação com base nos requisitos definidos. O sistema deverá atender aos requisitos não funcionais, como desempenho, acessibilidade e conformidade com a LGPD.

**Recursos:**

A equipe será composta por desenvolvedores, analistas e responsáveis pelos testes. Cada membro terá responsabilidades bem definidas para garantir produtividade e organização.

**Comunicação:**

A comunicação será realizada por meio de:

 - Reuniões semanais
 - Ferramentas digitais (ex: WhatsApp, Discord ou Teams)
 - Atualizações no quadro Kanban

**Riscos:**

Alguns riscos identificados incluem:

 - Atraso na entrega das funcionalidades
 - Dificuldade técnica com o desenvolvimento mobile
 - Limitação devido à restrição de não utilizar backend
 - Para mitigar esses riscos, serão realizadas revisões frequentes e divisão equilibrada das tarefas.

**Aquisições:**

Não há previsão de aquisição de softwares pagos, sendo priorizado o uso de ferramentas gratuitas e de código aberto.

**Partes Interessadas:**

As principais partes interessadas incluem:

 - Equipe de desenvolvimento
 - Professores avaliadores
 - Usuários finais (gestores, vendedores e estoquistas da fábrica)

<!--
## Gerenciamento de Tempo

Com diagramas bem organizados que permitem gerenciar o tempo nos projetos, o gerente de projetos agenda e coordena tarefas dentro de um projeto para estimar o tempo necessário de conclusão.

![Diagrama de rede simplificado notação francesa (método francês)](img/02-diagrama-rede-simplificado.png)

O gráfico de Gantt ou diagrama de Gantt também é uma ferramenta visual utilizada para controlar e gerenciar o cronograma de atividades de um projeto. Com ele, é possível listar tudo que precisa ser feito para colocar o projeto em prática, dividir em atividades e estimar o tempo necessário para executá-las.

![Gráfico de Gantt](img/02-grafico-gantt.png)
-->

## Gerenciamento de Equipe

O gerenciamento da equipe será realizado com foco na organização, colaboração e produtividade dos membros envolvidos no projeto.

**Estrutura da Equipe:**

A equipe será dividida de acordo com as responsabilidades, conforme os requisitos do projeto:

 - Gerente de Projeto: responsável pelo planejamento, acompanhamento e organização geral
 - Desenvolvedores: responsáveis pela implementação das funcionalidades
 - Analistas: responsáveis pela modelagem, requisitos e documentação
 - Testadores: responsáveis por validar o funcionamento do sistema

**Distribuição de Tarefas:**

As tarefas serão distribuídas com base nas competências de cada integrante, conforme definido na tabela de requisitos. Cada membro será responsável por funcionalidades específicas, garantindo maior organização e especialização.

**Metodologia de Trabalho**

Será utilizada uma abordagem baseada em metodologias ágeis, com uso de:

 - Quadro Kanban para controle de tarefas
 - Sprints para organização das entregas
 - Revisões periódicas

**Acompanhamento de Atividades:**

O progresso da equipe será monitorado por meio de:

 - Atualização constante das tarefas
 - Reuniões semanais de alinhamento
 - Avaliação de entregas por Sprint

**Comunicação Interna:**

A equipe utilizará canais digitais para comunicação rápida e eficiente, garantindo alinhamento contínuo e resolução ágil de problemas.

**Resolução de Conflitos:**

Possíveis conflitos serão resolvidos por meio de diálogo entre os membros, com mediação do gerente de projeto quando necessário, visando manter um ambiente colaborativo.

![Simple Project Timeline](img_projeto.png)

![Simple Project Timeline](img/02-project-timeline.png)

## Gestão de Orçamento

| Item | Valor (R$)|
|--|-------------------------------------------------------|
| Recursos humanos | 120.000,00 |
| Hardware | 22.000,00 |
| Rede | 4.800,00 |
| Software | 9.600,00 |
| Serviços | 6.500,00 |
| **Total** | **162.900,00** |
