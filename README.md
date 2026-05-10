# SCEA

Sistema para Controle de Experimentação Animal (monorepo com workspaces ).

## Estrutura do repositório

- `apps/api`: API Java Spring.
- `apps/notification-worker`: worker de processamento da outbox de notificações.
- `packages/shared-contracts`: contratos Java 25 compartilhados.
- `db/`: migrations, seeds e validações SQL.

## Pré-requisitos

- Java 25
- PostgreSQL disponível (para API e worker)

## Instalação

## Comandos por workspace

### Shared contracts (`packages/shared-contracts`)

Use quando quiser validar/gerar só os contratos compartilhados.

### API (`apps/api`)

> Swagger disponível em `http://localhost:3000/api/docs` (ou na porta configurada em `PORT`).

### Notification worker (`apps/notification-worker`)


## Banco de dados

Para ordem de execução de migrations/seeds/assertions, veja `db/README.md`.

## Dicas rápidas

- Se a porta `3000` estiver ocupada, defina `PORT` antes de subir a API.
