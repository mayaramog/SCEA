package br.edu.scea.protocolos.contracts;

import br.edu.scea.shared.enums.EstadoProtocolo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record DeliberarRequest(
    @NotBlank String justificativa,
    @NotNull EstadoProtocolo decisaoFinal
) {}
