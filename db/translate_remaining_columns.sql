SET search_path TO scea;

-- usuario_papel
ALTER TABLE usuario_papel RENAME COLUMN user_id TO usuario_id;
ALTER TABLE usuario_papel RENAME COLUMN role_id TO papel_id;
ALTER TABLE usuario_papel RENAME COLUMN assigned_by_user_id TO atribuido_por_usuario_id;
ALTER TABLE usuario_papel RENAME COLUMN assigned_at TO atribuido_em;

-- protocolo_membro_equipe
ALTER TABLE protocolo_membro_equipe RENAME COLUMN protocol_id TO protocolo_id;
ALTER TABLE protocolo_membro_equipe RENAME COLUMN is_responsible_researcher TO e_pesquisador_responsavel;
ALTER TABLE protocolo_membro_equipe RENAME COLUMN full_name TO nome_completo;
ALTER TABLE protocolo_membro_equipe RENAME COLUMN institutional_role TO papel_institucional;
ALTER TABLE protocolo_membro_equipe RENAME COLUMN created_at TO criado_em;

-- protocolo_historico_status
ALTER TABLE protocolo_historico_status RENAME COLUMN protocol_id TO protocolo_id;
ALTER TABLE protocolo_historico_status RENAME COLUMN previous_status TO estado_anterior;
ALTER TABLE protocolo_historico_status RENAME COLUMN new_status TO novo_estado;
ALTER TABLE protocolo_historico_status RENAME COLUMN change_reason TO motivo_mudanca;
ALTER TABLE protocolo_historico_status RENAME COLUMN changed_by_user_id TO alterado_por_usuario_id;
ALTER TABLE protocolo_historico_status RENAME COLUMN changed_at TO alterado_em;

-- protocolo_documento
ALTER TABLE protocolo_documento RENAME COLUMN protocol_id TO protocolo_id;
ALTER TABLE protocolo_documento RENAME COLUMN document_kind TO tipo_documento;
ALTER TABLE protocolo_documento RENAME COLUMN storage_path TO caminho_armazenamento;
ALTER TABLE protocolo_documento RENAME COLUMN original_file_name TO nome_arquivo_original;
ALTER TABLE protocolo_documento RENAME COLUMN uploaded_by_user_id TO enviado_por_usuario_id;
ALTER TABLE protocolo_documento RENAME COLUMN uploaded_at TO enviado_em;

-- protocolo_estoque_biologico
ALTER TABLE protocolo_estoque_biologico RENAME COLUMN protocol_id TO protocolo_id;
ALTER TABLE protocolo_estoque_biologico RENAME COLUMN species_id TO especie_id;
ALTER TABLE protocolo_estoque_biologico RENAME COLUMN bioterium_id TO bioterio_id;
ALTER TABLE protocolo_estoque_biologico RENAME COLUMN strain_name TO nome_linhagem;
ALTER TABLE protocolo_estoque_biologico RENAME COLUMN planned_quantity TO quantidade_planejada;
ALTER TABLE protocolo_estoque_biologico RENAME COLUMN justification TO justificativa;
ALTER TABLE protocolo_estoque_biologico RENAME COLUMN created_at TO criado_em;

-- protocolo_designacao_parecer
ALTER TABLE protocolo_designacao_parecer RENAME COLUMN protocol_id TO protocolo_id;
ALTER TABLE protocolo_designacao_parecer RENAME COLUMN reviewer_user_id TO usuario_parecerista_id;
ALTER TABLE protocolo_designacao_parecer RENAME COLUMN assigned_by_user_id TO atribuido_por_usuario_id;
ALTER TABLE protocolo_designacao_parecer RENAME COLUMN assigned_at TO atribuido_em;
ALTER TABLE protocolo_designacao_parecer RENAME COLUMN due_at TO prazo_em;
ALTER TABLE protocolo_designacao_parecer RENAME COLUMN assignment_status TO estado_designacao;

-- protocolo_parecer
ALTER TABLE protocolo_parecer RENAME COLUMN assignment_id TO designacao_id;
ALTER TABLE protocolo_parecer RENAME COLUMN recommendation TO recomendacao;
ALTER TABLE protocolo_parecer RENAME COLUMN technical_summary TO resumo_tecnico;
ALTER TABLE protocolo_parecer RENAME COLUMN ethical_considerations TO consideracoes_eticas;
ALTER TABLE protocolo_parecer RENAME COLUMN submitted_at TO submetido_em;

-- reuniao_comite
ALTER TABLE reuniao_comite RENAME COLUMN meeting_code TO codigo_reuniao;
ALTER TABLE reuniao_comite RENAME COLUMN scheduled_for TO agendada_para;
ALTER TABLE reuniao_comite RENAME COLUMN location_description TO descricao_local;
ALTER TABLE reuniao_comite RENAME COLUMN status TO estado;
ALTER TABLE reuniao_comite RENAME COLUMN notes TO observacoes;
ALTER TABLE reuniao_comite RENAME COLUMN created_at TO criado_em;

-- reuniao_comite_protocolo
ALTER TABLE reuniao_comite_protocolo RENAME COLUMN meeting_id TO reuniao_id;
ALTER TABLE reuniao_comite_protocolo RENAME COLUMN protocol_id TO protocolo_id;
ALTER TABLE reuniao_comite_protocolo RENAME COLUMN agenda_order TO ordem_pauta;
ALTER TABLE reuniao_comite_protocolo RENAME COLUMN presenter_user_id TO usuario_relator_id;

-- protocolo_decisao
ALTER TABLE protocolo_decisao RENAME COLUMN protocol_id TO protocolo_id;
ALTER TABLE protocolo_decisao RENAME COLUMN meeting_id TO reuniao_id;
ALTER TABLE protocolo_decisao RENAME COLUMN decision_type TO tipo_decisao;
ALTER TABLE protocolo_decisao RENAME COLUMN rationale TO fundamentacao;
ALTER TABLE protocolo_decisao RENAME COLUMN decided_by_user_id TO decidido_por_usuario_id;
ALTER TABLE protocolo_decisao RENAME COLUMN decided_at TO decidido_em;
ALTER TABLE protocolo_decisao RENAME COLUMN valid_until TO valido_ate;
ALTER TABLE protocolo_decisao RENAME COLUMN created_at TO criado_em;
