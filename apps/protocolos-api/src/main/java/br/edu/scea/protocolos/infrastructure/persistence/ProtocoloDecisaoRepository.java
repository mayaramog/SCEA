package br.edu.scea.protocolos.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProtocoloDecisaoRepository extends JpaRepository<ProtocoloDecisaoEntity, UUID> {
}
