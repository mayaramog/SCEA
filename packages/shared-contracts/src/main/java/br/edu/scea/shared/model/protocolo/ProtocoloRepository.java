package br.edu.scea.shared.ports;

import br.edu.scea.shared.model.protocolo.Protocolo;
import br.edu.scea.shared.model.protocolo.ProtocoloId;
import java.util.Optional;

public interface ProtocoloRepository {
    void salvar(Protocolo protocolo);
    Optional<Protocolo> buscarPorId(ProtocoloId id);
}
