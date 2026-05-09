package br.edu.scea.protocolos.application;

import br.edu.scea.shared.model.ator.Ator;
import br.edu.scea.shared.model.protocolo.Protocolo;
import br.edu.scea.shared.model.protocolo.ProtocoloId;
import br.edu.scea.shared.ports.ProtocoloRepository;
import br.edu.scea.protocolos.contracts.RegistrarParecerRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class RegistrarParecerUseCase {
    private final ProtocoloRepository repository;

    public RegistrarParecerUseCase(ProtocoloRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void executar(UUID protocoloId, RegistrarParecerRequest request, Ator parecerista) {
        Protocolo protocolo = repository.buscarPorId(new ProtocoloId(protocoloId))
            .orElseThrow(() -> new IllegalArgumentException("Protocolo não encontrado."));
        
        protocolo.registrarParecer(parecerista, request.texto(), request.decisao());
        
        repository.salvar(protocolo);
    }
}
