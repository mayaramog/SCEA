package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.enums.EstadoProtocolo;
import br.edu.scea.shared.model.ator.Ator;
import br.edu.scea.shared.enums.PapelAtor;
import br.edu.scea.shared.enums.DecisaoParecer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class ProtocoloTest {

    private Protocolo criarProtocolo() {
        Periodo periodo = new Periodo(LocalDate.now(), LocalDate.now().plusDays(30));
        Especie especie = new Especie(1, "Camundongo");
        Bioterio bioterio = new Bioterio(1, "Medicina");
        
        AlocacoesBiologicas alocacoes = new AlocacoesBiologicas(List.of(
            new AlocacaoBiologica(UUID.randomUUID(), especie, bioterio, new QuantidadeAnimais(10))
        ));

        return Protocolo.submeter(
            "Justificativa de teste",
            "Resumo em PT",
            "Summary in EN",
            periodo,
            alocacoes,
            UUID.randomUUID()
        );
    }

    @Test
    @DisplayName("Deve realizar o fluxo completo de aprovação com sucesso")
    void deveAprovarProtocolo() {
        Protocolo protocolo = criarProtocolo();
        Ator secretaria = new Ator(UUID.randomUUID(), PapelAtor.SECRETARIA);
        Ator parecerista = new Ator(UUID.randomUUID(), PapelAtor.PARECERISTA);
        Ator presidente = new Ator(UUID.randomUUID(), PapelAtor.PRESIDENTE_VICE);

        // 1. Enviar para parecer
        protocolo.enviarParaParecer(secretaria);
        assertEquals(EstadoProtocolo.AGUARDANDO_PARECER, protocolo.getEstado());

        // 2. Registrar parecer
        protocolo.registrarParecer(parecerista, "Texto do parecer", DecisaoParecer.USO_RECOMENDADO);
        assertEquals(EstadoProtocolo.AGUARDANDO_DELIBERACAO, protocolo.getEstado());
        assertNotNull(protocolo.getParecer());

        // 3. Deliberar (Aprovar)
        protocolo.deliberar(presidente, "Justificativa plenario", EstadoProtocolo.USO_APROVADO);
        assertEquals(EstadoProtocolo.USO_APROVADO, protocolo.getEstado());
        assertNotNull(protocolo.getDeliberacao());

        assertEquals(4, protocolo.getEvents().size());
    }

    @Test
    @DisplayName("Deve falhar se justificativa for em branco")
    void deveFalharSeJustificativaEmBranco() {
        Periodo periodo = new Periodo(LocalDate.now(), LocalDate.now().plusDays(30));
        AlocacoesBiologicas alocacoes = new AlocacoesBiologicas(List.of(
            new AlocacaoBiologica(UUID.randomUUID(), new Especie(1, "Rato"), new Bioterio(1, "Farmacia"), new QuantidadeAnimais(10))
        ));

        assertThrows(IllegalArgumentException.class, () -> Protocolo.submeter(
            "  ",
            "Resumo em PT",
            "Summary in EN",
            periodo,
            alocacoes,
            UUID.randomUUID()
        ));
    }
}
