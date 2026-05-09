CREATE SCHEMA IF NOT EXISTS atores;

SET search_path TO atores;

CREATE TABLE funcionario (
    matricula VARCHAR PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nascimento DATE NOT NULL,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F', 'O')),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE docente (
    id_docente UUID PRIMARY KEY,
    matricula_funcionario VARCHAR UNIQUE REFERENCES funcionario(matricula),
    titulacao VARCHAR CHECK (titulacao IN ('doutor', 'assistente', 'livre-docente', 'titular')),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_docente_matricula ON docente(matricula_funcionario);
