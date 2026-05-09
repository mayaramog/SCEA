package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.enums.DecisaoParecer;
import java.util.Objects;
import java.util.UUID;

public record Parecer(
    UUID id,
    UUID protocolId,
    UUID pareceristaId,
    String texto,
    DecisaoParecer decisao
) {
    public Parecer {
        Objects.requireNonNull(id);
        Objects.requireNonNull(protocolId);
        Objects.requireNonNull(pareceristaId);
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Texto do parecer é obrigatório.");
        }
        Objects.requireNonNull(decisao);
    }
}
