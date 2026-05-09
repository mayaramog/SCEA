package br.edu.scea.shared.events.integration;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ProtocolApprovedV1(
    UUID eventId,
    UUID protocolId,
    String justificativa,
    LocalDate dataInicio,
    LocalDate dataTermino,
    Instant occurredAt
) {}
