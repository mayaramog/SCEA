package br.edu.scea.protocolos.contracts;

import br.edu.scea.shared.enums.DecisaoParecer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record RegistrarParecerRequest(
    @NotBlank String texto,
    @NotNull DecisaoParecer decisao
) {}
