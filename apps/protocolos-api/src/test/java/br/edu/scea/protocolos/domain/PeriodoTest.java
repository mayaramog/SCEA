package br.edu.scea.shared.model.protocolo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

class PeriodoTest {

    @Test
    @DisplayName("Deve falhar se a data de início for igual ou superior à de término")
    void deveFalharDataInicioInvalida() {
        LocalDate hoje = LocalDate.now();
        LocalDate amanha = hoje.plusDays(1);
        assertThrows(IllegalArgumentException.class, () -> new Periodo(amanha, hoje));
    }

    @Test
    @DisplayName("Deve criar período válido")
    void deveCriarPeriodoValido() {
        LocalDate amanha = LocalDate.now().plusDays(1);
        LocalDate depoisDeAmanha = amanha.plusDays(1);
        Periodo periodo = new Periodo(amanha, depoisDeAmanha);
        assertEquals(amanha, periodo.inicio());
        assertEquals(depoisDeAmanha, periodo.termino());
    }
}
