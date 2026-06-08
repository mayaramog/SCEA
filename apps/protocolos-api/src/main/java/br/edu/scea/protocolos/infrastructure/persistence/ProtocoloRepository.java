package br.edu.scea.protocolos.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.UUID;
import java.util.Optional;

public interface ProtocoloRepository extends JpaRepository<ProtocoloEntity, UUID> {
    
    @Query(value = "SELECT email FROM scea.usuario WHERE id = :id", nativeQuery = true)
    Optional<String> findEmailByUsuarioId(@Param("id") UUID id);
}
