package br.edu.scea.shared.model.protocolo;

import java.util.Objects;

public record Bioterio(Integer id, String nome) {
    public Bioterio {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do biotério é obrigatório.");
        }
    }
}
