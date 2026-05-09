package br.edu.scea.shared.dto.auth;

import java.util.Set;
import java.util.UUID;

public record UsuarioResponse(
    UUID id,
    String email,
    String nomeCompleto,
    Set<String> papeis
) {}
