package br.edu.scea.shared.dto.protocolo;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.UUID;

public record DesignarPareceristaRequest(
    @NotNull UUID usuarioPareceristaId,
    @NotNull OffsetDateTime prazoEm
) {}
