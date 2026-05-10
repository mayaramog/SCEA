SET search_path TO scea;

-- 1. Criar a nova função traduzida
CREATE OR REPLACE FUNCTION atualizar_timestamp_atualizacao() 
RETURNS trigger AS $$ 
BEGIN 
    NEW.atualizado_em = NOW(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

-- 2. Recriar triggers para as tabelas principais
-- Usuário
DROP TRIGGER IF EXISTS set_updated_at ON usuario;
CREATE TRIGGER trigger_atualizar_usuario_timestamp
    BEFORE UPDATE ON usuario
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp_atualizacao();

-- Protocolo
DROP TRIGGER IF EXISTS set_updated_at ON protocolo;
CREATE TRIGGER trigger_atualizar_protocolo_timestamp
    BEFORE UPDATE ON protocolo
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp_atualizacao();

-- 3. Agora podemos rodar os Updates que falharam
UPDATE papel SET codigo = 'docente' WHERE codigo = 'docente';
UPDATE papel SET codigo = 'secretaria' WHERE codigo = 'secretaria';
UPDATE papel SET codigo = 'presidente' WHERE codigo = 'presidente';
UPDATE papel SET codigo = 'administrador' WHERE codigo = 'administrador';
UPDATE papel SET codigo = 'membro_ceua' WHERE codigo = 'membro_ceua';

UPDATE protocolo SET estado = 'rascunho' WHERE estado = 'draft';
UPDATE protocolo SET estado = 'em_analise_ceua' WHERE estado = 'under_ceua_review';
UPDATE protocolo SET estado = 'aprovado' WHERE estado = 'approved';
