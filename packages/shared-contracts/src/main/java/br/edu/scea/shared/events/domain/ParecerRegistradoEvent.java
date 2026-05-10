package br.edu.scea.shared.events.domain;

import br.edu.scea.shared.enums.DecisaoParecer;
import br.edu.scea.shared.events.domain.DomainEvent;
import java.time.Instant;
import java.util.UUID;

public record ParecerRegistradoEvent(
    UUID protocolId,
    UUID pareceristaId,
    DecisaoParecer decisao,
    Instant occurredAt
) implements DomainEvent {}
