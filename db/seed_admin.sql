SET search_path TO scea;

-- 1. Inserir usuário Admin de teste se não existir
-- Senha: admin123 (Hash BCrypt)
INSERT INTO usuario (id, email, password_hash, nome_completo, esta_ativo, criado_em, atualizado_em)
VALUES (
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 
    'admin@scea.edu.br', 
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 
    'Administrador do Sistema', 
    true, 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Associar o papel de administrador (ID fixo que vimos no banco)
INSERT INTO usuario_papel (usuario_id, papel_id, atribuido_por_usuario_id, atribuido_em)
VALUES (
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 
    '4cd0b870-0b66-4e00-a110-6243f212e98d', 
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 
    NOW()
) ON CONFLICT DO NOTHING;
