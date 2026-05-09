package br.edu.scea.shared.model.ator;

import br.edu.scea.shared.enums.PapelAtor;

import java.util.UUID;

public record Ator(UUID id, PapelAtor papel) {
    public Ator {
        if (id == null || papel == null) {
            throw new IllegalArgumentException("ID e papel do ator são obrigatórios.");
        }
    }
}
