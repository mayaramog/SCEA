package br.edu.scea.recursos.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface EspecieRepository extends JpaRepository<EspecieEntity, UUID> {}
