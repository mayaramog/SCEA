package br.edu.scea.shared.events.integration;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProtocolSubmittedV1(
    UUID eventId,
    Instant occurredAt,
    UUID protocolId,
    String codigoProtocolo,
    String titulo,
    String pesquisadorEmail,
    String objetivo,
    String resumo,
    LocalDate dataInicio,
    LocalDate dataTermino,
    String justificativa
) {}
