# Arquitetura da Solução

<span style="color:red">Pré-requisitos: <a href="3-Projeto de Interface.md"> Projeto de Interface</a></span>

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![Arquitetura da Solução](img/02-mob-arch.png)

## Diagrama de Classes

![WhatsApp Image 2026-03-26 at 18 41 54](https://github.com/user-attachments/assets/c2d861eb-8c4b-400c-90c9-72c23c5438be)

> - [Diagramas de Classes - Documentação da IBM](https://www.ibm.com/docs/pt-br/rational-soft-arch/9.6.1?topic=diagrams-class)
> - [O que é um diagrama de classe UML? | Lucidchart](https://www.lucidchart.com/pages/pt/o-que-e-diagrama-de-classe-uml)

## Modelo ER

<img width="5258" height="3365" alt="esquema_relacional" src="https://github.com/user-attachments/assets/f2fcdd18-5e0f-401e-a10f-1e75afc7414a" />

> - [Como fazer um diagrama entidade relacionamento | Lucidchart](https://www.lucidchart.com/pages/pt/como-fazer-um-diagrama-entidade-relacionamento)

## Esquema Relacional

<img width="1548" height="864" alt="Untitled" src="https://github.com/user-attachments/assets/c0e9ae1a-cd0a-4726-9a50-6097c59176f8" />

> - [Criando um modelo relacional - Documentação da IBM](https://www.ibm.com/docs/pt-br/cognos-analytics/10.2.2?topic=designer-creating-relational-model)

## Modelo Físico

Entregar um arquivo banco.sql contendo os scripts de criação das tabelas do banco de dados. Este arquivo deverá ser incluído dentro da pasta src\bd.

## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

A hospedagem da plataforma será realizada integralmente por meio do Supabase, um serviço de backend como serviço (BaaS) baseado em PostgreSQL. A escolha se justifica pela disponibilidade de um plano gratuito com recursos suficientes para o escopo do projeto, pela facilidade de integração com React Native e pela eliminação da necessidade de um servidor backend dedicado.

O Supabase concentrará três responsabilidades principais: o armazenamento dos dados em um banco de dados PostgreSQL gerenciado, a exposição automática desses dados via API REST gerada pelo serviço, e o controle de autenticação dos usuários com suporte a login por usuário e senha.

> **Links Úteis**:
>
> - [Website com GitHub Pages](https://pages.github.com/)
> - [Programação colaborativa com Repl.it](https://repl.it/)
> - [Getting Started with Heroku](https://devcenter.heroku.com/start)
> - [Publicando Seu Site No Heroku](http://pythonclub.com.br/publicando-seu-hello-world-no-heroku.html)

## Qualidade de Software

Com base na norma ISO/IEC 25010, a equipe selecionou as subcaracterísticas mais relevantes para o contexto do projeto, considerando o perfil dos usuários, os requisitos levantados e as restrições do ambiente de uso.

- Adequação funcional: Foi escolhida por ser a base de qualquer avaliação, o sistema precisa realizar corretamente o que foi especificado nos requisitos, como o registro de vendas, o controle de estoque e a geração de relatórios. A métrica utilizada será a proporção de requisitos funcionais implementados e validados em relação ao total especificado.

- Usabilidade: É relevante pois os usuários são funcionários de uma fábrica que podem ter pouca familiaridade com tecnologia. O sistema deve ser compreendido e operado sem necessidade de treinamento extenso. A métrica será o tempo médio necessário para que um novo usuário conclua tarefas básicas, como registrar uma venda, sem auxílio externo.

- Confiabilidade: Sob a perspectiva de disponibilidade, é diretamente exigida pelos requisitos do projeto, o aplicativo deve permitir o registro de vendas mesmo sem conexão com a internet. A métrica será a taxa de sucesso na sincronização de registros offline após o restabelecimento da conexão.

- Desempenho: Foi incluído pois o projeto estabelece como requisito não funcional que as requisições devem ser processadas em no máximo três segundos. A métrica será o tempo de resposta médio das operações principais do sistema, medido em condições normais de uso.

- Segurança: É um critério obrigatório dado que o sistema lida com dados de clientes e funcionários, estando sujeito à Lei Geral de Proteção de Dados (LGPD). A subcaracterística de controle de acesso será avaliada pela correta segregação de funcionalidades entre os perfis — Administrador, Gestor, Vendedor e Estoquista —, verificando se nenhum perfil consegue acessar recursos além dos permitidos.

- Portabilidade: É pertinente pela natureza mobile do projeto e pelo requisito de compatibilidade com as últimas cinco versões do sistema operacional Android. A métrica será a execução bem-sucedida das funcionalidades principais nas versões-alvo, sem falhas ou degradação de interface.

> **Links Úteis**:
>
> - [ISO/IEC 25010:2011 - Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models](https://www.iso.org/standard/35733.html/)
> - [Análise sobre a ISO 9126 – NBR 13596](https://www.tiespecialistas.com.br/analise-sobre-iso-9126-nbr-13596/)
> - [Qualidade de Software - Engenharia de Software 29](https://www.devmedia.com.br/qualidade-de-software-engenharia-de-software-29/18209/)
