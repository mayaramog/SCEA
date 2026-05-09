package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.enums.EstadoProtocolo;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record Deliberacao(
    UUID id,
    UUID protocolId,
    UUID presidenteId,
    String justificativa,
    EstadoProtocolo decisaoFinal,
    Instant dataAuditoria
) {
    public Deliberacao {
        Objects.requireNonNull(id);
        Objects.requireNonNull(protocolId);
        Objects.requireNonNull(presidenteId);
        if (justificativa == null || justificativa.isBlank()) {
            throw new IllegalArgumentException("Justificativa do plenário é obrigatória.");
        }
        if (decisaoFinal != EstadoProtocolo.USO_APROVADO && decisaoFinal != EstadoProtocolo.USO_REPROVADO) {
            throw new IllegalArgumentException("Decisão final deve ser USO_APROVADO ou USO_REPROVADO.");
        }
    }
}
