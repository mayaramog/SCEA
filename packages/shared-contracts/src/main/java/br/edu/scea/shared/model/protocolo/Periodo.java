package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.ports.CalendarioAcademico;
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

    /**
     * Factory method que valida se as datas são dias úteis conforme as regras de negócio.
     */
    public static Periodo of(LocalDate inicio, LocalDate termino, CalendarioAcademico calendario) {
        if (!calendario.isDiaUtil(inicio)) {
            throw new IllegalArgumentException("Data de início não pode cair em final de semana ou feriado.");
        }
        if (!calendario.isDiaUtil(termino)) {
            throw new IllegalArgumentException("Data de término não pode cair em final de semana ou feriado.");
        }
        return new Periodo(inicio, termino);
    }
}
