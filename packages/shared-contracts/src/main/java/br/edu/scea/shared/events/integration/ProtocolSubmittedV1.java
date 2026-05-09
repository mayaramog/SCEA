package br.edu.scea.shared.events.integration;

import java.time.Instant;
import java.util.UUID;

public record ProtocolSubmittedV1(
    UUID eventId,
    UUID protocolId,
    String researcherName,
    Instant occurredAt,
    String schemaVersion,
    String correlationId
) {}
