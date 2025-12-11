# Molar Mind: The Solution Protocol

## Visão Geral
Este é um jogo educacional sobre Soluções Químicas desenvolvido com **Next.js** (Frontend) e **Go/Gin** (Backend).

## Estrutura do Projeto
- **/backend**: API REST em Go que gerencia a lógica do jogo, geração de problemas químicos e persistência de dados.
- **/frontend**: Aplicação Next.js com Tailwind CSS para a interface do usuário.

## Pré-requisitos
- **Go** (Golang) 1.21+
- **Node.js** 18+ e **npm**

## Como Executar

### 1. Iniciar o Backend
O backend rodará na porta `8030`.

```bash
cd backend
# Inicializar dependências (se necessário)
go mod tidy
# Rodar o servidor
go run main.go
```

### 2. Iniciar o Frontend
O frontend rodará na porta `3030`.

```bash
cd frontend
# Instalar dependências
npm install
# Rodar o servidor de desenvolvimento
npm run dev
```

Acesse o jogo em: `http://localhost:3030`

## Mecânicas Químicas Implementadas

### Geração Procedural
O arquivo `backend/game/chemistry.go` contém a lógica principal.
- **Tipos de Problemas**:
  1. **Cálculo de Molaridade**: Usa a fórmula $M = \frac{m}{MM \times V}$. O sistema gera uma massa e volume aleatórios para um composto sorteado e pede a molaridade (ou variações, como pedir a massa dada a molaridade).
  2. **Concentração (g/L)**: Simples relação $C = m/V$.
  3. **Diluição**: Usa a equação $C_1V_1 = C_2V_2$. O sistema gera uma solução estoque e pede o volume necessário para criar uma solução diluída alvo.

- **Compostos Reais**: O sistema utiliza uma lista de compostos com suas Massas Molares reais (ex: NaCl = 58.44 g/mol) para garantir que os cálculos sejam quimicamente precisos.

- **Validação**: As respostas são verificadas com uma margem de tolerância de 5% (`Tolerance: 0.05`) para acomodar pequenos arredondamentos por parte do usuário.

## Persistência
Os dados dos jogadores são salvos em `backend/leaderboard.json`. O acesso a este arquivo é protegido por um `sync.RWMutex` no Go para evitar corrupção de dados durante acessos simultâneos (Leitura/Escrita).

```