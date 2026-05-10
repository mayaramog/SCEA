package br.edu.scea.recursos.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface BioterioRepository extends JpaRepository<BioterioEntity, UUID> {}
