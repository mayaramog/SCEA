package br.edu.scea.protocolos.application;

import br.edu.scea.shared.model.ator.Ator;
import br.edu.scea.shared.model.protocolo.Protocolo;
import br.edu.scea.shared.model.protocolo.ProtocoloId;
import br.edu.scea.shared.ports.ProtocoloRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class EnviarParaParecerUseCase {
    private final ProtocoloRepository repository;

    public EnviarParaParecerUseCase(ProtocoloRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void executar(UUID protocoloId, Ator secretaria) {
        Protocolo protocolo = repository.buscarPorId(new ProtocoloId(protocoloId))
            .orElseThrow(() -> new IllegalArgumentException("Protocolo não encontrado."));
        
        protocolo.enviarParaParecer(secretaria);
        
        repository.salvar(protocolo);
    }
}
