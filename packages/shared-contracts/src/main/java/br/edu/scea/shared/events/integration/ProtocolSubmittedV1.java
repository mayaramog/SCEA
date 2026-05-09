package br.edu.scea.shared.events.integration;

import java.time.Instant;
import java.util.UUID;

public record ProtocolSubmittedV1(
    UUID eventId,
    Instant occurredAt,
    String schemaVersion,
    String correlationId,
    String producer,
    UUID protocolId,
    String researcherName
) {}
