--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: scea; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA scea;


-- ALTER SCHEMA scea OWNER TO postgres;

--
-- Name: SCHEMA scea; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA scea IS 'Schema do SCEA';


--
-- Name: atualizar_timestamp_atualizacao(); Type: FUNCTION; Schema: scea; Owner: postgres
--

CREATE FUNCTION scea.atualizar_timestamp_atualizacao() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ 
BEGIN 
    NEW.atualizado_em = NOW(); 
    RETURN NEW; 
END; 
$$;


ALTER FUNCTION scea.atualizar_timestamp_atualizacao() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bioterio; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.bioterio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo text NOT NULL,
    nome text NOT NULL,
    descricao text,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE scea.bioterio OWNER TO postgres;

--
-- Name: especie; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.especie (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    codigo text NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE scea.especie OWNER TO postgres;

--
-- Name: outbox_notificacao; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.outbox_notificacao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    aggregate_type text NOT NULL,
    aggregate_id uuid NOT NULL,
    channel text NOT NULL,
    event_name text NOT NULL,
    payload jsonb NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    processed_at timestamp with time zone,
    CONSTRAINT notification_outbox_channel_check CHECK ((channel = ANY (ARRAY['email'::text, 'in_app'::text, 'webhook'::text]))),
    CONSTRAINT notification_outbox_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'sent'::text, 'failed'::text])))
);


ALTER TABLE scea.outbox_notificacao OWNER TO postgres;

--
-- Name: papel; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.papel (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo text NOT NULL,
    nome text NOT NULL,
    descricao text,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE scea.papel OWNER TO postgres;

--
-- Name: protocolo; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.protocolo (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo_protocolo text NOT NULL,
    titulo text NOT NULL,
    objetivo text NOT NULL,
    resumo text NOT NULL,
    id_usuario_submetedor uuid NOT NULL,
    nome_pesquisador_responsavel text NOT NULL,
    nome_departamento text,
    versao_atual integer DEFAULT 1 NOT NULL,
    estado text NOT NULL,
    data_submissao date,
    data_inicio_planejada date NOT NULL,
    data_termino_planejada date NOT NULL,
    quantidade_animais_aprovada integer DEFAULT 0 NOT NULL,
    observacoes text,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp with time zone DEFAULT now() NOT NULL,
    arquivado_em timestamp with time zone,
    justificativa text NOT NULL,
    CONSTRAINT protocol_approved_animal_count_check CHECK ((quantidade_animais_aprovada >= 0)),
    CONSTRAINT protocol_planned_dates_check CHECK ((data_termino_planejada >= data_inicio_planejada)),
    CONSTRAINT protocol_version_check CHECK ((versao_atual >= 1)),
    CONSTRAINT protocolo_estado_check CHECK ((estado = ANY (ARRAY['rascunho'::text, 'submetido'::text, 'em_analise_secretaria'::text, 'em_analise_ceua'::text, 'pendencia_solicitada'::text, 'aprovado'::text, 'reprovado'::text, 'suspenso'::text, 'arquivado'::text])))
);


ALTER TABLE scea.protocolo OWNER TO postgres;

--
-- Name: protocolo_decisao; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.protocolo_decisao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    reuniao_id uuid NOT NULL,
    tipo_decisao text NOT NULL,
    decidido_por_usuario_id uuid,
    decidido_em timestamp with time zone DEFAULT now() NOT NULL,
    valido_ate timestamp with time zone,
    fundamentacao text,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT protocolo_decisao_tipo_check CHECK ((tipo_decisao = ANY (ARRAY['aprovado'::text, 'reprovado'::text, 'pendencia_solicitada'::text, 'suspenso'::text])))
);


ALTER TABLE scea.protocolo_decisao OWNER TO postgres;

--
-- Name: protocolo_designacao_parecer; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.protocolo_designacao_parecer (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    usuario_parecerista_id uuid NOT NULL,
    atribuido_por_usuario_id uuid,
    estado_designacao text DEFAULT 'pending'::text NOT NULL,
    atribuido_em timestamp with time zone DEFAULT now() NOT NULL,
    prazo_em timestamp with time zone,
    CONSTRAINT protocolo_designacao_parecer_estado_check CHECK ((estado_designacao = ANY (ARRAY['pendente'::text, 'concluido'::text, 'cancelado'::text])))
);


ALTER TABLE scea.protocolo_designacao_parecer OWNER TO postgres;

--
-- Name: protocolo_estoque_biologico; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.protocolo_estoque_biologico (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    especie_id uuid NOT NULL,
    bioterio_id uuid NOT NULL,
    nome_linhagem text,
    sexo text NOT NULL,
    quantidade_planejada integer NOT NULL,
    justificativa text NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT protocol_biological_stock_planned_quantity_check CHECK ((quantidade_planejada > 0)),
    CONSTRAINT protocolo_estoque_biologico_sexo_check CHECK ((sexo = ANY (ARRAY['macho'::text, 'femea'::text, 'misto'::text, 'nao_informado'::text])))
);


ALTER TABLE scea.protocolo_estoque_biologico OWNER TO postgres;

--
-- Name: protocolo_historico_status; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.protocolo_historico_status (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    estado_anterior text,
    novo_estado text NOT NULL,
    motivo_mudanca text,
    alterado_por_usuario_id uuid,
    alterado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT protocol_status_history_new_status_check CHECK ((novo_estado = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_secretariat_review'::text, 'under_ceua_review'::text, 'changes_requested'::text, 'approved'::text, 'rejected'::text, 'suspended'::text, 'archived'::text]))),
    CONSTRAINT protocol_status_history_previous_status_check CHECK (((estado_anterior IS NULL) OR (estado_anterior = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_secretariat_review'::text, 'under_ceua_review'::text, 'changes_requested'::text, 'approved'::text, 'rejected'::text, 'suspended'::text, 'archived'::text]))))
);


ALTER TABLE scea.protocolo_historico_status OWNER TO postgres;

--
-- Name: protocolo_membro_equipe; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.protocolo_membro_equipe (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    nome_completo text NOT NULL,
    email text,
    papel_institucional text NOT NULL,
    e_pesquisador_responsavel boolean DEFAULT false NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE scea.protocolo_membro_equipe OWNER TO postgres;

--
-- Name: protocolo_parecer; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.protocolo_parecer (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    designacao_id uuid NOT NULL,
    recomendacao text NOT NULL,
    resumo_tecnico text NOT NULL,
    consideracoes_eticas text,
    submetido_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT protocolo_parecer_recomendacao_check CHECK ((recomendacao = ANY (ARRAY['uso_recomendado'::text, 'uso_nao_recomendado'::text, 'pendencia_solicitada'::text])))
);


ALTER TABLE scea.protocolo_parecer OWNER TO postgres;

--
-- Name: relatorio; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.relatorio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    tipo_documento text NOT NULL,
    caminho_armazenamento text NOT NULL,
    nome_arquivo_original text NOT NULL,
    mime_type text NOT NULL,
    enviado_por_usuario_id uuid,
    enviado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT relatorio_tipo_documento_check CHECK ((tipo_documento = ANY (ARRAY['formulario_submissao'::text, 'projeto_pesquisa'::text, 'cronograma'::text, 'orcamento'::text, 'anexo_parecer'::text, 'ata_reuniao'::text, 'certificado_aprovacao'::text, 'outro'::text])))
);


ALTER TABLE scea.relatorio OWNER TO postgres;

--
-- Name: reuniao_comite; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.reuniao_comite (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo_reuniao text NOT NULL,
    agendada_para timestamp with time zone NOT NULL,
    descricao_local text,
    estado text DEFAULT 'scheduled'::text NOT NULL,
    observacoes text,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reuniao_comite_estado_check CHECK ((estado = ANY (ARRAY['agendada'::text, 'em_andamento'::text, 'concluida'::text, 'cancelada'::text])))
);


ALTER TABLE scea.reuniao_comite OWNER TO postgres;

--
-- Name: reuniao_comite_protocolo; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.reuniao_comite_protocolo (
    reuniao_id uuid NOT NULL,
    protocolo_id uuid NOT NULL,
    ordem_pauta integer NOT NULL,
    usuario_relator_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    CONSTRAINT committee_meeting_protocol_agenda_order_check CHECK ((ordem_pauta >= 1))
);


ALTER TABLE scea.reuniao_comite_protocolo OWNER TO postgres;

--
-- Name: usuario; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.usuario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    id_autenticacao_externa text,
    nome_completo text NOT NULL,
    email text NOT NULL,
    esta_ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp with time zone DEFAULT now() NOT NULL,
    password_hash text,
    CONSTRAINT app_user_password_hash_not_empty CHECK (((password_hash IS NULL) OR (length(TRIM(BOTH FROM password_hash)) > 0)))
);


ALTER TABLE scea.usuario OWNER TO postgres;

--
-- Name: usuario_papel; Type: TABLE; Schema: scea; Owner: postgres
--

CREATE TABLE scea.usuario_papel (
    usuario_id uuid NOT NULL,
    papel_id uuid NOT NULL,
    atribuido_por_usuario_id uuid,
    atribuido_em timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE scea.usuario_papel OWNER TO postgres;

--
-- Data for Name: bioterio; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.bioterio (id, codigo, nome, descricao, ativo, criado_em) FROM stdin;
00000000-0000-0000-0000-000000000031	BIO-CENTRAL	Biotério Central de Roedores	Unidade principal de criação e manutenção	t	2026-04-25 20:37:08.839486-03
00000000-0000-0000-0000-000000000032	LAB-NEURO	Laboratório de Neurociências	Unidade experimental avançada	t	2026-05-10 10:00:00.000000-03
\.


--
-- Data for Name: especie; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.especie (id, nome, codigo, ativo, criado_em) FROM stdin;
00000000-0000-0000-0000-000000000021	Rato Wistar	Rattus norvegicus	t	2026-04-25 20:37:08.838192-03
00000000-0000-0000-0000-000000000022	Camundongo Balb/c	Mus musculus	t	2026-04-25 20:37:08.838192-03
00000000-0000-0000-0000-000000000023	Peixe-zebra	Danio rerio	t	2026-05-10 10:00:00.000000-03
\.


--
-- Data for Name: outbox_notificacao; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.outbox_notificacao (id, aggregate_type, aggregate_id, channel, event_name, payload, status, created_at, processed_at) FROM stdin;
\.


--
-- Data for Name: papel; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.papel (id, codigo, nome, descricao, criado_em) FROM stdin;
7cacdc08-de03-4fd8-8ccf-83d7e2b456e7	docente	Docente	Pesquisador responsavel por submeter e acompanhar protocolos.	2026-04-25 19:03:15.330872-03
88dfc6af-2144-4f18-a96e-a6778612d3f4	secretaria	Secretaria	Responsavel pela triagem administrativa e organizacao do fluxo.	2026-04-25 19:03:15.330872-03
1d533850-a080-4b8e-a5c1-131981dc1bcf	presidente	Presidente	Responsavel por conduzir deliberacoes e formalizar decisoes.	2026-04-25 19:03:15.330872-03
4cd0b870-0b66-4e00-a110-6243f212e98d	administrador	Administrador	Responsavel pela gestao sistêmica da aplicacao.	2026-04-25 19:03:15.330872-03
9535faec-57ca-4616-aa89-027399ae0ffb	membro_ceua	Membro CEUA	Membro com permissao para avaliar protocolos e participar de reunioes.	2026-04-25 19:03:15.330872-03
550e8400-e29b-41d4-a716-446655440099	parecerista	Parecerista	Responsável pela avaliação técnica	2026-05-09 22:20:10.29985-03
\.


--
-- Data for Name: protocolo; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.protocolo (id, codigo_protocolo, titulo, objetivo, resumo, id_usuario_submetedor, nome_pesquisador_responsavel, nome_departamento, versao_atual, estado, data_submissao, data_inicio_planejada, data_termino_planejada, quantidade_animais_aprovada, observacoes, criado_em, atualizado_em, arquivado_em, justificativa) FROM stdin;
11111111-1111-1111-1111-111111111111	P-2026-N01	Estudo da plasticidade sináptica em hipocampo de ratos	Avaliar a recuperação neuronal pós-isquemia induzida	O projeto foca na análise morfológica de dendritos em modelos de laboratório.	550e8400-e29b-41d4-a716-446655440001	Dr. Ricardo Pesquisador	Departamento de Neurociências	1	submetido	2026-05-10	2026-06-01	2026-12-30	0	\N	2026-05-10 10:00:00-03	2026-05-10 10:00:00-03	\N	Necessário para entender mecanismos de memória e aprendizado.
22222222-2222-2222-2222-222222222222	P-2026-N02	Resposta imune em camundongos pós-vacinação intranasal	Mapear a produção de anticorpos IgA em mucosas	Utilização de diferentes adjuvantes para potencializar a resposta vacinal.	550e8400-e29b-41d4-a716-446655440001	Dr. Ricardo Pesquisador	Lab de Imunologia	1	submetido	2026-05-11	2026-07-01	2026-09-30	0	\N	2026-05-11 09:30:00-03	2026-05-11 09:30:00-03	\N	Desenvolvimento de vacinas menos invasivas e mais eficazes.
33333333-3333-3333-3333-333333333333	P-2026-R01	Efeito de extratos vegetais na cicatrização cutânea	Testar eficácia de pomada baseada em calêndula	Análise histopatológica da velocidade de fechamento de feridas em ratos.	550e8400-e29b-41d4-a716-446655440001	Dr. Ricardo Pesquisador	Centro de Fitoterápicos	1	em_analise_ceua	2026-05-08	2026-06-15	2026-08-15	0	\N	2026-05-08 14:00:00-03	2026-05-08 14:00:00-03	\N	Busca por tratamentos de baixo custo para feridas crônicas.
44444444-4444-4444-4444-444444444444	P-2026-R02	Novos biomarcadores para detecção precoce de Alzheimer	Analisar proteínas específicas no tecido cerebral	Identificação de alterações moleculares antes do surgimento de sintomas clínicos.	550e8400-e29b-41d4-a716-446655440001	Dr. Ricardo Pesquisador	Genética Molecular	1	em_analise_ceua	2026-05-07	2026-08-01	2027-02-28	0	\N	2026-05-07 11:20:00-03	2026-05-07 11:20:00-03	\N	Detecção precoce é crucial para o manejo da doença neurodegenerativa.
55555555-5555-5555-5555-555555555555	P-2026-D01	Parâmetros fisiológicos em peixes-zebra sob estresse térmico	Monitorar batimentos cardíacos em tempo real	Estudo da adaptação de animais aquáticos ao aquecimento global.	550e8400-e29b-41d4-a716-446655440001	Dr. Ricardo Pesquisador	Ecologia Aquática	1	pendencia_solicitada	2026-05-05	2026-06-01	2026-06-30	0	\N	2026-05-05 16:45:00-03	2026-05-09 10:00:00-03	\N	Avaliação do impacto ambiental nas espécies nativas.
\.


--
-- Data for Name: protocolo_decisao; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.protocolo_decisao (id, protocolo_id, reuniao_id, tipo_decisao, decidido_por_usuario_id, decidido_em, valido_ate, fundamentacao, criado_em) FROM stdin;
\.


--
-- Data for Name: protocolo_designacao_parecer; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.protocolo_designacao_parecer (id, protocolo_id, usuario_parecerista_id, atribuido_por_usuario_id, estado_designacao, atribuido_em, prazo_em) FROM stdin;
d3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3	33333333-3333-3333-3333-333333333333	550e8400-e29b-41d4-a716-446655440002	550e8400-e29b-41d4-a716-446655440000	pendente	2026-05-09 09:00:00-03	2026-06-09 23:59:59-03
d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4	44444444-4444-4444-4444-444444444444	550e8400-e29b-41d4-a716-446655440002	550e8400-e29b-41d4-a716-446655440000	pendente	2026-05-09 09:05:00-03	2026-06-09 23:59:59-03
d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d5d5	55555555-5555-5555-5555-555555555555	550e8400-e29b-41d4-a716-446655440002	550e8400-e29b-41d4-a716-446655440000	concluido	2026-05-06 10:00:00-03	2026-06-06 23:59:59-03
\.


--
-- Data for Name: protocolo_estoque_biologico; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.protocolo_estoque_biologico (id, protocolo_id, especie_id, bioterio_id, nome_linhagem, sexo, quantidade_planejada, justificativa, criado_em) FROM stdin;
b1111111-1111-1111-1111-111111111111	11111111-1111-1111-1111-111111111111	00000000-0000-0000-0000-000000000021	00000000-0000-0000-0000-000000000031	Wistar	macho	12	Grupo controle e experimental	2026-05-10 10:00:00-03
b2222222-2222-2222-2222-222222222222	22222222-2222-2222-2222-222222222222	00000000-0000-0000-0000-000000000022	00000000-0000-0000-0000-000000000031	Balb/c	misto	20	Ensaios imunológicos	2026-05-11 09:30:00-03
b3333333-3333-3333-3333-333333333333	33333333-3333-3333-3333-333333333333	00000000-0000-0000-0000-000000000021	00000000-0000-0000-0000-000000000032	Wistar	femea	10	Teste de cicatrização	2026-05-08 14:00:00-03
b4444444-4444-4444-4444-444444444444	44444444-4444-4444-4444-444444444444	00000000-0000-0000-0000-000000000022	00000000-0000-0000-0000-000000000032	Balb/c	misto	15	Análise molecular	2026-05-07 11:20:00-03
b5555555-5555-5555-5555-555555555555	55555555-5555-5555-5555-555555555555	00000000-0000-0000-0000-000000000023	00000000-0000-0000-0000-000000000032	Wild-type	misto	50	Monitoramento cardíaco	2026-05-05 16:45:00-03
\.


--
-- Data for Name: protocolo_historico_status; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.protocolo_historico_status (id, protocolo_id, estado_anterior, novo_estado, motivo_mudanca, alterado_por_usuario_id, alterado_em) FROM stdin;
\.


--
-- Data for Name: protocolo_membro_equipe; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.protocolo_membro_equipe (id, protocolo_id, nome_completo, email, papel_institucional, e_pesquisador_responsavel, criado_em) FROM stdin;
\.


--
-- Data for Name: protocolo_parecer; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.protocolo_parecer (id, designacao_id, recomendacao, resumo_tecnico, consideracoes_eticas, submetido_em) FROM stdin;
f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f5f5	d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d5d5	uso_recomendado	O uso de peixes-zebra como modelo para estresse térmico é adequado. A metodologia de monitoramento não invasivo reduz o sofrimento.	A temperatura da água será monitorada rigorosamente para não ultrapassar os limites letais.	2026-05-09 10:00:00-03
\.


--
-- Data for Name: relatorio; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.relatorio (id, protocolo_id, tipo_documento, caminho_armazenamento, nome_arquivo_original, mime_type, enviado_por_usuario_id, enviado_em) FROM stdin;
\.


--
-- Data for Name: reuniao_comite; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.reuniao_comite (id, codigo_reuniao, agendada_para, descricao_local, estado, observacoes, criado_em) FROM stdin;
550e8400-e29b-41d4-a716-446655440088	RC-2026-MAIO	2026-05-15 14:00:00-03	Sala de Reuniões CEUA - Prédio Central	agendada	Reunião mensal ordinária para julgamento de protocolos de pesquisa.	2026-05-09 22:53:46.798485-03
\.


--
-- Data for Name: reuniao_comite_protocolo; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.reuniao_comite_protocolo (reuniao_id, protocolo_id, ordem_pauta, usuario_relator_id, id) FROM stdin;
550e8400-e29b-41d4-a716-446655440088	55555555-5555-5555-5555-555555555555	1	\N	2a6030eb-5bf3-487f-bad1-9c4daa5b0815
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.usuario (id, id_autenticacao_externa, nome_completo, email, esta_ativo, criado_em, atualizado_em, password_hash) FROM stdin;
550e8400-e29b-41d4-a716-446655440000	\N	Administrador Central	admin@scea.local	t	2026-05-09 22:09:31.21302-03	2026-05-09 22:38:27.079966-03	$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK
550e8400-e29b-41d4-a716-446655440001	\N	Dr. Ricardo Pesquisador	docente@scea.local	t	2026-05-09 22:09:31.21302-03	2026-05-09 22:38:27.080956-03	$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK
550e8400-e29b-41d4-a716-446655440002	\N	Maria Parecerista	parecerista@scea.local	t	2026-05-09 22:09:31.21302-03	2026-05-09 22:38:27.08141-03	$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK
550e8400-e29b-41d4-a716-446655440005	\N	Dra. Helena Presidente	presidente@scea.local	t	2026-05-09 22:09:31.21302-03	2026-05-09 22:38:27.079966-03	$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK
88dfc6af-2144-4f18-a96e-a6778612d3f4	\N	Maria Secretaria	secretaria@scea.local	t	2026-05-10 02:00:00.000000-03	2026-05-10 02:00:00.000000-03	$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK
f2c8d169-5826-4c5a-a9d2-5f2f2ae92d0c	\N	Usuário de Teste (Full)	test@scea.local	t	2026-05-09 22:18:25.854395-03	2026-05-09 22:18:25.854395-03	$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK
\.


--
-- Data for Name: usuario_papel; Type: TABLE DATA; Schema: scea; Owner: postgres
--

COPY scea.usuario_papel (usuario_id, papel_id, atribuido_por_usuario_id, atribuido_em) FROM stdin;
550e8400-e29b-41d4-a716-446655440000	4cd0b870-0b66-4e00-a110-6243f212e98d	550e8400-e29b-41d4-a716-446655440000	2026-05-09 22:09:31.21302-03
550e8400-e29b-41d4-a716-446655440001	7cacdc08-de03-4fd8-8ccf-83d7e2b456e7	550e8400-e29b-41d4-a716-446655440000	2026-05-09 22:09:31.21302-03
550e8400-e29b-41d4-a716-446655440002	9535faec-57ca-4616-aa89-027399ae0ffb	550e8400-e29b-41d4-a716-446655440000	2026-05-09 22:09:31.21302-03
f2c8d169-5826-4c5a-a9d2-5f2f2ae92d0c	4cd0b870-0b66-4e00-a110-6243f212e98d	\N	2026-05-09 22:18:25.885052-03
f2c8d169-5826-4c5a-a9d2-5f2f2ae92d0c	7cacdc08-de03-4fd8-8ccf-83d7e2b456e7	\N	2026-05-09 22:18:25.885052-03
f2c8d169-5826-4c5a-a9d2-5f2f2ae92d0c	9535faec-57ca-4616-aa89-027399ae0ffb	f2c8d169-5826-4c5a-a9d2-5f2f2ae92d0c	2026-05-09 22:19:04.43702-03
f2c8d169-5826-4c5a-a9d2-5f2f2ae92d0c	550e8400-e29b-41d4-a716-446655440099	f2c8d169-5826-4c5a-a9d2-5f2f2ae92d0c	2026-05-09 22:20:10.29985-03
550e8400-e29b-41d4-a716-446655440005	1d533850-a080-4b8e-a5c1-131981dc1bcf	\N	2026-05-09 20:45:01.320159-03
\.


--
-- Name: usuario app_user_email_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.usuario
    ADD CONSTRAINT app_user_email_unique UNIQUE (email);


--
-- Name: usuario app_user_external_auth_id_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.usuario
    ADD CONSTRAINT app_user_external_auth_id_unique UNIQUE (id_autenticacao_externa);


--
-- Name: usuario app_user_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.usuario
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- Name: bioterio bioterium_code_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.bioterio
    ADD CONSTRAINT bioterium_code_unique UNIQUE (codigo);


--
-- Name: bioterio bioterium_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.bioterio
    ADD CONSTRAINT bioterium_pkey PRIMARY KEY (id);


--
-- Name: reuniao_comite committee_meeting_meeting_code_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.reuniao_comite
    ADD CONSTRAINT committee_meeting_meeting_code_unique UNIQUE (codigo_reuniao);


--
-- Name: reuniao_comite committee_meeting_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.reuniao_comite
    ADD CONSTRAINT committee_meeting_pkey PRIMARY KEY (id);


--
-- Name: reuniao_comite_protocolo committee_meeting_protocol_agenda_order_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.reuniao_comite_protocolo
    ADD CONSTRAINT committee_meeting_protocol_agenda_order_unique UNIQUE (reuniao_id, ordem_pauta);


--
-- Name: outbox_notificacao notification_outbox_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.outbox_notificacao
    ADD CONSTRAINT notification_outbox_pkey PRIMARY KEY (id);


--
-- Name: protocolo_estoque_biologico protocol_biological_stock_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_estoque_biologico
    ADD CONSTRAINT protocol_biological_stock_pkey PRIMARY KEY (id);


--
-- Name: protocolo_decisao protocol_decision_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_decisao
    ADD CONSTRAINT protocol_decision_pkey PRIMARY KEY (id);


--
-- Name: protocolo_decisao protocol_decision_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_decisao
    ADD CONSTRAINT protocol_decision_unique UNIQUE (protocolo_id, reuniao_id);


--
-- Name: relatorio protocol_document_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.relatorio
    ADD CONSTRAINT protocol_document_pkey PRIMARY KEY (id);


--
-- Name: protocolo protocol_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo
    ADD CONSTRAINT protocol_pkey PRIMARY KEY (id);


--
-- Name: protocolo protocol_protocol_code_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo
    ADD CONSTRAINT protocol_protocol_code_unique UNIQUE (codigo_protocolo);


--
-- Name: protocolo_parecer protocol_review_assignment_id_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_parecer
    ADD CONSTRAINT protocol_review_assignment_id_unique UNIQUE (designacao_id);


--
-- Name: protocolo_designacao_parecer protocol_review_assignment_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_designacao_parecer
    ADD CONSTRAINT protocol_review_assignment_pkey PRIMARY KEY (id);


--
-- Name: protocolo_designacao_parecer protocol_review_assignment_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_designacao_parecer
    ADD CONSTRAINT protocol_review_assignment_unique UNIQUE (protocolo_id, usuario_parecerista_id);


--
-- Name: protocolo_parecer protocol_review_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_parecer
    ADD CONSTRAINT protocol_review_pkey PRIMARY KEY (id);


--
-- Name: protocolo_historico_status protocol_status_history_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_historico_status
    ADD CONSTRAINT protocol_status_history_pkey PRIMARY KEY (id);


--
-- Name: protocolo_membro_equipe protocol_team_member_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_membro_equipe
    ADD CONSTRAINT protocol_team_member_pkey PRIMARY KEY (id);


--
-- Name: reuniao_comite_protocolo reuniao_comite_protocolo_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.reuniao_comite_protocolo
    ADD CONSTRAINT reuniao_comite_protocolo_pkey PRIMARY KEY (id);


--
-- Name: papel role_code_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.papel
    ADD CONSTRAINT role_code_unique UNIQUE (codigo);


--
-- Name: papel role_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.papel
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: especie species_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.especie
    ADD CONSTRAINT species_pkey PRIMARY KEY (id);


--
-- Name: especie species_scientific_name_unique; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.especie
    ADD CONSTRAINT species_scientific_name_unique UNIQUE (codigo);


--
-- Name: usuario_papel user_role_pkey; Type: CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.usuario_papel
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (usuario_id, papel_id);


--
-- Name: idx_committee_meeting_scheduled_for; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_committee_meeting_scheduled_for ON scea.reuniao_comite USING btree (agendada_para);


--
-- Name: idx_notification_outbox_aggregate; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_notification_outbox_aggregate ON scea.outbox_notificacao USING btree (aggregate_type, aggregate_id);


--
-- Name: idx_notification_outbox_status_created_at; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_notification_outbox_status_created_at ON scea.outbox_notificacao USING btree (status, created_at);


--
-- Name: idx_protocol_biological_stock_protocol_id; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_protocol_biological_stock_protocol_id ON scea.protocolo_estoque_biologico USING btree (protocolo_id);


--
-- Name: idx_protocol_decision_protocol_id; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_protocol_decision_protocol_id ON scea.protocolo_decisao USING btree (protocolo_id);


--
-- Name: idx_protocol_document_protocol_id; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_protocol_document_protocol_id ON scea.relatorio USING btree (protocolo_id);


--
-- Name: idx_protocol_review_assignment_protocol_id; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_protocol_review_assignment_protocol_id ON scea.protocolo_designacao_parecer USING btree (protocolo_id);


--
-- Name: idx_protocol_status; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_protocol_status ON scea.protocolo USING btree (estado);


--
-- Name: idx_protocol_status_history_protocol_id_changed_at; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_protocol_status_history_protocol_id_changed_at ON scea.protocolo_historico_status USING btree (protocolo_id, alterado_em DESC);


--
-- Name: idx_protocol_submission_date; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_protocol_submission_date ON scea.protocolo USING btree (data_submissao);


--
-- Name: idx_protocol_submitter_user_id; Type: INDEX; Schema: scea; Owner: postgres
--

CREATE INDEX idx_protocol_submitter_user_id ON scea.protocolo USING btree (id_usuario_submetedor);


--
-- Name: protocolo trigger_atualizar_protocolo_timestamp; Type: TRIGGER; Schema: scea; Owner: postgres
--

CREATE TRIGGER trigger_atualizar_protocolo_timestamp BEFORE UPDATE ON scea.protocolo FOR EACH ROW EXECUTE FUNCTION scea.atualizar_timestamp_atualizacao();


--
-- Name: usuario trigger_atualizar_usuario_timestamp; Type: TRIGGER; Schema: scea; Owner: postgres
--

CREATE TRIGGER trigger_atualizar_usuario_timestamp BEFORE UPDATE ON scea.usuario FOR EACH ROW EXECUTE FUNCTION scea.atualizar_timestamp_atualizacao();


--
-- Name: reuniao_comite_protocolo committee_meeting_protocol_meeting_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.reuniao_comite_protocolo
    ADD CONSTRAINT committee_meeting_protocol_meeting_id_fk FOREIGN KEY (reuniao_id) REFERENCES scea.reuniao_comite(id) ON DELETE CASCADE;


--
-- Name: reuniao_comite_protocolo committee_meeting_protocol_presenter_user_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.reuniao_comite_protocolo
    ADD CONSTRAINT committee_meeting_protocol_presenter_user_id_fk FOREIGN KEY (usuario_relator_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;


--
-- Name: reuniao_comite_protocolo committee_meeting_protocol_protocol_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.reuniao_comite_protocolo
    ADD CONSTRAINT committee_meeting_protocol_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;


--
-- Name: protocolo_estoque_biologico protocol_biological_stock_bioterium_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_estoque_biologico
    ADD CONSTRAINT protocol_biological_stock_bioterium_id_fk FOREIGN KEY (bioterio_id) REFERENCES scea.bioterio(id) ON DELETE RESTRICT;


--
-- Name: protocolo_estoque_biologico protocol_biological_stock_protocol_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_estoque_biologico
    ADD CONSTRAINT protocol_biological_stock_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;


--
-- Name: protocolo_estoque_biologico protocol_biological_stock_species_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_estoque_biologico
    ADD CONSTRAINT protocol_biological_stock_species_id_fk FOREIGN KEY (especie_id) REFERENCES scea.especie(id) ON DELETE RESTRICT;


--
-- Name: protocolo_decisao protocol_decision_decided_by_user_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_decisao
    ADD CONSTRAINT protocol_decision_decided_by_user_id_fk FOREIGN KEY (decidido_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;


--
-- Name: protocolo_decisao protocol_decision_meeting_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_decisao
    ADD CONSTRAINT protocol_decision_meeting_id_fk FOREIGN KEY (reuniao_id) REFERENCES scea.reuniao_comite(id) ON DELETE RESTRICT;


--
-- Name: protocolo_decisao protocol_decision_protocol_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_decisao
    ADD CONSTRAINT protocol_decision_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;


--
-- Name: relatorio protocol_document_protocol_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.relatorio
    ADD CONSTRAINT protocol_document_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;


--
-- Name: relatorio protocol_document_uploaded_by_user_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.relatorio
    ADD CONSTRAINT protocol_document_uploaded_by_user_id_fk FOREIGN KEY (enviado_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;


--
-- Name: protocolo_designacao_parecer protocol_review_assignment_assigned_by_user_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_designacao_parecer
    ADD CONSTRAINT protocol_review_assignment_assigned_by_user_id_fk FOREIGN KEY (atribuido_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;


--
-- Name: protocolo_parecer protocol_review_assignment_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_parecer
    ADD CONSTRAINT protocol_review_assignment_id_fk FOREIGN KEY (designacao_id) REFERENCES scea.protocolo_designacao_parecer(id) ON DELETE CASCADE;


--
-- Name: protocolo_designacao_parecer protocol_review_assignment_protocol_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_designacao_parecer
    ADD CONSTRAINT protocol_review_assignment_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;


--
-- Name: protocolo_designacao_parecer protocol_review_assignment_reviewer_user_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_designacao_parecer
    ADD CONSTRAINT protocol_review_assignment_reviewer_user_id_fk FOREIGN KEY (usuario_parecerista_id) REFERENCES scea.usuario(id) ON DELETE RESTRICT;


--
-- Name: protocolo_historico_status protocol_status_history_changed_by_user_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_historico_status
    ADD CONSTRAINT protocol_status_history_changed_by_user_id_fk FOREIGN KEY (alterado_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;


--
-- Name: protocolo_historico_status protocol_status_history_protocol_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_historico_status
    ADD CONSTRAINT protocol_status_history_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;


--
-- Name: protocolo protocol_submitter_user_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo
    ADD CONSTRAINT protocol_submitter_user_id_fk FOREIGN KEY (id_usuario_submetedor) REFERENCES scea.usuario(id) ON DELETE RESTRICT;


--
-- Name: protocolo_membro_equipe protocol_team_member_protocol_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.protocolo_membro_equipe
    ADD CONSTRAINT protocol_team_member_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;


--
-- Name: usuario_papel user_role_assigned_by_user_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.usuario_papel
    ADD CONSTRAINT user_role_assigned_by_user_id_fk FOREIGN KEY (atribuido_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;


--
-- Name: usuario_papel user_role_role_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.usuario_papel
    ADD CONSTRAINT user_role_role_id_fk FOREIGN KEY (papel_id) REFERENCES scea.papel(id) ON DELETE RESTRICT;


--
-- Name: usuario_papel user_role_user_id_fk; Type: FK CONSTRAINT; Schema: scea; Owner: postgres
--

ALTER TABLE ONLY scea.usuario_papel
    ADD CONSTRAINT user_role_user_id_fk FOREIGN KEY (usuario_id) REFERENCES scea.usuario(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

