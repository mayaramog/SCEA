SET search_path TO scea;

-- 1. Inserir usuário Admin de teste se não existir
-- Senha: 1234 (Hash BCrypt)
INSERT INTO usuario (id, email, password_hash, nome_completo, esta_ativo, criado_em, atualizado_em)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000', 
    'admin@scea.local', 
    '$2a$10$V7ftpFeQ9G6o6yOk5dpdf.YAgzq8Ttr/CA2EmM1nP4ohm8/kFVCQK', 
    'Administrador Central', 
    true, 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Associar o papel de administrador
INSERT INTO usuario_papel (usuario_id, papel_id, atribuido_por_usuario_id, atribuido_em)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000', 
    '4cd0b870-0b66-4e00-a110-6243f212e98d', 
    '550e8400-e29b-41d4-a716-446655440000', 
    NOW()
) ON CONFLICT DO NOTHING;
