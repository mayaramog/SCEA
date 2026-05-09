package br.edu.scea.protocolos.application;

import br.edu.scea.shared.model.protocolo.*;
import br.edu.scea.shared.ports.*;
import br.edu.scea.protocolos.contracts.SubmeterProtocoloRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubmeterProtocoloUseCase {
    private final ProtocoloRepository repository;
    private final CalendarioAcademico calendario;

    public SubmeterProtocoloUseCase(ProtocoloRepository repository, CalendarioAcademico calendario) {
        this.repository = repository;
        this.calendario = calendario;
    }

    @Transactional
    public ProtocoloId executar(SubmeterProtocoloRequest request) {
        Periodo periodo = Periodo.of(request.dataInicio(), request.dataTermino(), calendario);
        
        AlocacoesBiologicas alocacoes = new AlocacoesBiologicas(
            request.alocacoes().stream().map(a -> new AlocacaoBiologica(
                UUID.randomUUID(),
                new Especie(a.idEspecie(), "Especie " + a.idEspecie()), // Stub for name
                new Bioterio(a.idBioterio(), "Bioterio " + a.idBioterio()), // Stub for name
                new QuantidadeAnimais(a.quantidade())
            )).collect(Collectors.toList())
        );

        Protocolo protocolo = Protocolo.submeter(
            request.justificativa(),
            request.resumoPortugues(),
            request.resumoIngles(),
            periodo,
            alocacoes,
            request.idDocentePesquisador()
        );

        repository.salvar(protocolo);
        
        return protocolo.getId();
    }
}
