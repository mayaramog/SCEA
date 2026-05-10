package br.edu.scea.recursos.infrastructure.web;

import br.edu.scea.recursos.infrastructure.persistence.BioterioEntity;
import br.edu.scea.recursos.infrastructure.persistence.BioterioRepository;
import br.edu.scea.recursos.infrastructure.persistence.EspecieEntity;
import br.edu.scea.recursos.infrastructure.persistence.EspecieRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

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

    @GetMapping("/bioterios")
    public ResponseEntity<List<BioterioEntity>> listarBioterios() {
        return ResponseEntity.ok(bioterioRepository.findAll());
    }
}
