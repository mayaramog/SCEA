package br.edu.scea.protocolos.infrastructure.adapters;

import br.edu.scea.shared.ports.CalendarioAcademico;
import org.springframework.stereotype.Component;
import java.time.DayOfWeek;
import java.time.LocalDate;

public class CalendarioSimplesAdapter implements CalendarioAcademico {
    @Override
    public boolean isDiaUtil(LocalDate data) {
        DayOfWeek dow = data.getDayOfWeek();
        return dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY;
    }
}
