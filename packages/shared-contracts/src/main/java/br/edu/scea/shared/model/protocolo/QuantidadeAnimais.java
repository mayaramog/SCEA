package br.edu.scea.shared.model.protocolo;

public record QuantidadeAnimais(int valor) {
    public QuantidadeAnimais {
        if (valor <= 0) {
            throw new IllegalArgumentException("Quantidade de animais deve ser maior que zero.");
        }
    }
}
