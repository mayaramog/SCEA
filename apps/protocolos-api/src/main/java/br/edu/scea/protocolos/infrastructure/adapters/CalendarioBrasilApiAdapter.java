package br.edu.scea.protocolos.infrastructure.adapters;

import br.edu.scea.shared.ports.CalendarioAcademico;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

@Component
@Primary
public class CalendarioBrasilApiAdapter implements CalendarioAcademico {
    private final BrasilApiClient brasilApiClient;

    public CalendarioBrasilApiAdapter(BrasilApiClient brasilApiClient) {
        this.brasilApiClient = brasilApiClient;
    }

    @Override
    public boolean isDiaUtil(LocalDate data) {
        if (isFinalDeSemana(data)) {
            return false;
        }

        Set<LocalDate> feriados = brasilApiClient.buscarFeriadosPorAno(data.getYear());
        return !feriados.contains(data);
    }

    private boolean isFinalDeSemana(LocalDate data) {
        DayOfWeek dow = data.getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }
}
