package br.edu.scea.shared.dto.protocolo;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public record DesignarPareceristaRequest(
    @NotNull UUID usuarioPareceristaId,
    @NotNull LocalDateTime prazoEm
) {}
