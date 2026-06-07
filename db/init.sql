--
-- PostgreSQL database dump
--

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
DROP SCHEMA IF EXISTS scea CASCADE;
CREATE SCHEMA scea;

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
-- Tables definitions
--

CREATE TABLE scea.bioterio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo text NOT NULL,
    nome text NOT NULL,
    descricao text,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE scea.especie (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    codigo text NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);

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

CREATE TABLE scea.papel (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo text NOT NULL,
    nome text NOT NULL,
    descricao text,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);

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
    protocolo_pai_id uuid,
    ativo boolean DEFAULT true NOT NULL
);

CREATE TABLE scea.protocolo_decisao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    reuniao_id uuid NOT NULL,
    tipo_decisao text NOT NULL,
    decidido_por_usuario_id uuid,
    decidido_em timestamp with time zone DEFAULT now() NOT NULL,
    valido_ate timestamp with time zone,
    fundamentacao text,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE scea.protocolo_designacao_parecer (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    usuario_parecerista_id uuid NOT NULL,
    atribuido_por_usuario_id uuid,
    estado_designacao text DEFAULT 'pending'::text NOT NULL,
    atribuido_em timestamp with time zone DEFAULT now() NOT NULL,
    prazo_em timestamp with time zone
);

CREATE TABLE scea.protocolo_estoque_biologico (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    especie_id uuid NOT NULL,
    bioterio_id uuid NOT NULL,
    nome_linhagem text,
    sexo text NOT NULL,
    quantidade_planejada integer NOT NULL,
    justificativa text NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE scea.protocolo_historico_status (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    estado_anterior text,
    novo_estado text NOT NULL,
    motivo_mudanca text,
    alterado_por_usuario_id uuid,
    alterado_em timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE scea.protocolo_membro_equipe (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    nome_completo text NOT NULL,
    email text,
    papel_institucional text NOT NULL,
    e_pesquisador_responsavel boolean DEFAULT false NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE scea.protocolo_parecer (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    designacao_id uuid NOT NULL,
    recomendacao text NOT NULL,
    resumo_tecnico text NOT NULL,
    consideracoes_eticas text,
    submetido_em timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE scea.relatorio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    protocolo_id uuid NOT NULL,
    tipo_documento text NOT NULL,
    caminho_armazenamento text NOT NULL,
    nome_arquivo_original text NOT NULL,
    mime_type text NOT NULL,
    enviado_por_usuario_id uuid,
    enviado_em timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE scea.reuniao_comite (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo_reuniao text NOT NULL,
    agendada_para timestamp with time zone NOT NULL,
    descricao_local text,
    estado text DEFAULT 'agendada'::text NOT NULL,
    observacoes text,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE scea.reuniao_comite_protocolo (
    reuniao_id uuid NOT NULL,
    protocolo_id uuid NOT NULL,
    ordem_pauta integer NOT NULL,
    usuario_relator_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);

CREATE TABLE scea.usuario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    id_autenticacao_externa text,
    nome_completo text NOT NULL,
    email text NOT NULL,
    esta_ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp with time zone DEFAULT now() NOT NULL,
    password_hash text
);

CREATE TABLE scea.usuario_papel (
    usuario_id uuid NOT NULL,
    papel_id uuid NOT NULL,
    atribuido_por_usuario_id uuid,
    atribuido_em timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Data Insertion
--

INSERT INTO scea.bioterio VALUES ('00000000-0000-0000-0000-000000000031', 'BIO-CENTRAL', 'Biotério Central de Roedores', 'Unidade principal de criação e manutenção de linhagens isogênicas.', true, '2026-04-25 20:37:08.839486-03');
INSERT INTO scea.bioterio VALUES ('00000000-0000-0000-0000-000000000032', 'LAB-FARMA', 'Laboratório de Farmacologia Experimental', 'Unidade voltada para testes de toxicidade e eficácia de novos fármacos.', true, '2026-05-10 10:00:00.000000-03');
INSERT INTO scea.bioterio VALUES ('00000000-0000-0000-0000-000000000033', 'LAB-FISIO', 'Laboratório de Fisiologia Aplicada', 'Unidade experimental para estudos de comportamento e metabolismo.', true, '2026-05-12 09:00:00.000000-03');

INSERT INTO scea.especie VALUES ('00000000-0000-0000-0000-000000000021', 'Rato Wistar', 'Rattus norvegicus', true, '2026-04-25 20:37:08.838192-03');
INSERT INTO scea.especie VALUES ('00000000-0000-0000-0000-000000000022', 'Camundongo BALB/c', 'Mus musculus', true, '2026-04-25 20:37:08.838192-03');
INSERT INTO scea.especie VALUES ('00000000-0000-0000-0000-000000000023', 'Peixe-zebra', 'Danio rerio', true, '2026-05-10 10:00:00.000000-03');
INSERT INTO scea.especie VALUES ('00000000-0000-0000-0000-000000000024', 'Camundongo C57BL/6', 'Mus musculus C57', true, '2026-05-12 10:00:00.000000-03');
INSERT INTO scea.especie VALUES ('00000000-0000-0000-0000-000000000025', 'Coelho Nova Zelândia', 'Oryctolagus cuniculus', true, '2026-05-12 11:00:00.000000-03');

INSERT INTO scea.papel VALUES ('7cacdc08-de03-4fd8-8ccf-83d7e2b456e7', 'docente', 'Docente', 'Pesquisador responsavel por submeter e acompanhar protocolos.', '2026-04-25 19:03:15.330872-03');
INSERT INTO scea.papel VALUES ('88dfc6af-2144-4f18-a96e-a6778612d3f4', 'secretaria', 'Secretaria', 'Responsavel pela triagem administrativa e organizacao do fluxo.', '2026-04-25 19:03:15.330872-03');
INSERT INTO scea.papel VALUES ('1d533850-a080-4b8e-a5c1-131981dc1bcf', 'presidente', 'Presidente', 'Responsavel por conduzir deliberacoes e formalizar decisoes.', '2026-04-25 19:03:15.330872-03');
INSERT INTO scea.papel VALUES ('4cd0b870-0b66-4e00-a110-6243f212e98d', 'administrador', 'Administrador', 'Responsavel pela gestao sistêmica da aplicacao.', '2026-04-25 19:03:15.330872-03');
INSERT INTO scea.papel VALUES ('9535faec-57ca-4616-aa89-027399ae0ffb', 'membro_ceua', 'Membro CEUA', 'Membro com permissao para avaliar protocolos e participar de reunioes.', '2026-04-25 19:03:15.330872-03');
INSERT INTO scea.papel VALUES ('550e8400-e29b-41d4-a716-446655440099', 'parecerista', 'Parecerista', 'Responsável pela avaliação técnica', '2026-05-09 22:20:10.29985-03');

INSERT INTO scea.usuario VALUES ('a1111111-1111-1111-1111-111111111111', NULL, 'Gustavo Cortez', 'gustavo.cortez@ufms.br', true, '2026-05-09 22:09:31.21302-03', '2026-05-09 22:38:27.079966-03', '$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK');
INSERT INTO scea.usuario VALUES ('a2222222-2222-2222-2222-222222222222', NULL, 'Mayara Marques', 'mayara.m.o.goncalves@ufms.br', true, '2026-05-10 02:00:00.000000-03', '2026-05-10 02:00:00.000000-03', '$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK');
INSERT INTO scea.usuario VALUES ('a3333333-3333-3333-3333-333333333333', NULL, 'Eduardo Xavier', 'eduardo.p.xavier@ufms.br', true, '2026-05-12 10:00:00.000000-03', '2026-05-12 10:00:00.000000-03', '$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK');
INSERT INTO scea.usuario VALUES ('a4444444-4444-4444-4444-444444444444', NULL, 'Italo Fucci', 'italo.fucci@ufms.br', true, '2026-05-12 11:00:00.000000-03', '2026-05-12 11:00:00.000000-03', '$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK');
INSERT INTO scea.usuario VALUES ('a5555555-5555-5555-5555-555555555555', NULL, 'Rafael Victor', 'rafael.victor@ufms.br', true, '2026-05-12 12:00:00.000000-03', '2026-05-12 12:00:00.000000-03', '$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK');
INSERT INTO scea.usuario VALUES ('550e8400-e29b-41d4-a716-446655440000', NULL,'Administrador Central',	'secretariascea@gmail.com',	true	,'2026-05-09 22:09:31.21302-03', '2026-05-09 22:38:27.079966-03', '$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK');

INSERT INTO scea.usuario_papel VALUES ('a1111111-1111-1111-1111-111111111111', '4cd0b870-0b66-4e00-a110-6243f212e98d', 'a1111111-1111-1111-1111-111111111111', '2026-05-09 22:09:31.21302-03');
INSERT INTO scea.usuario_papel VALUES ('a1111111-1111-1111-1111-111111111111', '1d533850-a080-4b8e-a5c1-131981dc1bcf', 'a1111111-1111-1111-1111-111111111111', '2026-05-09 22:09:31.21302-03');
INSERT INTO scea.usuario_papel VALUES ('a2222222-2222-2222-2222-222222222222', '88dfc6af-2144-4f18-a96e-a6778612d3f4', 'a1111111-1111-1111-1111-111111111111', '2026-05-10 02:00:00.000000-03');
INSERT INTO scea.usuario_papel VALUES ('a3333333-3333-3333-3333-333333333333', '7cacdc08-de03-4fd8-8ccf-83d7e2b456e7', 'a1111111-1111-1111-1111-111111111111', '2026-05-12 10:00:00.000000-03');
INSERT INTO scea.usuario_papel VALUES ('a4444444-4444-4444-4444-444444444444', '550e8400-e29b-41d4-a716-446655440099', 'a1111111-1111-1111-1111-111111111111', '2026-05-12 11:00:00.000000-03');
INSERT INTO scea.usuario_papel VALUES ('a5555555-5555-5555-5555-555555555555', '9535faec-57ca-4616-aa89-027399ae0ffb', 'a1111111-1111-1111-1111-111111111111', '2026-05-12 12:00:00.000000-03');
INSERT INTO scea.usuario_papel VALUES ('550e8400-e29b-41d4-a716-446655440000', '4cd0b870-0b66-4e00-a110-6243f212e98d', 'a1111111-1111-1111-1111-111111111111', '2026-05-09 22:09:31.21302-03');

INSERT INTO scea.reuniao_comite VALUES ('550e8400-e29b-41d4-a716-446655440088', 'RC-2026-JUNHO', '2026-06-15 14:00:00-03', 'Sala de Reuniões CEUA - Bloco 5', 'agendada', 'Reunião mensal ordinária para julgamento de protocolos acumulados no semestre.', '2026-05-12 22:53:46.798485-03');
--
-- Constraints and Indexes
--

ALTER TABLE ONLY scea.usuario ADD CONSTRAINT app_user_email_unique UNIQUE (email);
ALTER TABLE ONLY scea.usuario ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.bioterio ADD CONSTRAINT bioterium_code_unique UNIQUE (codigo);
ALTER TABLE ONLY scea.bioterio ADD CONSTRAINT bioterium_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.reuniao_comite ADD CONSTRAINT committee_meeting_meeting_code_unique UNIQUE (codigo_reuniao);
ALTER TABLE ONLY scea.reuniao_comite ADD CONSTRAINT committee_meeting_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.reuniao_comite_protocolo ADD CONSTRAINT committee_meeting_protocol_agenda_order_unique UNIQUE (reuniao_id, ordem_pauta);
ALTER TABLE ONLY scea.outbox_notificacao ADD CONSTRAINT notification_outbox_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.protocolo_estoque_biologico ADD CONSTRAINT protocol_biological_stock_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.protocolo_decisao ADD CONSTRAINT protocol_decision_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.protocolo_decisao ADD CONSTRAINT protocol_decision_unique UNIQUE (protocolo_id, reuniao_id);
ALTER TABLE ONLY scea.relatorio ADD CONSTRAINT protocol_document_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.protocolo ADD CONSTRAINT protocol_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.protocolo ADD CONSTRAINT protocol_protocol_code_unique UNIQUE (codigo_protocolo);
ALTER TABLE ONLY scea.protocolo_parecer ADD CONSTRAINT protocol_review_assignment_id_unique UNIQUE (designacao_id);
ALTER TABLE ONLY scea.protocolo_designacao_parecer ADD CONSTRAINT protocol_review_assignment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.protocolo_designacao_parecer ADD CONSTRAINT protocol_review_assignment_unique UNIQUE (protocolo_id, usuario_parecerista_id);
ALTER TABLE ONLY scea.protocolo_parecer ADD CONSTRAINT protocol_review_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.protocolo_historico_status ADD CONSTRAINT protocol_status_history_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.protocolo_membro_equipe ADD CONSTRAINT protocol_team_member_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.reuniao_comite_protocolo ADD CONSTRAINT reuniao_comite_protocolo_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.papel ADD CONSTRAINT role_code_unique UNIQUE (codigo);
ALTER TABLE ONLY scea.papel ADD CONSTRAINT role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.especie ADD CONSTRAINT species_pkey PRIMARY KEY (id);
ALTER TABLE ONLY scea.especie ADD CONSTRAINT species_scientific_name_unique UNIQUE (codigo);
ALTER TABLE ONLY scea.usuario_papel ADD CONSTRAINT user_role_pkey PRIMARY KEY (usuario_id, papel_id);

CREATE INDEX idx_committee_meeting_scheduled_for ON scea.reuniao_comite (agendada_para);
CREATE INDEX idx_notification_outbox_aggregate ON scea.outbox_notificacao (aggregate_type, aggregate_id);
CREATE INDEX idx_notification_outbox_status_created_at ON scea.outbox_notificacao (status, created_at);
CREATE INDEX idx_protocol_biological_stock_protocol_id ON scea.protocolo_estoque_biologico (protocolo_id);
CREATE INDEX idx_protocol_decision_protocol_id ON scea.protocolo_decisao (protocolo_id);
CREATE INDEX idx_protocol_document_protocol_id ON scea.relatorio (protocolo_id);
CREATE INDEX idx_protocol_review_assignment_protocol_id ON scea.protocolo_designacao_parecer (protocolo_id);
CREATE INDEX idx_protocol_status ON scea.protocolo (estado);
CREATE INDEX idx_protocol_status_history_protocol_id_changed_at ON scea.protocolo_historico_status (protocolo_id, alterado_em DESC);
CREATE INDEX idx_protocol_submission_date ON scea.protocolo (data_submissao);
CREATE INDEX idx_protocol_submitter_user_id ON scea.protocolo (id_usuario_submetedor);

CREATE TRIGGER trigger_atualizar_protocolo_timestamp BEFORE UPDATE ON scea.protocolo FOR EACH ROW EXECUTE FUNCTION scea.atualizar_timestamp_atualizacao();
CREATE TRIGGER trigger_atualizar_usuario_timestamp BEFORE UPDATE ON scea.usuario FOR EACH ROW EXECUTE FUNCTION scea.atualizar_timestamp_atualizacao();

-- Foreign Keys
ALTER TABLE ONLY scea.reuniao_comite_protocolo ADD CONSTRAINT committee_meeting_protocol_meeting_id_fk FOREIGN KEY (reuniao_id) REFERENCES scea.reuniao_comite(id) ON DELETE CASCADE;
ALTER TABLE ONLY scea.reuniao_comite_protocolo ADD CONSTRAINT committee_meeting_protocol_presenter_user_id_fk FOREIGN KEY (usuario_relator_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;
ALTER TABLE ONLY scea.reuniao_comite_protocolo ADD CONSTRAINT committee_meeting_protocol_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;
ALTER TABLE ONLY scea.protocolo_estoque_biologico ADD CONSTRAINT protocol_biological_stock_bioterium_id_fk FOREIGN KEY (bioterio_id) REFERENCES scea.bioterio(id) ON DELETE RESTRICT;
ALTER TABLE ONLY scea.protocolo_estoque_biologico ADD CONSTRAINT protocol_biological_stock_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;
ALTER TABLE ONLY scea.protocolo_estoque_biologico ADD CONSTRAINT protocol_biological_stock_species_id_fk FOREIGN KEY (especie_id) REFERENCES scea.especie(id) ON DELETE RESTRICT;
ALTER TABLE ONLY scea.protocolo_decisao ADD CONSTRAINT protocol_decision_decided_by_user_id_fk FOREIGN KEY (decidido_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;
ALTER TABLE ONLY scea.protocolo_decisao ADD CONSTRAINT protocol_decision_meeting_id_fk FOREIGN KEY (reuniao_id) REFERENCES scea.reuniao_comite(id) ON DELETE RESTRICT;
ALTER TABLE ONLY scea.protocolo_decisao ADD CONSTRAINT protocol_decision_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;
ALTER TABLE ONLY scea.relatorio ADD CONSTRAINT protocol_document_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;
ALTER TABLE ONLY scea.relatorio ADD CONSTRAINT protocol_document_uploaded_by_user_id_fk FOREIGN KEY (enviado_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;
ALTER TABLE ONLY scea.protocolo_designacao_parecer ADD CONSTRAINT protocol_review_assignment_assigned_by_user_id_fk FOREIGN KEY (atribuido_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;
ALTER TABLE ONLY scea.protocolo_parecer ADD CONSTRAINT protocol_review_assignment_id_fk FOREIGN KEY (designacao_id) REFERENCES scea.protocolo_designacao_parecer(id) ON DELETE CASCADE;
ALTER TABLE ONLY scea.protocolo_designacao_parecer ADD CONSTRAINT protocol_review_assignment_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;
ALTER TABLE ONLY scea.protocolo_designacao_parecer ADD CONSTRAINT protocol_review_assignment_reviewer_user_id_fk FOREIGN KEY (usuario_parecerista_id) REFERENCES scea.usuario(id) ON DELETE RESTRICT;
ALTER TABLE ONLY scea.protocolo_historico_status ADD CONSTRAINT protocol_status_history_changed_by_user_id_fk FOREIGN KEY (alterado_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;
ALTER TABLE ONLY scea.protocolo_historico_status ADD CONSTRAINT protocol_status_history_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;
ALTER TABLE ONLY scea.protocolo ADD CONSTRAINT protocol_submitter_user_id_fk FOREIGN KEY (id_usuario_submetedor) REFERENCES scea.usuario(id) ON DELETE RESTRICT;
ALTER TABLE ONLY scea.protocolo ADD CONSTRAINT protocol_parent_id_fk FOREIGN KEY (protocolo_pai_id) REFERENCES scea.protocolo(id) ON DELETE SET NULL;
ALTER TABLE ONLY scea.protocolo_membro_equipe ADD CONSTRAINT protocol_team_member_protocol_id_fk FOREIGN KEY (protocolo_id) REFERENCES scea.protocolo(id) ON DELETE CASCADE;
ALTER TABLE ONLY scea.usuario_papel ADD CONSTRAINT user_role_assigned_by_user_id_fk FOREIGN KEY (atribuido_por_usuario_id) REFERENCES scea.usuario(id) ON DELETE SET NULL;
ALTER TABLE ONLY scea.usuario_papel ADD CONSTRAINT user_role_role_id_fk FOREIGN KEY (papel_id) REFERENCES scea.papel(id) ON DELETE RESTRICT;
ALTER TABLE ONLY scea.usuario_papel ADD CONSTRAINT user_role_user_id_fk FOREIGN KEY (usuario_id) REFERENCES scea.usuario(id) ON DELETE CASCADE;

COMMENT ON COLUMN scea.protocolo.protocolo_pai_id IS 'Referência ao protocolo original (matriz) em caso de emenda (RN06).';
