package br.edu.scea.shared.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum PapelAtor {
    DOCENTE("docente"),
    SECRETARIA("secretaria"),
    PARECERISTA("parecerista"),
    PRESIDENTE("presidente"),
    MEMBRO_CEUA("membro_ceua"),
    ADMINISTRADOR("administrador");

    private final String codigo;

    PapelAtor(String codigo) {
        this.codigo = codigo;
    }

    @JsonValue
    public String getCodigo() {
        return codigo;
    }
}
