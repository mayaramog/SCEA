package br.edu.scea.shared.dto.protocolo;

import br.edu.scea.shared.enums.DecisaoParecer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegistrarParecerRequest(
    @NotNull DecisaoParecer recomendacao,
    @NotBlank String resumoTecnico,
    @NotBlank String consideracoesEticas
) {}
