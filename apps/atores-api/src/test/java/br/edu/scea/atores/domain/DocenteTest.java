package br.edu.scea.shared.model.ator;

import br.edu.scea.shared.enums.Titulacao;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class DocenteTest {

    @Test
    @DisplayName("Deve criar um docente válido")
    void deveCriarDocenteValido() {
        UUID id = UUID.randomUUID();
        Matricula matricula = new Matricula("12345");
        Funcionario funcionario = new Funcionario(matricula, "Dr. Silva", LocalDate.now().minusYears(30), 'M');
        Docente docente = new Docente(id, funcionario, Titulacao.DOUTOR);
        
        assertNotNull(docente.getId());
        assertEquals("Dr. Silva", docente.getNome());
        assertEquals(Titulacao.DOUTOR, docente.getTitulacao());
    }

    @Test
    @DisplayName("Deve falhar se a matrícula for inválida")
    void deveFalharMatriculaInvalida() {
        assertThrows(IllegalArgumentException.class, () -> new Matricula(""));
    }
}
