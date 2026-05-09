# Contexto do Projeto: SCEA / SisCAUAE

O **SCEA** (Sistema para Controle de Experimentação Animal), também referido como
**SisCAUAE**, é uma aplicação web para controlar o ciclo de vida de protocolos de
uso de animais em pesquisa. O sistema deve respeitar regras éticas, legais e
operacionais da CAUAE/CEUA, incluindo rastreabilidade, papéis institucionais,
validação de datas, workflow estrito de aprovação e geração de certificados.

Use o PDF do projeto como fonte de domínio:
`Sistema Controle Experimentação Animal (1).pdf`.

Este repositório deve ser conduzido como uma base **Java 25**, com serviços
Spring, PostgreSQL, mensageria, contratos compartilhados e automações
assíncronas.

## 1. Stack Tecnológica

- **Linguagem:** Java 25 como baseline de compilação e execução.
- **Backend:** Spring Boot 4.x, Spring Framework 7.x e Jakarta EE atual.
- **Build:** preferir Gradle multi-project ou Maven multi-module. Use toolchain
  explícita para Java 25.
- **Banco:** PostgreSQL.
- **Mensageria:** Apache Kafka via Spring Cloud Stream por padrão. RabbitMQ é
  aceitável apenas se o ambiente de implantação não suportar Kafka.
- **Contratos:** `packages/shared-contracts` com records, enums, schemas,
  OpenAPI/AsyncAPI e artefatos versionados.
- **Worker/agents:** aplicações Spring Boot sem camada web para consumidores,
  outbox, notificações, certificados, verificações de prazos e automações.
- **Observabilidade:** Micrometer, OpenTelemetry, logs estruturados e health
  checks do Spring Actuator.
- **Frontend:** fora do escopo deste arquivo. O backend deve expor contratos
  HTTP/eventos estáveis, documentados e testáveis.

Não introduza TypeScript, Node.js, NestJS, Prisma, dotenv, Jest ou bibliotecas
equivalentes no backend Java.

## 2. Organização do Repositório

Estrutura alvo:

- `apps/api`: API HTTP principal em Spring Boot.
- `apps/notification-worker`: worker Spring Boot para processar outbox e
  notificações.
- `packages/shared-contracts`: contratos Java 25 compartilhados entre serviços.
- `db`: migrations, seeds, constraints e validações SQL.

Se novos serviços forem criados, use `apps/<nome-do-servico>` e mantenha cada
serviço dono do seu schema/tabelas. Não crie microsserviço por entidade. Crie
serviços apenas por subdomínio com motivo claro de autonomia, escala ou ciclo de
deploy.

## 3. Arquitetura de Microsserviços

Use decomposição por subdomínio e mantenha baixo acoplamento:

- **Identity/Auth:** integração com Active Directory por LDAP/Kerberos, emissão
  de JWT e RBAC.
- **Atores/RH:** Funcionário, Docente, titulação e papéis institucionais.
- **Protocolos:** submissão, datas, alocação de espécie/biotério e máquina de
  estados.
- **Pareceres/Deliberação:** designação de parecerista, parecer técnico,
  reunião mensal e decisão final.
- **Certificados:** geração de PDFs e registro auditável de emissão.
- **Notificações:** e-mail/eventos internos, lembretes de relatório anual/final
  e avisos de mudança de estado.

Comunicação síncrona deve ser usada somente para consultas necessárias ao fluxo
imediato do usuário. Mudanças de estado, notificações, certificados, auditorias
e integrações laterais devem usar eventos assíncronos.

Cada serviço deve ter:

- API pública documentada.
- Contratos de entrada e saída versionados.
- Banco ou schema próprio.
- Migrations próprias.
- Testes de contrato.
- Health check, métricas e logs com `correlationId`.

Não acesse tabelas de outro serviço diretamente. Integre por API ou evento.

## 4. Camadas e DDD

Use arquitetura hexagonal/clean architecture:

- `domain`: entidades, value objects, regras, eventos de domínio e interfaces de
  portas. Não depende de Spring, JPA, Jackson ou banco.
- `application`: casos de uso, transações, orquestração e autorização de
  aplicação.
- `infrastructure`: controllers, consumers, repositories, JPA/jOOQ, LDAP,
  mensageria, PDF, cache e adapters externos.
- `contracts`: DTOs públicos e mensagens versionadas.

O domínio deve ser rico. Não coloque regra de negócio em controller, mapper,
entity JPA ou migration. Controllers apenas validam borda, chamam casos de uso e
mapeiam resposta.

## 5. Java 25 e Estilo de Código

- Use `record` para DTOs imutáveis, comandos, queries e value objects simples.
- Use `enum` para estados e decisões fechadas.
- Use `sealed interface` / `sealed class` quando o conjunto de variantes do
  domínio for fechado.
- Use `Optional` apenas em retornos. Não use `Optional` como atributo, parâmetro
  ou campo JPA.
- Não retorne `null`. Modele ausência, erro esperado ou coleção vazia.
- Prefira composição a herança. Use herança apenas quando o domínio realmente
  exige subtipos.
- Evite Lombok no domínio. Se usado em infraestrutura, limite a getters
  mecânicos e builders simples.
- Evite reflection, campos públicos mutáveis e singletons com estado.
- Use `UUID` para identificadores públicos. Encapsule IDs críticos em value
  objects quando isso melhorar a segurança do domínio.
- Não use recursos preview do Java em produção sem decisão explícita registrada.
- Use virtual threads para I/O bloqueante quando a configuração do Spring Boot
  permitir e os drivers usados forem compatíveis.

## 6. Object Calisthenics Aplicado

Siga object calisthenics de forma pragmática no domínio:

- Métodos pequenos, com uma intenção clara.
- Uma regra de negócio por método.
- Evite `else`; prefira guard clauses.
- Evite primitive obsession: use value objects como `Matricula`, `Periodo`,
  `QuantidadeAnimais`, `Titulacao`, `ProtocoloId`.
- Encapsule coleções em first-class collections, por exemplo
  `AlocacoesBiologicas`.
- Não exponha setters públicos em entidades de domínio.
- Diga ao objeto para executar comportamento; evite perguntar dados para decidir
  fora dele.
- Limite cadeias longas de chamadas. Se aparece `a.getB().getC().x()`, há
  provável vazamento de modelo.
- Classes devem ser pequenas e coesas. Se o nome precisa de "Manager", "Helper"
  ou "Util", reavalie.
- Regras invariantes devem nascer no construtor/factory do domínio e permanecer
  verdadeiras durante todo o ciclo de vida do objeto.

## 7. Padrões de Projeto Recomendados

Use padrões quando reduzirem acoplamento real:

- **State:** máquina de estados do protocolo.
- **Strategy:** validação de feriados/calendários e políticas de elegibilidade.
- **Specification:** regras combináveis de submissão e listagem.
- **Factory Method / Static Factory:** criação de agregados válidos.
- **Repository:** persistência orientada a agregados.
- **Domain Events:** propagação de mudanças relevantes.
- **Outbox:** publicação confiável de eventos após commit no banco.
- **Saga / Process Manager:** processos longos, como emenda, relatório pendente
  e emissão de certificados.
- **Adapter:** LDAP/AD, geração de PDF, broker e serviços externos.

Não aplique padrão por estética. Primeiro preserve clareza, teste e isolamento
de regra.

## 8. Contratos Compartilhados

`packages/shared-contracts` deve conter somente o que for contrato público:

- DTOs de request/response como `record`.
- Enums públicos de estado, decisão e papéis.
- Eventos versionados, por exemplo `ProtocolSubmittedV1`.
- Schemas OpenAPI para HTTP.
- Schemas AsyncAPI/JSON Schema/Avro para eventos.
- Modelo padronizado de erro.

Não compartilhe entidades de domínio, repositories, services, migrations ou
classes internas. Contrato compartilhado não pode virar dependência circular
entre serviços.

Regras:

- Versione pacotes e eventos: `br.edu.scea.contracts.v1`.
- Nunca quebre contrato publicado sem criar nova versão.
- Eventos devem conter `eventId`, `occurredAt`, `schemaVersion`,
  `correlationId`, `producer` e payload mínimo.
- Consumers devem ser tolerantes a campos extras.
- Producers não devem remover campos obrigatórios de uma versão existente.

## 9. Mensageria e Consistência

Use eventos para propagar fatos de domínio, não comandos disfarçados.

Eventos esperados:

- `ProtocolSubmitted`
- `ReviewerAssigned`
- `ReviewIssued`
- `ProtocolAwaitingDeliberation`
- `ProtocolApproved`
- `ProtocolRejected`
- `CertificateRequested`
- `CertificateGenerated`
- `AnnualReportOverdue`

Boas práticas obrigatórias:

- Use transactional outbox para eventos originados de alteração em banco.
- Consumers devem ser idempotentes.
- Grave `processed_message` ou mecanismo equivalente para deduplicação.
- Configure retry com backoff e dead-letter topic/queue.
- Mensagens devem ter chave estável, preferencialmente `protocoloId`.
- Não use mensageria para responder tela que precisa de confirmação imediata.
- Não use transação distribuída 2PC.
- Não publique evento antes do commit da mudança de estado.
- Não coloque payload gigante no broker. Use IDs e recupere detalhes por API
  quando necessário.

## 10. Agents e Workers

Agents são processos autônomos de backend, não autoridades de negócio. Eles
executam trabalho assíncrono, observável e repetível.

Exemplos:

- `notification-worker`: consome outbox e envia notificações.
- `certificate-agent`: gera PDFs de certificados em lote.
- `deadline-agent`: verifica relatórios anuais/finais pendentes.
- `calendar-agent`: atualiza base local de feriados e dias não úteis.
- `audit-agent`: consolida trilhas de auditoria para compliance.

Regras para agents:

- Toda execução deve ser idempotente.
- Use lock/lease quando houver agendamento concorrente.
- Persistir estado de processamento, tentativas e erro.
- Expor métricas de fila, sucesso, falha e latência.
- Nunca aprovar, reprovar ou alterar decisão ética sem ação explícita de ator
  autorizado.
- Se algum agent usar IA no futuro, ele só pode sugerir, sumarizar ou classificar
  pendências. Decisão final continua humana e auditável.

## 11. Banco de Dados

Use PostgreSQL com migrations versionadas por serviço.

Padrões:

- Flyway ou Liquibase para migrations.
- Constraints no banco para invariantes críticas.
- `uuid` para chaves públicas.
- `created_at`, `updated_at`, `version` e campos de auditoria quando aplicável.
- Optimistic locking em agregados editáveis.
- Índices para filtros de dashboard: estado, parecerista, pesquisador,
  reunião/data, pendências.
- Paginação obrigatória em listagens.
- Transações curtas e explícitas nos casos de uso.
- Soft delete apenas quando houver requisito auditável. Caso contrário, prefira
  estado de negócio.

Não use banco compartilhado entre serviços. Não use migration de um serviço para
alterar schema de outro.

Para queries complexas de leitura, jOOQ ou projeções SQL são aceitáveis. Para
persistência de agregados simples, Spring Data JPA/JDBC é aceitável, desde que o
domínio não fique dependente de anotações de infraestrutura.

## 12. Regras de Domínio Obrigatórias

- Apenas Docente pode submeter protocolo.
- Titulação de docente deve ser limitada a: `DOUTOR`, `ASSISTENTE`,
  `LIVRE_DOCENTE`, `TITULAR`.
- Protocolo contém justificativa, resumo em português, resumo em inglês, data de
  início e data de término.
- Data de início deve ser estritamente anterior à data de término.
- Início e término não podem cair em sábado, domingo ou feriado.
- Feriados devem considerar regras brasileiras fixas e móveis, com base local
  auditável e atualizável.
- O protocolo deve suportar múltiplas alocações de espécie, quantidade e
  biotério no mesmo protocolo.
- Biotérios iniciais: Medicina, Farmácia e Química.
- Estados do protocolo devem ser controlados por máquina de estados:
  `AGUARDANDO_ENVIO_PARA_PARECER`, `AGUARDANDO_PARECER`,
  `AGUARDANDO_DELIBERACAO`, `USO_APROVADO`, `USO_REPROVADO`.
- Somente Secretária pode designar parecerista.
- Parecerista deve ser Docente.
- Parecer técnico deve escolher exatamente uma decisão:
  `USO_RECOMENDADO` ou `USO_NAO_RECOMENDADO`.
- Somente Presidente/Vice autorizado pode deliberar.
- Deliberação final deve escolher exatamente:
  `USO_APROVADO` ou `USO_REPROVADO`.
- Estado final não pode ser alterado sem fluxo formal de emenda/aditivo.
- Pesquisador com relatório anual/final pendente não pode submeter novo
  protocolo.

## 13. API HTTP

- Use REST com JSON e OpenAPI.
- Use DTOs de borda, não entidades de domínio.
- Valide entrada com Jakarta Validation nos DTOs e invariantes no domínio.
- Erros devem seguir `ProblemDetail` com status HTTP adequado.
- Use `422 Unprocessable Entity` para violação de regra de negócio esperada.
- Use `400 Bad Request` para formato inválido.
- Use `401 Unauthorized` para ausência/falha de autenticação.
- Use `403 Forbidden` para papel insuficiente.
- Use `404 Not Found` quando o recurso não existir ou não for visível ao usuário.
- Endpoints devem ser versionados: `/api/v1/...`.
- Não exponha stack trace, SQL, DN LDAP ou detalhes internos.

## 14. Segurança

- Autenticação integrada ao Active Directory por LDAP/Kerberos.
- Sessões stateless com JWT de curta duração.
- RBAC obrigatório nos casos de uso e endpoints.
- Autorização deve ser testada por papel.
- Segredos via variáveis de ambiente, secret manager ou configuração externa
  segura. Nunca commitar senha, token ou certificado.
- Logs não podem conter senha, token JWT completo ou dados sensíveis sem
  mascaramento.
- Use TLS em tráfego externo.
- Proteja endpoints administrativos com escopo específico.
- Auditoria deve registrar quem fez a ação, quando, de onde e sobre qual
  protocolo.

## 15. Tratamento de Erros

- Falhas esperadas de negócio devem ser modeladas como erros de domínio
  explícitos, não como `RuntimeException` genérica.
- Infraestrutura pode lançar exceções próprias, convertidas na borda.
- Controllers não devem conter `try/catch` repetitivo; use `@ControllerAdvice`.
- Mensagens para usuário devem ser claras e sem detalhe técnico.
- Mensagens para log devem conter contexto suficiente, `correlationId` e causa.
- Consumers de eventos devem diferenciar erro transitório de erro permanente.

## 16. Testes

Pirâmide mínima:

- **Unitários:** JUnit 5, AssertJ e Mockito apenas quando necessário.
- **Domínio:** testes puros para value objects, máquina de estados, calendário,
  titulação e alocações biológicas.
- **Integração:** Spring Boot Test, Testcontainers para PostgreSQL e Kafka.
- **Contrato:** Spring Cloud Contract, Pact ou validação OpenAPI/AsyncAPI.
- **API:** RestAssured, WebTestClient ou MockMvc.
- **Arquitetura:** ArchUnit para garantir camadas e dependências.
- **E2E:** Playwright Java ou Selenium se houver frontend.
- **Performance:** k6, Gatling ou JMeter para cenários da última sexta-feira do
  mês e rede limitada.

Regras:

- Cobertura mínima de 85% nas regras centrais.
- Todo bug corrigido deve ganhar teste de regressão.
- Teste deve seguir Arrange, Act, Assert.
- Não aceite flaky tests.
- Testes de integração devem subir dependências reais com Testcontainers.
- Mensageria deve testar retry, idempotência e dead-letter.
- Banco deve testar constraints críticas, não apenas mocks.

## 17. Performance e Rede Limitada

O sistema será usado em infraestrutura com pontas de rede 10/100 Mbps. Portanto:

- Paginação obrigatória em dashboards.
- Compressão HTTP habilitada.
- Evite payloads grandes.
- Use cache controlado para dados estáveis, como espécies, biotérios e feriados.
- Use projeções de leitura para telas de lista.
- Evite chamadas encadeadas entre serviços no caminho crítico.
- Configure timeouts, bulkheads e circuit breakers para integrações externas.
- Use virtual threads para melhorar throughput de I/O quando apropriado.
- Monitore latência p95/p99, tamanho médio de resposta e lag de consumidores.

## 18. Qualidade Estática e Formatação

- Formatação automática com Spotless e google-java-format ou padrão equivalente
  definido no build.
- Checkstyle ou PMD para regras de estilo.
- SpotBugs para defeitos comuns.
- ArchUnit para fronteiras arquiteturais.
- SonarQube/SonarCloud para cobertura, duplicação e hotspots.
- Build deve falhar em erro de formatação, teste, contrato ou arquitetura.

Comentários devem explicar decisão não óbvia. Não comente código trivial.
Javadocs são obrigatórios para APIs públicas, contratos publicados e regras de
domínio sensíveis.

## 19. Workflow do Agente de IA

Ao receber uma tarefa:

1. Leia o contexto existente antes de alterar arquivos.
2. Identifique o subdomínio afetado e a camada correta.
3. Explique brevemente a abordagem quando a mudança for relevante.
4. Implemente regra e teste juntos.
5. Preserve contratos existentes; se quebrar contrato, crie nova versão.
6. Atualize migrations, contratos e documentação quando o comportamento mudar.
7. Rode testes relevantes, formatação e verificações de arquitetura.
8. Informe claramente o que foi alterado e o que foi validado.

Nunca reverta alterações de usuário sem pedido explícito. Nunca substitua regra
de domínio por atalho de controller, migration ou frontend.

## 20. Definition of Done

Uma entrega só está pronta quando:

- Regra de domínio implementada no domínio ou caso de uso correto.
- Entrada validada na borda e invariantes protegidas no domínio/banco.
- Contratos HTTP/eventos atualizados e versionados.
- Migrations aplicadas e reversibilidade considerada.
- Eventos publicados via outbox quando houver mudança relevante.
- Consumers idempotentes.
- Testes unitários, integração e contrato relevantes passando.
- Observabilidade mínima adicionada quando houver fluxo assíncrono.
- Segurança por papel coberta por teste.
- Documentação atualizada quando a decisão arquitetural mudar.
