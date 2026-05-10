Frontend (SCEA) - execução em modo offline

Resumo

Este diretório contém o frontend em React + Vite do sistema SCEA. O frontend foi projetado para funcionar localmente sem precisar conectar aos microserviços Java (backend). Muitos fluxos usam dados em memória e usuários simulados para demonstração.

Como rodar (Windows PowerShell)

1. Instale dependências (npm):

   npm install

2. Inicie o servidor de desenvolvimento (Vite):

   npm run dev

   O Vite normalmente abre em http://localhost:5173 ou em outra porta disponível (o terminal mostra a URL real, por exemplo http://localhost:5174).

Observações para PowerShell (variáveis de ambiente)

- Se você quiser definir a variável VITE_OFFLINE para sinalizar modo offline (não necessário hoje porque a app já usa mocks), em PowerShell faça:

  $env:VITE_OFFLINE = "true"; npm run dev

- Em bash / macOS / Linux:

  VITE_OFFLINE=true npm run dev

Por que a app já roda sem backend

- O componente de login (`src/app/components/LoginScreen.tsx`) contém uma lista de usuários simulados e valida a "senha" localmente. O `App.tsx` mantém o estado dos protocolos (criação, pareceres, deliberação) na memória — portanto não há chamadas HTTP por padrão.

- Procure por chamadas de rede: não foram encontradas chamadas `fetch`/`axios` no código do frontend atual. Isso significa que a aplicação é auto-contida e pode ser usada para demonstrações sem serviços Java rodando.

Como conectar ao backend no futuro

- Quando quiser ligar os microserviços Java, use uma variável de ambiente como `VITE_API_BASE_URL`. Exemplos:

  PowerShell:
  $env:VITE_API_BASE_URL = "http://localhost:8080"; npm run dev

  bash:
  VITE_API_BASE_URL=http://localhost:8080 npm run dev

- Insira as chamadas HTTP em um módulo `src/app/utils/api.ts` e leia `import.meta.env.VITE_API_BASE_URL` para construir URLs. Durante o desenvolvimento pode-se condicionar o uso do backend verificando `import.meta.env.VITE_OFFLINE === 'true'`.

Próximos passos sugeridos

- Se desejar que eu "isole" de forma explícita as chamadas ao backend, posso criar um wrapper de API (por exemplo `src/app/utils/api.ts`) que bloqueie ou retorne mocks quando `VITE_OFFLINE` estiver ativo, e então trocar/alterar os lugares que chamam o backend.

- Também posso adicionar um script `start:offline` que defina a variável automaticamente (posix vs PowerShell tem diferenças), e adicionar testes rápidos de integração UI.

Se quiser, prossigo e implemento o wrapper de API e configuro o app para usar mocks de forma explícita — diga qual abordagem prefere.