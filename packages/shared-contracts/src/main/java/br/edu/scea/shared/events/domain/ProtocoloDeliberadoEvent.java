package br.edu.scea.shared.events.domain;

import br.edu.scea.shared.enums.EstadoProtocolo;
import br.edu.scea.shared.events.domain.DomainEvent;
import java.time.Instant;
import java.util.UUID;

public record ProtocoloDeliberadoEvent(
    UUID protocolId,
    UUID presidenteId,
    EstadoProtocolo decisaoFinal,
    Instant occurredAt
) implements DomainEvent {}
