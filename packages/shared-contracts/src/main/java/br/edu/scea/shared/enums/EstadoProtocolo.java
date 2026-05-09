package br.edu.scea.shared.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoProtocolo {
    RASCUNHO("rascunho"),
    SUBMETIDO("submetido"),
    EM_ANALISE_SECRETARIA("em_analise_secretaria"),
    EM_ANALISE_CEUA("em_analise_ceua"),
    PENDENCIA_SOLICITADA("pendencia_solicitada"),
    APROVADO("aprovado"),
    REPROVADO("reprovado"),
    SUSPENSO("suspenso"),
    ARQUIVADO("arquivado");

    private final String codigo;

    EstadoProtocolo(String codigo) {
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
