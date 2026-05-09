package br.edu.scea.shared.model.ator;

import br.edu.scea.shared.enums.Titulacao;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

class DocenteTest {

    @Test
    @DisplayName("Deve criar um docente válido")
    void deveCriarDocenteValido() {
        Matricula matricula = new Matricula("12345678");
        Funcionario funcionario = new Funcionario(matricula, "Dr. Roberto", LocalDate.of(1980, 1, 1), 'M');
        Docente docente = Docente.criar(funcionario, Titulacao.TITULAR);
        
        assertNotNull(docente.getId());
        assertEquals("12345678", docente.getMatricula().valor());
        assertEquals(Titulacao.TITULAR, docente.getTitulacao());
        assertEquals('M', docente.getFuncionario().getSexo());
    }

    @Test
    @DisplayName("Deve falhar com matrícula inválida")
    void deveFalharComMatriculaInvalida() {
        assertThrows(IllegalArgumentException.class, () -> new Matricula("123"));
    }
}
