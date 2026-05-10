package br.edu.scea.shared.model.protocolo;

import java.util.Objects;

public record Especie(Integer id, String nomenclatura) {
    public Especie {
        if (nomenclatura == null || nomenclatura.isBlank()) {
            throw new IllegalArgumentException("Nomenclatura da espécie é obrigatória.");
        }
    }
}
