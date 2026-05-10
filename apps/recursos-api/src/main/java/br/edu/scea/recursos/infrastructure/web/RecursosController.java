package br.edu.scea.recursos.infrastructure.web;

import br.edu.scea.recursos.infrastructure.persistence.BioterioEntity;
import br.edu.scea.recursos.infrastructure.persistence.BioterioRepository;
import br.edu.scea.recursos.infrastructure.persistence.EspecieEntity;
import br.edu.scea.recursos.infrastructure.persistence.EspecieRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/recursos")
public class RecursosController {

    private final EspecieRepository especieRepository;
    private final BioterioRepository bioterioRepository;

    public RecursosController(EspecieRepository especieRepository, BioterioRepository bioterioRepository) {
        this.especieRepository = especieRepository;
        this.bioterioRepository = bioterioRepository;
    }

    @GetMapping("/especies")
    public ResponseEntity<List<EspecieEntity>> listarEspecies() {
        return ResponseEntity.ok(especieRepository.findAll());
    }

    @PostMapping("/especies")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<EspecieEntity> criarEspecie(@RequestBody EspecieEntity especie) {
        if (especie.getId() == null) especie.setId(UUID.randomUUID());
        if (especie.getCriadoEm() == null) especie.setCriadoEm(OffsetDateTime.now());
        especie.setAtivo(true);
        return ResponseEntity.ok(especieRepository.save(especie));
    }

    @GetMapping("/bioterios")
    public ResponseEntity<List<BioterioEntity>> listarBioterios() {
        return ResponseEntity.ok(bioterioRepository.findAll());
    }

    @PostMapping("/bioterios")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<BioterioEntity> criarBioterio(@RequestBody BioterioEntity bioterio) {
        if (bioterio.getId() == null) bioterio.setId(UUID.randomUUID());
        if (bioterio.getCriadoEm() == null) bioterio.setCriadoEm(OffsetDateTime.now());
        bioterio.setAtivo(true);
        return ResponseEntity.ok(bioterioRepository.save(bioterio));
    }
}
