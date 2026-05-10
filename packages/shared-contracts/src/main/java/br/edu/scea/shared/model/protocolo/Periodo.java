package br.edu.scea.shared.model.protocolo;

import java.time.LocalDate;

public record Periodo(LocalDate inicio, LocalDate termino) {
    public Periodo {
        if (inicio == null || termino == null) {
            throw new IllegalArgumentException("Datas de início e término são obrigatórias.");
        }
        if (!inicio.isBefore(termino)) {
            throw new IllegalArgumentException("Data de início deve ser estritamente anterior à data de término.");
        }
    }
}
