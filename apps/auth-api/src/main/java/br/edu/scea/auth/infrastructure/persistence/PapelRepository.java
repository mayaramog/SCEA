package br.edu.scea.auth.infrastructure.persistence;

import br.edu.scea.auth.domain.model.Papel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PapelRepository extends JpaRepository<Papel, UUID> {
    Optional<Papel> findByCodigo(String codigo);
}
