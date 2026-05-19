# Catálogo de Bikes B2B (React + Salesforce Multi-Framework)

## Visão Geral

Este projeto é um catálogo de bikes construído em React e rodando nativamente na plataforma Salesforce utilizando a arquitetura Multi-Framework (uiBundle / Agentforce 360). Ele demonstra como integrar uma interface de usuário moderna diretamente na org.

A aplicação utiliza a GraphQL UI API em conjunto com o `@salesforce/sdk-data` para realizar a leitura e escrita de dados de forma direta, dispensando totalmente a necessidade de uso de código Apex no backend.

A interface permite aos usuários listar os modelos de bikes disponíveis, realizar pesquisas e filtragens detalhadas, e criar novos pedidos de compra (`Bike_Order__c`) a partir do próprio catálogo, oferecendo uma experiência fluida de comércio B2B.

## Arquitetura / Stack

- **Frontend:** React estruturado sobre a arquitetura Salesforce Multi-Framework / uiBundle.
- **Camada de Dados:** GraphQL UI API (utilizada tanto para consultas quanto para mutações).
- **GraphQL Client:** `@salesforce/sdk-data` e `createDataSDK` gerenciam as chamadas, simplificando as operações GraphQL de forma nativa.
- **Objetos Salesforce (Custom Objects):**
  - `Bike__c` (Catálogo de bicicletas)
  - `Bike_Order__c` (Cabeçalho do pedido)
  - `Bike_Order_Item__c` (Itens do pedido)
- **Validação de Negócio:** Um Flow nativo (`Bike_Order_Validate_Submitted`) garante regras de negócio críticas, como a obrigatoriedade do preenchimento da conta (`Account__c`) caso o pedido seja submetido com `Status__c = "Submitted"`.

## Fluxos Principais

### Catálogo de Bikes

A aplicação realiza a leitura do inventário a partir do objeto `Bike__c`.
A constante `GET_BIKES_QUERY` obtém os campos fundamentais (como `Id`, `Name`, `Model__c`, `Brand__c`, `Price__c`, `Image_URL__c`) utilizando a infraestrutura da `uiapi.query`.
O hook de customização `useBikeCatalog` encapsula esta chamada e processa os nós recebidos para gerar um array tipado `Bike`, que é consumido diretamente pelos componentes da UI para a listagem na tabela, busca e filtro por marca.

### Criação de Pedidos (Bike_Order\_\_c)

Ações de conversão (como clicar no botão "Add to order") instanciam criações de pedido utilizando mutações específicas da GraphQL UI API.
Estas mutações aderem rigorosamente ao padrão do schema definido no `UIAPIMutations`, formatadas no modelo `<ObjectApiName>Create` para a função e `<ObjectApiName>CreateInput` para a tipagem dos dados (e não usando generic `RecordCreateInput` / `recordCreate`).
A consistência dos dados inseridos é garantida pelo Flow Salesforce `Bike_Order_Validate_Submitted`, que não permite o salvamento e avanço de pedidos `Submitted` sem que a conta esteja devidamente informada.

## Como rodar o projeto

### Pré-requisitos

- Node.js e npm (ou yarn) instalados.
- Salesforce CLI (`sf` / `sfdx`) configurado e autenticado em um ambiente alvo (org) que suporte Multi-Framework/uiBundle.

### Instalação de dependências e Execução (Desenvolvimento)

Dentro da raiz do projeto do uiBundle (ex: `force-app/main/default/uiBundles/bikeB2BReactApp`):

```bash
npm install
npm run dev
```

### Build e Deploy

A partir do **diretório raiz do projeto SFDX**:

1. Faça o build do UI Bundle:

   ```bash
   cd force-app/main/default/uiBundles/bikeB2BReactApp && npm install && npm run build && cd -
   ```

2. Execute o deploy do Bundle para a org alvo:
   ```bash
   sf project deploy start --source-dir force-app/main/default/ui-bundles --target-org <alias_da_sua_org>
   ```
   _Ou para implantar todo o metadata da org:_
   ```bash
   sf project deploy start --source-dir force-app --target-org <alias_da_sua_org>
   ```

Uma vez realizado o deploy, a aplicação pode ser acessada de forma integrada através do App Launcher ou instanciada através de um site Experience Cloud / Lightning App Builder preparado.

## Estado atual e próximos passos

Nesta branch, **o foco exclusivo do desenvolvimento foi a estabilização do fluxo de dados**. Foram corrigidas as definições das mutações de criação de `order` e `order item` via GraphQL UI API para consumirem os tipos concretos gerados no backend, eliminando erros estruturais durante o `submit`.

**Próximos passos:**
Uma branch futura e apartada deste foco de infraestrutura trará os refinamentos visuais necessários e melhorias em design (responsividade, UX dos estados de loading e tabelas limpas, formatação da cartilha de componentes), as quais possivelmente ganharão destaque em uma nova seção de Interface/UI neste documento.
