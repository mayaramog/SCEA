package br.edu.scea.shared.dto.protocolo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SubmissaoProtocoloRequest(
    @NotBlank String titulo,
    @NotBlank String objetivo,
    @NotBlank String justificativa,
    @NotBlank String resumoPortugues,
    @NotBlank String resumoIngles,
    @NotNull LocalDate dataInicioPlanejada,
    @NotNull LocalDate dataTerminoPlanejada,
    @NotEmpty List<AlocacaoBiologicaDTO> alocacoes
) {
    public record AlocacaoBiologicaDTO(
        @NotNull UUID especieId,
        @NotNull UUID bioterioId,
        @NotBlank String nomeLinhagem,
        @NotNull Integer quantidadePlanejada,
        @NotBlank String justificativa,
        @NotBlank String sexo
    ) {}
}
