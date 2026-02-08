# Documentação do Frontend PDV LaChapa

## Visão Geral

O PDV LaChapa é um sistema completo de Ponto de Venda (PDV) desenvolvido para lanchonetes, com integração a impressoras térmicas ESC/POS e fluxo de pedidos via WhatsApp. O frontend foi desenvolvido com React e TypeScript, oferecendo uma interface moderna, responsiva e intuitiva para os usuários.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
pdv-lachapa-frontend/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   └── common/        # Componentes comuns (Header, Sidebar, etc.)
│   ├── pages/             # Páginas principais do sistema
│   │   ├── login/         # Tela de login
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── pdv/           # Interface de PDV para registro de pedidos
│   │   ├── kanban/        # Interface kanban para gestão de pedidos
│   │   ├── reports/       # Relatórios e estatísticas
│   │   └── settings/      # Configurações do sistema
│   ├── styles/            # Estilos globais
│   ├── App.tsx            # Componente principal com rotas
│   └── main.tsx           # Ponto de entrada da aplicação
```

## Telas Principais

### 1. Login

Tela de autenticação para acesso ao sistema.

**Funcionalidades:**
- Autenticação de usuários
- Recuperação de senha
- Validação de campos

### 2. Dashboard Principal

Visão geral do negócio com métricas e informações importantes.

**Funcionalidades:**
- Resumo de vendas do dia
- Pedidos recentes
- Gráficos de desempenho
- Acesso rápido às principais funções

### 3. PDV (Registro de Pedidos)

Interface para registro de pedidos presenciais.

**Funcionalidades:**
- Catálogo de produtos com categorias
- Carrinho de compras
- Adição de observações aos itens
- Seleção de cliente
- Múltiplas formas de pagamento
- Impressão de comanda

### 4. Kanban (Gestão de Pedidos)

Interface visual para gerenciamento de pedidos em andamento.

**Funcionalidades:**
- Visualização em três colunas: "Em análise", "Em produção" e "Foi pra entrega"
- Movimentação de pedidos entre colunas
- Detalhes do pedido
- Impressão de comanda
- Filtros e busca de pedidos

### 5. Relatórios

Página de relatórios e estatísticas de vendas.

**Funcionalidades:**
- Filtros por período (dia, semana, quinzena, mês)
- Gráficos de vendas
- Produtos mais vendidos
- Métodos de pagamento
- Exportação de relatórios (PDF, Excel)

### 6. Configurações

Tela para configuração do sistema.

**Funcionalidades:**
- Gerenciamento de usuários
- Configuração de impressoras
- Integrações (WhatsApp, cardápio digital)
- Personalização de aparência
- Backup e sincronização

## Esquema de Cores

O frontend utiliza o seguinte esquema de cores conforme solicitado:

- **Verde** (#4CAF50): Utilizado para pedidos impressos/finalizados
- **Laranja** (#FF9800): Utilizado para pedidos aguardando confirmação
- **Vermelho** (#E53935): Cor primária do sistema
- **Tons de amarelo**: Utilizados como complemento visual

## Integração com Backend

O frontend está preparado para integração com o backend através de APIs REST. As principais integrações são:

1. **Autenticação**: Login e gerenciamento de sessão
2. **Pedidos**: Criação, atualização e consulta de pedidos
3. **Produtos**: Catálogo de produtos e categorias
4. **Clientes**: Cadastro e consulta de clientes
5. **Relatórios**: Geração de relatórios e estatísticas
6. **Impressão**: Comunicação com impressoras térmicas

## Impressão Térmica

O sistema suporta impressão em impressoras térmicas ESC/POS através do backend. As principais funcionalidades são:

- Impressão de comandas ao aprovar pedidos
- Suporte a impressoras USB, Bluetooth e de rede
- Templates personalizáveis para comandas e recibos

## Responsividade

O frontend foi desenvolvido com design responsivo, adaptando-se a diferentes tamanhos de tela:

- **Desktop**: Layout completo com sidebar visível
- **Tablet**: Layout adaptado com sidebar recolhível
- **Mobile**: Layout otimizado para telas pequenas, com menus simplificados

## Próximos Passos

Para implementação em produção:

1. Configurar o ambiente de produção (servidor web)
2. Integrar com o backend existente
3. Configurar impressoras térmicas
4. Treinar os usuários no novo sistema
5. Realizar testes de carga e performance

## Requisitos Técnicos

- Node.js 14+
- React 18+
- TypeScript 4+
- Navegadores modernos (Chrome, Firefox, Safari, Edge)

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em ambiente de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Executar testes
npm test
```
