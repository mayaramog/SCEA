package br.edu.scea.atores.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface DocenteSpringDataRepository extends JpaRepository<DocenteJpaEntity, UUID> {
    Optional<DocenteJpaEntity> findByFuncionarioMatricula(String matricula);
}
