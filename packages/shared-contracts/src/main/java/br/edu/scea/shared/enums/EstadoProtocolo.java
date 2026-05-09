package br.edu.scea.shared.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoProtocolo {
    AGUARDANDO_ENVIO_PARA_PARECER("aguardando envio para parecer"),
    AGUARDANDO_PARECER("aguardando parecer"),
    AGUARDANDO_DELIBERACAO("aguardando a deliberação"),
    USO_APROVADO("uso aprovado"),
    USO_REPROVADO("uso reprovado");

    private final String descricao;

    EstadoProtocolo(String descricao) {
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
