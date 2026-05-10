package br.edu.scea.comite.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ReuniaoComiteRepository extends JpaRepository<ReuniaoComiteEntity, UUID> {

    public ReuniaoComiteEntity acharPorID(UUID id);
}
