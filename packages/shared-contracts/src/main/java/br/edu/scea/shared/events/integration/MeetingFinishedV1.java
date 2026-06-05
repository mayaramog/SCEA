package br.edu.scea.shared.events.integration;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record MeetingFinishedV1(
    UUID eventId,
    Instant occurredAt,
    UUID reuniaoId,
    String codigoReuniao,
    String dataReuniao,
    String local,
    List<MeetingDecisionDTO> decisoes
) {
    public record MeetingDecisionDTO(
        UUID protocoloId,
        String titulo,
        String docente,
        String decisao,
        String fundamentacao
    ) {}
}
