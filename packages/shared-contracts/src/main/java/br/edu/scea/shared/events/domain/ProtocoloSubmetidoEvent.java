package br.edu.scea.shared.events.domain;

import br.edu.scea.shared.events.domain.DomainEvent;
import java.time.Instant;
import java.util.UUID;

public record ProtocoloSubmetidoEvent(
    UUID protocolId,
    Instant occurredAt
) implements DomainEvent {}
