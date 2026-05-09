package br.edu.scea.shared.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum DecisaoParecer {
    USO_RECOMENDADO("uso_recomendado"),
    USO_NAO_RECOMENDADO("uso_nao_recomendado");

    private final String codigo;

    DecisaoParecer(String codigo) {
        this.codigo = codigo;
    }

    @JsonValue
    public String getCodigo() {
        return codigo;
    }

    @Override
    public String toString() {
        return codigo;
    }
}
