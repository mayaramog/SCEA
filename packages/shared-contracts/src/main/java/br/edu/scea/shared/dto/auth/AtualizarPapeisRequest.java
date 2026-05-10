package br.edu.scea.shared.dto.auth;

import java.util.Set;
import jakarta.validation.constraints.NotEmpty;

public record AtualizarPapeisRequest(
    @NotEmpty Set<String> codigosPapeis
) {}
