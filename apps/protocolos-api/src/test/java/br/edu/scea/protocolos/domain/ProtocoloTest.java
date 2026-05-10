package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.enums.DecisaoParecer;
import br.edu.scea.shared.enums.EstadoProtocolo;
import br.edu.scea.shared.enums.PapelAtor;
import br.edu.scea.shared.model.ator.Ator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class ProtocoloTest {

    private Ator criarAtor(PapelAtor papel) {
        return new Ator(UUID.randomUUID(), papel);
    }

    @Test
    @DisplayName("Deve realizar ciclo de vida completo do protocolo")
    void deveRealizarCicloVidaCompleto() {
        // Arrange
        Periodo periodo = new Periodo(LocalDate.now().plusDays(1), LocalDate.now().plusDays(10));
        Especie especie = new Especie(1, "Rato");
        Bioterio bioterio = new Bioterio(1, "Biotério Central");
        AlocacaoBiologica aloc = new AlocacaoBiologica(UUID.randomUUID(), especie, bioterio, new QuantidadeAnimais(10));
        AlocacoesBiologicas alocacoes = new AlocacoesBiologicas(List.of(aloc));
        UUID docenteId = UUID.randomUUID();

        // 1. Submissão
        Protocolo protocolo = Protocolo.submeter("Teste", "Resumo PT", "Resumo EN", periodo, alocacoes, docenteId);
        assertEquals(EstadoProtocolo.RASCUNHO, protocolo.getEstado());

        // 2. Envio para Parecer (pela Secretaria)
        protocolo.enviarParaParecer(criarAtor(PapelAtor.SECRETARIA));
        assertEquals(EstadoProtocolo.EM_ANALISE_CEUA, protocolo.getEstado());

        // 3. Registro de Parecer (pelo Parecerista)
        protocolo.registrarParecer(criarAtor(PapelAtor.PARECERISTA), "Parecer favorável", DecisaoParecer.USO_RECOMENDADO);
        assertNotNull(protocolo.getParecer());

        // 4. Deliberação (pelo Presidente)
        protocolo.deliberar(criarAtor(PapelAtor.PRESIDENTE), "Aprovado em plenário", EstadoProtocolo.APROVADO);
        assertEquals(EstadoProtocolo.APROVADO, protocolo.getEstado());
        assertNotNull(protocolo.getDeliberacao());

        assertFalse(protocolo.getEvents().isEmpty());
    }
}
