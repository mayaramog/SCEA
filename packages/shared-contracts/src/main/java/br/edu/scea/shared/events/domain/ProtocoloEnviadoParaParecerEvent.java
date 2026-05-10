package br.edu.scea.shared.events.domain;

import br.edu.scea.shared.events.domain.DomainEvent;
import java.time.Instant;
import java.util.UUID;

public record ProtocoloEnviadoParaParecerEvent(
    UUID protocolId,
    UUID secretariaId,
    Instant occurredAt
) implements DomainEvent {}
