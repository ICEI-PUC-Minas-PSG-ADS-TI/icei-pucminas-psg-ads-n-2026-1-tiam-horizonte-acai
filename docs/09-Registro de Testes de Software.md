# Registro de Testes de Software

<span style="color:red">Pré-requisitos: <a href="3-Projeto de Interface.md"> Projeto de Interface</a></span>, <a href="8-Plano de Testes de Software.md"> Plano de Testes de Software</a>

## Descrição Geral

Este relatório apresenta as evidências dos testes de software realizados no sistema da fornecedora de açaí, com base no plano de testes previamente definido. O objetivo foi validar o correto funcionamento das funcionalidades críticas do sistema, garantindo que os requisitos funcionais e não funcionais fossem atendidos.

Os testes foram conduzidos em ambiente controlado, utilizando dispositivos móveis Android e emuladores, simulando o uso real por diferentes perfis de usuários.

## Execução dos Testes
### Teste 1 — Autenticação de Usuário
**Cenário:** Login com credenciais válidas e inválidas

**Resultado obtido:**

- Login com dados corretos → acesso permitido

- Login com senha incorreta → mensagem de erro exibida

**Status:** ✅ Aprovado

---

### Teste 2 — Gestão de Estoque
**Cenário:** Cadastro, edição e exclusão de produtos

**Resultado obtido:**

- Cadastro realizado com sucesso
- Edição refletida corretamente
- Exclusão removeu o item da lista
  
**Status:** ✅ Aprovado

---

### Teste 3 — Cadastro de Clientes

**Cenário:** Cadastro e edição de clientes

**Resultado obtido:**

- Dados armazenados corretamente
- Alterações atualizadas sem inconsistência
- 
**Status:** ✅ Aprovado

  ---
  
### Teste 4 — Controle de Acesso

**Cenário:** Verificação de permissões por perfil

**Resultado obtido:**
- Perfis respeitaram restrições de acesso
- Usuários não autorizados não acessaram funções restritas
  
**Status:** ✅ Aprovado

---

### Teste 5 — Registro de Vendas

**Cenário:** Realização de venda

**Resultado obtido:**
- Venda registrada corretamente
- Dados persistidos no sistema

**Status:** ✅ Aprovado

---

### Teste 6 — Baixa Automática de Estoque

**Cenário:** Atualização do estoque após venda

**Resultado obtido:**
- Quantidade do produto reduzida automaticamente
  
**Status:** ✅ Aprovado

---

### Teste 7 — Geração de Relatórios

**Cenário:** Relatórios mensal, trimestral e anual

**Resultado obtido:**
- Dados exibidos corretamente conforme período selecionado

**Status:** ✅ Aprovado

---

### Teste 8 — Ranking de Clientes

**Cenário:** Ordenação por receita

**Resultado obtido:**
- Ranking exibido em ordem decrescente corretamente

**Status:** ✅ Aprovado

---

### Teste 9 — Funcionamento Offline

**Cenário:** Registro de venda sem internet

**Resultado obtido:**
- Venda armazenada localmente
- Sincronização realizada após reconexão

**Status:** ⚠️ Parcialmente aprovado

**Observação:** Pequeno atraso na sincronização identificado

---

### Teste 10 — Responsividade

**Cenário:** Uso em diferentes dispositivos

**Resultado obtido:**
- Interface adaptada corretamente

**Status:** ✅ Aprovado

---

## Conclusão dos Testes de Software

Os testes demonstraram que o sistema atende à maior parte dos requisitos especificados, especialmente os de alta prioridade. Pequenos ajustes ainda podem ser realizados em funcionalidades não críticas, como sincronização offline.

O sistema encontra-se apto para uso em ambiente real, com baixo risco operacional.





