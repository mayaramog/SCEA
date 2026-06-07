package br.edu.scea.shared.events.integration;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReviewerAssignedV1(
    UUID eventId,
    Instant occurredAt,
    UUID protocolId,
    String codigoProtocolo,
    String tituloProtocolo,
    String pareceristaEmail,
    LocalDateTime prazo
) {}
