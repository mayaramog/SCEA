package br.edu.scea.shared.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public record CadastroUsuarioRequest(
    @NotBlank @Email String email,
    @NotBlank String senha,
    @NotBlank String nomeCompleto,
    Set<String> codigosPapeis
) {}
