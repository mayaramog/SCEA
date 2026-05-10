package br.edu.scea.shared.ports;

import java.time.LocalDate;

/**
 * Porta para validação de dias úteis e feriados.
 * Implementação concreta deve residir na camada de infraestrutura.
 */
public interface CalendarioAcademico {
    boolean isDiaUtil(LocalDate data);
}
