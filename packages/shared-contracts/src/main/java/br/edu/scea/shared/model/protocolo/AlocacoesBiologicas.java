package br.edu.scea.shared.model.protocolo;

import java.util.Collections;
import java.util.List;

public record AlocacoesBiologicas(List<AlocacaoBiologica> itens) {
    public AlocacoesBiologicas {
        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("Pelo menos uma alocação biológica é obrigatória.");
        }
        itens = List.copyOf(itens); // Imutabilidade
    }

    public List<AlocacaoBiologica> getItens() {
        return Collections.unmodifiableList(itens);
    }
}
