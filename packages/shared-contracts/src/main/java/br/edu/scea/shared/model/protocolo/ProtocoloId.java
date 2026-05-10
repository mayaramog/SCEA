package br.edu.scea.shared.model.protocolo;

import java.util.UUID;

public record ProtocoloId(UUID value) {
    public ProtocoloId {
        if (value == null) {
            throw new IllegalArgumentException("ProtocoloId não pode ser nulo.");
        }
    }

    public static ProtocoloId generate() {
        return new ProtocoloId(UUID.randomUUID());
    }
}
