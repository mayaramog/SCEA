package br.edu.scea.shared.model.ator;

import java.util.Objects;

public record Matricula(String valor) {
    public Matricula {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Matrícula é obrigatória.");
        }
        // Exemplo de regra: Matrícula deve ter 8 dígitos
        if (!valor.matches("\\d{8}")) {
            throw new IllegalArgumentException("Matrícula deve conter exatamente 8 dígitos.");
        }
    }
}
