package br.edu.scea.shared.model.protocolo;

import java.util.UUID;

public record AlocacaoBiologica(
    UUID id,
    Especie especie,
    Bioterio bioterio,
    QuantidadeAnimais quantidade
) {
    public AlocacaoBiologica {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (especie == null) {
            throw new IllegalArgumentException("Espécie é obrigatória.");
        }
        if (bioterio == null) {
            throw new IllegalArgumentException("Biotério é obrigatório.");
        }
        if (quantidade == null) {
            throw new IllegalArgumentException("Quantidade de animais é obrigatória.");
        }
    }
}
