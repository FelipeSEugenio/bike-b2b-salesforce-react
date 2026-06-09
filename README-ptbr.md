# 🚴 Bike B2B Sales App — React + GraphQL UI API

> Uma aplicação Salesforce de nível profissional construída com React, TypeScript e a Salesforce GraphQL UI API — **sem uma linha de Apex.**

🇺🇸 English: [README.md](./README.md)

![Salesforce](https://img.shields.io/badge/Salesforce-Multi--Framework-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![GraphQL](https://img.shields.io/badge/GraphQL-UI_API-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Dark_Mode-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/Status-Ativo-brightgreen?style=for-the-badge)

---

## 🧠 Visão Geral do Projeto

O **Bike B2B Sales App** é uma aplicação Salesforce completa que roda como um **React uiBundle** dentro do runtime **Salesforce Multi-Framework / Agentforce 360**. Desenvolvido como um **projeto de portfólio profissional**, ele demonstra como uma UI moderna e nativa de framework se parece no Salesforce — substituindo padrões tradicionais baseados em Apex por acesso declarativo a dados via GraphQL e um design system customizado.

Representantes de vendas e compradores B2B podem:

- 🔍 **Navegar** por um catálogo de produtos com busca e filtro por marca em tempo real
- 🛒 **Montar** pedidos com controle de quantidade por linha e painel lateral flutuante
- 🔗 **Associar** pedidos a Contas Salesforce via lookup dinâmico
- 📊 **Acompanhar** pedidos pelo ciclo de vida com um dashboard de status
- ✅ **Submeter** pedidos com validação server-side via Flow — sem Apex

---

## 💼 Cenário de Negócio

Uma distribuidora de bicicletas precisa de uma solução Salesforce para modernizar suas operações de vendas B2B e abandonar processos manuais em planilhas.

O time de vendas precisa:

- Navegar por um catálogo interno de produtos em tempo real
- Montar pedidos de compra em nome de contas clientes
- Submeter pedidos com validação automática de dados
- Monitorar os status dos pedidos de forma centralizada via dashboard

Este projeto simula esse fluxo completo dentro de uma org Salesforce, usando apenas a GraphQL UI API nativa da plataforma e automação declarativa — sem nenhum backend Apex customizado.

---

## ⚡ Stack Tecnológica

| Camada             | Tecnologia                                           |
| ------------------ | ---------------------------------------------------- |
| **Frontend**       | React (TypeScript)                                   |
| **Runtime**        | Salesforce Multi-Framework uiBundle                  |
| **Acesso a Dados** | Salesforce GraphQL UI API via `@salesforce/sdk-data` |
| **Estilização**    | Tailwind CSS (design tokens customizados, dark mode) |
| **Validação**      | Salesforce Record-Triggered Flow                     |
| **Build**          | Vite / npm                                           |

---

## 🏗️ Arquitetura

### Salesforce Multi-Framework uiBundle

A aplicação é implantada como um **uiBundle** em uma org Salesforce e exposta via App Launcher ou site do Experience Cloud. O runtime Multi-Framework cuida do bootstrap, contexto de autenticação e injeção de SDK — o app React apenas consome as APIs de SDK fornecidas pela plataforma.

### 🔌 Camada de Dados — GraphQL UI API (Sem Apex)

Todo acesso a dados passa pela **Salesforce GraphQL UI API** via `@salesforce/sdk-data`. Não existe controller Apex em nenhum ponto do fluxo de dados.

```
Componentes React
      │
      ▼
  Custom Hooks  (useBikeCatalog, useOrders)
      │
      ▼
  graphqlClient.ts  ←  createDataSDK()
      │
      ▼
  Salesforce GraphQL UI API
      │
      ▼
  Bike__c  /  Bike_Order__c  /  Account
```

- **`src/api/graphqlClient.ts`** — gateway único e tipado para todas as operações GraphQL. Inicializa o SDK, executa queries/mutations, desempacota `response.data` e expõe erros tipados.
- **`src/api/queries.ts`** — centraliza todas as strings de query e mutation (`GET_BIKES_QUERY`, `SEARCH_ACCOUNTS_QUERY`, `GET_ORDERS_QUERY`, mutations via `Bike_Order__cCreate`).
- **`src/services/bikeService.ts`** — expõe o hook `useBikeCatalog`, mapeando edges/nodes brutos da UI API para um tipo de domínio `Bike` limpo e retornando `{ bikes, loading, error }`.

### 🛡️ Validação Server-Side — Record-Triggered Flow

Um **Flow Acionado por Registro** (`Bike_Order_Validate_Submitted`) funciona como barreira de validação server-side para submissão de pedidos:

| Condição                                                     | Resultado                                             |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| `Status__c = "Submitted"` E `Account__c` está **vazio**      | ❌ Save bloqueado com mensagem de erro para o usuário |
| `Status__c = "Submitted"` E `Account__c` está **preenchido** | ✅ Save prossegue normalmente                         |

Validação 100% declarativa — sem Apex, sem registros extras, sem efeitos colaterais.

---

## ✨ Funcionalidades

### 🚴 Catálogo de Bikes

- **Busca e filtro em tempo real** — filtro por texto de nome/modelo e dropdown de marca simultaneamente
- **Tabela de produtos** — imagem da bike, nome, modelo, marca e preço formatado por linha
- **Adicionar ao pedido** — adição com um clique ao painel de Pedido Rascunho com controles de quantidade

### 🛒 Criação de Pedido

- **Painel de Pedido Rascunho** — sidebar flutuante no desktop mostrando itens em andamento, controles de quantidade, lookup de conta e total em tempo real
- **Lookup de Conta** — busca ao vivo em registros de `Account` do Salesforce; a seleção é armazenada no pedido
- **GraphQL Mutations** — a submissão do rascunho cria um registro `Bike_Order__c` via GraphQL UI API
- **Validação por Flow** — submissão sem Conta é bloqueada pelo Record-Triggered Flow, com o erro exibido de volta na UI

### 📊 Dashboard de Pedidos

- **Cards de KPI** — totais de pedidos por status (Rascunho, Submetido, etc.) à primeira vista
- **Lista de pedidos** — registros `Bike_Order__c` com número do pedido, badge de status, nome da conta, valor total e data de criação
- **Badges de status** — indicadores visuais estilizados por estado do pedido
- **Suporte a light e dark mode** — tema completo em todos os componentes do dashboard

### 🎨 Design System

- **Tema claro e escuro completo** com persistência via `localStorage` e fallback para preferência do sistema
- **Layouts responsivos** — switch de tabela para card no breakpoint `md` para compatibilidade mobile-first
- **Design tokens Tailwind CSS** — paleta de cores semântica, escala de espaçamento em 4 pontos, elevação e tipografia consistentes

---

## 🖼️ Screenshots

### 🗂️ Catálogo — Light Mode

![Catalog Light Mode](./docs/screenshots/Catalog%20%E2%80%93%20Light%20Mode.png)

### 🌙 Catálogo — Dark Mode

![Catalog Dark Mode](./docs/screenshots/Catalog%20%E2%80%93%20Dark%20Mode.png)

### 📋 Pedidos — Light Mode

![Orders Light Mode](./docs/screenshots/Orders%20%E2%80%93%20Light%20Mode.png)

### 🌙 Pedidos — Dark Mode

![Orders Dark Mode](./docs/screenshots/Orders%20%E2%80%93%20Dark%20Mode.png)

### 📊 Dashboard — Light Mode

![Dashboard Light Mode](./docs/screenshots/Dashboard%20-%20Light%20Mode.png)

### 🌙 Dashboard — Dark Mode

![Dashboard Dark Mode](./docs/screenshots/Dashboard%20-%20Dark%20Mode.png)

---

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** v18+ e **npm** v9+
- Uma **org Salesforce** com:
  - Suporte a Multi-Framework uiBundle habilitado (Agentforce 360 / SF Multi-Framework runtime)
  - GraphQL API habilitada (feature flag / versão de API adequada)
  - Objetos customizados `Bike__c`, `Bike_Order__c` criados e populados com dados de exemplo
  - Flow `Bike_Order_Validate_Submitted` implantado e ativado
- **Salesforce CLI** (`sf`) instalado e autenticado

### Instalação

```bash
# 1. Clone o repositório
git clone <repo-url>
cd <repo-directory>

# 2. Instale as dependências
npm install

# 3. Autentique-se na org
sf org login web --alias minha-org
sf config set target-org minha-org

# 4. Faça o build do uiBundle
npm run build

# 5. Faça o deploy para o Salesforce
sf project deploy start
```

Acesse o app pelo **App Launcher** na sua org ou navegue até o **site Experience Cloud** configurado.

### Desenvolvimento Iterativo

```bash
npm run build -- --watch
```

Erros de TypeScript aparecem em tempo de build. Faça o redeploy com `sf project deploy start` após cada build.

---

## 🔭 Próximos Passos

- [ ] **Integração com Agentforce** — assistente com IA para insights e recomendações de pedidos
- [ ] **Analytics Avançado** — gráficos e visualizações de tendência no Dashboard de Pedidos
- [ ] **Itens de Pedido** — expandir suporte a `Bike_Order_Item__c` com breakdown por produto na UI
- [ ] **Experience Cloud** — publicar como site Experience Cloud completo para compradores B2B externos

---

## 👨‍💻 Autor

**Felipe Eugênio** — Salesforce Developer Jr  
🇧🇷 São Paulo, Brasil | [LinkedIn](https://www.linkedin.com/in/felipe-de-siqueira-eugenio/) | [Trailhead](https://www.salesforce.com/trailblazer/felipeseugenio)

---

_Desenvolvido com React · Salesforce Multi-Framework uiBundle · GraphQL UI API · Tailwind CSS_
