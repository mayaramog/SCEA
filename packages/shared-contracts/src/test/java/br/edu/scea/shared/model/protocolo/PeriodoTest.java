package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.ports.CalendarioAcademico;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

class PeriodoTest {

    @Test
    @DisplayName("Deve falhar se a data de início for igual à data de término")
    void deveFalharSeDatasIguais() {
        LocalDate hoje = LocalDate.now();
        assertThrows(IllegalArgumentException.class, () -> new Periodo(hoje, hoje));
    }

    @Test
    @DisplayName("Deve falhar se a data de início for posterior à data de término")
    void deveFalharSeInicioPosterior() {
        LocalDate hoje = LocalDate.now();
        LocalDate amanha = hoje.plusDays(1);
        assertThrows(IllegalArgumentException.class, () -> new Periodo(amanha, hoje));
    }

    @Test
    @DisplayName("Deve criar período válido")
    void deveCriarPeriodoValido() {
        LocalDate hoje = LocalDate.now();
        LocalDate amanha = hoje.plusDays(1);
        Periodo periodo = new Periodo(hoje, amanha);
        assertEquals(hoje, periodo.inicio());
        assertEquals(amanha, periodo.termino());
    }

    @Test
    @DisplayName("Deve validar dias úteis via factory method")
    void deveValidarDiasUteis() {
        LocalDate segunda = LocalDate.of(2026, 5, 11); // Segunda-feira
        LocalDate terca = LocalDate.of(2026, 5, 12);
        
        CalendarioAcademico calendario = data -> true; // Mock simples: tudo é dia útil
        
        assertDoesNotThrow(() -> Periodo.of(segunda, terca, calendario));
    }

    @Test
    @DisplayName("Deve falhar se data de início não for dia útil")
    void deveFalharSeInicioNaoForDiaUtil() {
        LocalDate domingo = LocalDate.of(2026, 5, 10);
        LocalDate segunda = LocalDate.of(2026, 5, 11);
        
        CalendarioAcademico calendario = data -> !data.equals(domingo);
        
        Exception ex = assertThrows(IllegalArgumentException.class, 
            () -> Periodo.of(domingo, segunda, calendario));
        assertTrue(ex.getMessage().contains("Data de início não pode cair em final de semana ou feriado"));
    }
}
