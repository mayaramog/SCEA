package br.edu.scea.protocolos.application;

import br.edu.scea.shared.model.ator.Ator;
import br.edu.scea.shared.model.protocolo.Protocolo;
import br.edu.scea.shared.model.protocolo.ProtocoloId;
import br.edu.scea.shared.ports.ProtocoloRepository;
import br.edu.scea.protocolos.contracts.DeliberarRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class DeliberarUseCase {
    private final ProtocoloRepository repository;

    public DeliberarUseCase(ProtocoloRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void executar(UUID protocoloId, DeliberarRequest request, Ator presidente) {
        Protocolo protocolo = repository.buscarPorId(new ProtocoloId(protocoloId))
            .orElseThrow(() -> new IllegalArgumentException("Protocolo não encontrado."));
        
        protocolo.deliberar(presidente, request.justificativa(), request.decisaoFinal());
        
        repository.salvar(protocolo);
    }
}
