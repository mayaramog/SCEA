package br.edu.scea.shared.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum DecisaoParecer {
    USO_RECOMENDADO("uso recomendado"),
    USO_NAO_RECOMENDADO("uso não recomendado");

    private final String descricao;

    DecisaoParecer(String descricao) {
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
