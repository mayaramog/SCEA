CREATE SCHEMA IF NOT EXISTS protocolos;

SET search_path TO protocolos;

CREATE TABLE bioterio (
    id_bioterio SERIAL PRIMARY KEY,
    nome_bioterio VARCHAR NOT NULL
);

CREATE TABLE especie (
    id_especie SERIAL PRIMARY KEY,
    nomenclatura VARCHAR NOT NULL
);

CREATE TABLE protocolo (
    id_protocolo UUID PRIMARY KEY,
    justificativa TEXT NOT NULL,
    resumo_pt TEXT NOT NULL,
    resumo_en TEXT NOT NULL,
    data_inicio DATE NOT NULL,
    data_termino DATE NOT NULL,
    estado_atual VARCHAR CHECK (estado_atual IN ('aguardando envio para parecer', 'aguardando parecer', 'aguardando a deliberação', 'uso aprovado', 'uso reprovado')),
    id_docente_pesquisador UUID NOT NULL, -- Soft FK to atores.docente
    versao BIGINT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE protocolo_especie_bioterio (
    id_alocacao UUID PRIMARY KEY,
    id_protocolo UUID REFERENCES protocolo(id_protocolo) ON DELETE CASCADE,
    id_especie INTEGER REFERENCES especie(id_especie),
    id_bioterio INTEGER REFERENCES bioterio(id_bioterio),
    quantidade_animais INTEGER CHECK (quantidade_animais > 0)
);

CREATE TABLE parecer (
    id_parecer UUID PRIMARY KEY,
    id_protocolo UUID UNIQUE REFERENCES protocolo(id_protocolo) ON DELETE CASCADE,
    id_docente_parecerista UUID NOT NULL, -- Soft FK
    texto_parecer TEXT NOT NULL,
    decisao_recomendada VARCHAR CHECK (decisao_recomendada IN ('uso recomendado', 'uso não recomendado')),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deliberacao (
    id_deliberacao UUID PRIMARY KEY,
    id_protocolo UUID UNIQUE REFERENCES protocolo(id_protocolo) ON DELETE CASCADE,
    id_docente_presidente UUID NOT NULL, -- Soft FK
    justificativa_plenario TEXT NOT NULL,
    decisao_final VARCHAR CHECK (decisao_final IN ('uso aprovado', 'uso reprovado')),
    data_auditoria TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_protocolo_estado ON protocolo(estado_atual);
