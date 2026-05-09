package br.edu.scea.protocolos.contracts;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SubmeterProtocoloRequest(
    @NotBlank String justificativa,
    @NotBlank String resumoPortugues,
    @NotBlank String resumoIngles,
    @NotNull LocalDate dataInicio,
    @NotNull LocalDate dataTermino,
    @NotNull UUID idDocentePesquisador,
    @NotEmpty List<AlocacaoRequest> alocacoes
) {
    public record AlocacaoRequest(
        @NotNull Integer idEspecie,
        @NotNull Integer idBioterio,
        @NotNull Integer quantidade
    ) {}
}
