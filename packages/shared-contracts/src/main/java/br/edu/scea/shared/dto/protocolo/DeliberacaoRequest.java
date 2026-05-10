package br.edu.scea.shared.dto.protocolo;

import br.edu.scea.shared.enums.EstadoProtocolo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.UUID;

public record DeliberacaoRequest(
    @NotNull UUID reuniaoId,
    @NotNull EstadoProtocolo novoEstado,
    @NotBlank String fundamentacao,
    Integer quantidadeAnimaisAprovada,
    OffsetDateTime validoAte
) {}
