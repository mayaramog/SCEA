package br.edu.scea.shared.events.integration;

import java.time.Instant;
import java.util.UUID;

public record ReviewSubmittedV1(
    UUID eventId,
    Instant occurredAt,
    UUID protocolId,
    String codigoProtocolo,
    String tituloProtocolo,
    String pareceristaEmail,
    String recomendacao,
    String resumoTecnico,
    String consideracoesEticas
) {}
