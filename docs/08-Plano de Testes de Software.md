# Plano de Testes de Software

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Especificação do Projeto</a></span>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>

## Cenários de Teste

### Cenário 1 — Autenticação de Usuário (RF-01)

**Descrição:**
Validar o acesso ao sistema por meio de credenciais.

**Funcionalidade avaliada:**
Login de usuários

**Usuários:**
Todos os colaboradores

**Resultado esperado:**
Apenas usuários com credenciais válidas acessam o sistema

---

### Cenário 2 — Gestão de Estoque (RF-02)

**Descrição:**
Testar operações de cadastro, edição e exclusão de produtos.

**Funcionalidade avaliada:**
CRUD de produtos

**Usuários:**
Estoquista, Administrador

**Resultado esperado:**
Operações realizadas corretamente e refletidas no sistema

---

### Cenário 3 — Cadastro de Clientes (RF-03)

**Descrição:**
Validar o cadastro e edição de clientes.

**Funcionalidade avaliada:**
Gestão de clientes

**Usuários:**
Vendedor, Gestor

**Resultado esperado:**
Clientes cadastrados e atualizados corretamente

---

### Cenário 4 — Controle de Acesso (RF-04)

**Descrição:**
Testar permissões de acesso por perfil.

**Funcionalidade avaliada:**
Perfis de usuário

**Usuários:**
Administrador

**Resultado esperado:**
Cada perfil acessa apenas suas funcionalidades

---

### Cenário 5 — Registro de Vendas (RF-06)

**Descrição:**
Validar o processo de venda.

**Funcionalidade avaliada:**
Lançamento de vendas

**Usuários:**
Vendedor, Gestor

**Resultado esperado:**
Venda registrada corretamente

---

### Cenário 6 — Baixa de Estoque (RF-05)

**Descrição:**
Verificar atualização automática do estoque.

**Funcionalidade avaliada:**
Integração vendas + estoque

**Resultado esperado:**
Quantidade reduzida corretamente após venda

---

### Cenário 7 — Relatórios (RF-07)

**Descrição:**
Testar geração de relatórios por período.

**Funcionalidade avaliada:**
Relatórios de vendas

**Usuários:**
Gestor

**Resultado esperado:**
Dados consolidados corretamente

---

### Cenário 8 — Ranking de Clientes (RF-09)

**Descrição:**
Validar ranking de clientes por receita.

**Funcionalidade avaliada:**
Ranking

**Usuários:**
Gestor

**Resultado esperado:**
Lista ordenada corretamente

---

### Cenário 9 — Responsividade (RNF-01)

**Descrição:**
Testar adaptação da interface.

**Resultado esperado:**
Interface funcional em diferentes telas

---

### Cenário 10 — Modo Offline (RNF-03)

**Descrição:**
Validar funcionamento sem internet.

**Resultado esperado:**
Dados armazenados localmente e sincronizados depois

## Grupo de Usuários
- Vendedor

- Estoquista

- Gestor

- Administrador

## Ferramentas Utilizadas
- Dispositivos Android

- Emulador Android Studio

- Planilhas para registro de testes

- Logs do sistema
