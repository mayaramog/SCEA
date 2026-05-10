package br.edu.scea.relatorios.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RelatorioRepository extends JpaRepository<RelatorioEntity, UUID> {
}
