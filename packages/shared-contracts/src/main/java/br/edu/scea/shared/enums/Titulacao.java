package br.edu.scea.shared.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Titulacao {
    DOUTOR("doutor"),
    ASSISTENTE("assistente"),
    LIVRE_DOCENTE("livre-docente"),
    TITULAR("titular");

    private final String descricao;

    Titulacao(String descricao) {
        this.descricao = descricao;
    }

    @JsonValue
    public String getDescricao() {
        return descricao;
    }

    @Override
    public String toString() {
        return descricao;
    }
}
