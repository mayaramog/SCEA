package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.enums.DecisaoParecer;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record Parecer(
    UUID id,
    UUID pareceristaId,
    String texto,
    DecisaoParecer decisao,
    Instant dataRegistro
) {
    public Parecer(UUID pareceristaId, String texto, DecisaoParecer decisao, Instant dataRegistro) {
        this(UUID.randomUUID(), pareceristaId, texto, decisao, dataRegistro);
    }
}
