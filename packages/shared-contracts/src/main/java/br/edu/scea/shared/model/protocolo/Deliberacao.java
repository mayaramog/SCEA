package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.enums.EstadoProtocolo;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record Deliberacao(
    UUID id,
    UUID presidenteId,
    String justificativa,
    EstadoProtocolo decisaoFinal,
    Instant dataAuditoria
) {
    public Deliberacao(UUID presidenteId, String justificativa, EstadoProtocolo decisaoFinal, Instant dataAuditoria) {
        this(UUID.randomUUID(), presidenteId, justificativa, decisaoFinal, dataAuditoria);
    }
}
