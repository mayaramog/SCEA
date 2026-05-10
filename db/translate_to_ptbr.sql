-- Script de tradução do schema SCEA para Português
SET search_path TO scea;

-- 1. Renomear Tabelas
ALTER TABLE role RENAME TO papel;
ALTER TABLE app_user RENAME TO usuario;
ALTER TABLE user_role RENAME TO usuario_papel;
ALTER TABLE species RENAME TO especie;
ALTER TABLE bioterium RENAME TO bioterio;
ALTER TABLE protocol RENAME TO protocolo;
ALTER TABLE protocol_team_member RENAME TO protocolo_membro_equipe;
ALTER TABLE protocol_status_history RENAME TO protocolo_historico_status;
ALTER TABLE protocol_document RENAME TO protocolo_documento;
ALTER TABLE protocol_biological_stock RENAME TO protocolo_estoque_biologico;
ALTER TABLE protocol_review_assignment RENAME TO protocolo_designacao_parecer;
ALTER TABLE protocol_review RENAME TO protocolo_parecer;
ALTER TABLE committee_meeting RENAME TO reuniao_comite;
ALTER TABLE committee_meeting_protocol RENAME TO reuniao_comite_protocolo;
ALTER TABLE protocol_decision RENAME TO protocolo_decisao;
ALTER TABLE notification_outbox RENAME TO outbox_notificacao;

-- 2. Renomear Colunas (Exemplos principais para Auth e Protocolo)
ALTER TABLE usuario RENAME COLUMN full_name TO nome_completo;
ALTER TABLE usuario RENAME COLUMN is_active TO esta_ativo;
ALTER TABLE usuario RENAME COLUMN created_at TO criado_em;
ALTER TABLE usuario RENAME COLUMN updated_at TO atualizado_em;
ALTER TABLE usuario RENAME COLUMN external_auth_id TO id_autenticacao_externa;

ALTER TABLE papel RENAME COLUMN code TO codigo;
ALTER TABLE papel RENAME COLUMN name TO nome;
ALTER TABLE papel RENAME COLUMN description TO descricao;
ALTER TABLE papel RENAME COLUMN created_at TO criado_em;

ALTER TABLE protocolo RENAME COLUMN protocol_code TO codigo_protocolo;
ALTER TABLE protocolo RENAME COLUMN title TO titulo;
ALTER TABLE protocolo RENAME COLUMN objective TO objetivo;
ALTER TABLE protocolo RENAME COLUMN summary TO resumo;
ALTER TABLE protocolo RENAME COLUMN submitter_user_id TO id_usuario_submetedor;
ALTER TABLE protocolo RENAME COLUMN responsible_researcher_name TO nome_pesquisador_responsavel;
ALTER TABLE protocolo RENAME COLUMN department_name TO nome_departamento;
ALTER TABLE protocolo RENAME COLUMN current_version TO versao_atual;
ALTER TABLE protocolo RENAME COLUMN status TO estado;
ALTER TABLE protocolo RENAME COLUMN submission_date TO data_submissao;
ALTER TABLE protocolo RENAME COLUMN planned_start_date TO data_inicio_planejada;
ALTER TABLE protocolo RENAME COLUMN planned_end_date TO data_termino_planejada;
ALTER TABLE protocolo RENAME COLUMN approved_animal_count TO quantidade_animais_aprovada;
ALTER TABLE protocolo RENAME COLUMN notes TO observacoes;
ALTER TABLE protocolo RENAME COLUMN created_at TO criado_em;
ALTER TABLE protocolo RENAME COLUMN updated_at TO atualizado_em;
ALTER TABLE protocolo RENAME COLUMN archived_at TO arquivado_em;

-- 3. Atualizar Valores de Enums (Estado e Papel)
UPDATE papel SET codigo = 'docente' WHERE codigo = 'docente';
UPDATE papel SET codigo = 'secretaria' WHERE codigo = 'secretaria';
UPDATE papel SET codigo = 'presidente' WHERE codigo = 'presidente';
UPDATE papel SET codigo = 'administrador' WHERE codigo = 'administrador';
UPDATE papel SET codigo = 'membro_ceua' WHERE codigo = 'membro_ceua';

UPDATE protocolo SET estado = 'rascunho' WHERE estado = 'draft';
UPDATE protocolo SET estado = 'em_analise_ceua' WHERE estado = 'under_ceua_review';
UPDATE protocolo SET estado = 'aprovado' WHERE estado = 'approved';
