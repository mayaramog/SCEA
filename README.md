# SCEA - Sistema de Controle de Experimentação Animal

O **SCEA** é uma plataforma moderna para gestão e controle de protocolos de experimentação animal, desenvolvida com uma arquitetura de microsserviços robusta, seguindo os princípios de **Clean Architecture (Hexagonal)** e **Domain-Driven Design (DDD)**.

---

## 🚀 Tecnologias Utilizadas

- **Linguagem:** Java 25 (OpenJDK)
- **Framework:** Spring Boot 4.0.6 & Spring Cloud 2025.1.1
- **Arquitetura:** Microservices + Hexagonal Architecture
- **Banco de Dados:** PostgreSQL 17 (Schema em Português)
- **Mensageria:** RabbitMQ 4 (Comunicação Assíncrona e Event-Driven)
- **Segurança:** Spring Security + JWT (Stateless RBAC)
- **Frontend:** React + TypeScript + Tailwind CSS + Lucide Icons
- **Orquestração:** Docker & Docker Compose

---

## 📁 Estrutura de Pastas

```text
SCEA/
├── apps/                       # Microsserviços (Spring Boot)
│   ├── api-gateway/            # Porta de entrada (Porta 8080)
│   ├── auth-api/               # Segurança e Usuários (Porta 8081)
│   ├── protocolos-api/         # Core de Protocolos (Porta 8082)
│   ├── recursos-api/           # Espécies e Biotérios (Porta 8083)
│   ├── comite-api/             # Reuniões e Pautas (Porta 8084)
│   ├── relatorios-api/         # Geração de Certificados PDF (Porta 8085)
│   ├── notification-worker/    # Processamento de E-mails (Porta 8086)
│   └── eureka-server/          # Service Discovery (Porta 8761)
├── packages/
│   └── shared-contracts/       # DTOs e Eventos compartilhados entre serviços
├── frontend/                   # Interface WEB (React)
├── db/                         # Scripts de inicialização SQL
└── storage/                    # Armazenamento de certificados gerados
```

---

## 🗄️ Relacionamento do Banco de Dados

O sistema utiliza um banco de dados unificado (PostgreSQL) com o schema `scea`. Todas as tabelas e colunas seguem a nomenclatura em **Português (pt-BR)**.

### Principais Entidades:
1.  **Usuário (`usuario`)**: Gere matriculas, emails e senhas. Possui relacionamento N:N com `papel`.
2.  **Protocolo (`protocolo`)**: Entidade central. Vincula o `usuario` (pesquisador) às alocações.
3.  **Alocação Biológica (`protocolo_estoque_biologico`)**: Vincula o protocolo às `especie` e `bioterio` especificando quantidades.
4.  **Parecer (`protocolo_parecer`)**: Registro técnico do parecerista vinculado a uma designação.
5.  **Reunião do Comitê (`reuniao_comite`)**: Gerencia o cronograma e os protocolos pautados para decisão final.

---

## 🛠️ Como Executar (Docker - Recomendado)

Este é o caminho mais rápido para subir todo o ecossistema (8 serviços + Banco + RabbitMQ).

1.  Certifique-se de ter o **Docker** e **Docker Compose** instalados.
2.  Na raiz do projeto, execute:
    ```bash
    # Limpa estados anteriores e sobe tudo do zero
    docker-compose down -v; docker-compose up --build
    ```
3.  Aguarde até que o `eureka-server` e o `api-gateway` estejam prontos.
4.  Acesse o frontend em: `http://localhost:5173` (ou a porta indicada no terminal do frontend).

---

## 💻 Desenvolvimento Local (Sem Docker)

Se desejar rodar os serviços individualmente (ex: via IntelliJ/Eclipse), siga estes passos:

### Passo 1: Pré-requisitos
- Instalar **PostgreSQL 17** (Criar banco `scea`, usuário `postgres`, senha `1234`).
- Instalar **RabbitMQ**.
- Configurar o schema inicial rodando o script `./db/init.sql`.

### Passo 2: Compilação (Clean Install)
Antes de rodar qualquer serviço, é **obrigatório** instalar o pacote de contratos compartilhados no seu repositório local do Maven:
```bash
# Seta o JAVA_HOME para o JDK 25 e compila tudo
mvn clean install -DskipTests
```
*Por que? Os microsserviços dependem do JAR `shared-contracts` para conhecer os DTOs de comunicação.*

### Passo 3: Ordem de Execução
Inicie os serviços na seguinte ordem para garantir que o registro no Eureka funcione:
1.  **Eureka Server** (`apps/eureka-server`)
2.  **Auth API** (`apps/auth-api`)
3.  **Recursos API** (`apps/recursos-api`)
4.  **Protocolos API** (`apps/protocolos-api`)
5.  **API Gateway** (`apps/api-gateway`)
6.  **Outros...**

---

## 🔐 Usuários de Teste (Padrão)

| E-mail | Senha | Papel (Role) |
| :--- | :--- | :--- |
| `admin@scea.local` | `123` | ADMINISTRADOR |
| `test@scea.local` | `123` | TODOS OS PAPÉIS |
| `docente@scea.local` | `123` | DOCENTE |
| `secretaria@scea.local` | `123` | SECRETARIA |

---

## 🧪 Testes E2E (Playwright)

O projeto conta com uma suíte de testes end-to-end automatizada para garantir que os requisitos de negócio e fluxos críticos estejam funcionando corretamente.

### Pré-requisitos
- O ambiente Docker deve estar rodando (`docker-compose up`).
- Node.js instalado (versão 18 ou superior).

### Como Executar os Testes
Navegue até a pasta do frontend e instale as dependências:
```bash
cd frontend
npm install
npx playwright install chromium
```

Para rodar todos os testes com geração de evidências (fotos e vídeos):
```bash
npx playwright test
```

### Visualizando Resultados e Evidências
- **Relatório Interativo:** Para abrir o relatório detalhado no navegador:
  ```bash
  npx playwright show-report
  ```
- **Vídeos e Fotos:** As evidências ficam salvas em `frontend/test-results/`.
- **Traces:** Para debugar um passo a passo técnico:
  ```bash
  npx playwright show-trace path/to/trace.zip
  ```

### Casos de Teste Cobertos
- **Ciclo de Vida do Protocolo:** Submissão (Docente) -> Designação (Secretaria) -> Parecer Técnico (Parecerista) -> Deliberação (Presidente).
- **Regras de Negócio:** Bloqueio de datas em finais de semana/feriados e obrigatoriedade de alocação de animais.
- **Segurança:** Validação de login e controle de acesso baseado em papéis (RBAC).

---
*Desenvolvido para a disciplina de Qualidade de Software.*
