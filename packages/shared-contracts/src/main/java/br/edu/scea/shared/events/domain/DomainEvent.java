package br.edu.scea.shared.events.domain;

import java.time.Instant;

public interface DomainEvent {
    Instant occurredAt();
}
