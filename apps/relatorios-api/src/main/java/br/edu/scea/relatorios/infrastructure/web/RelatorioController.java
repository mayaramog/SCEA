package br.edu.scea.relatorios.infrastructure.web;

import br.edu.scea.relatorios.infrastructure.persistence.RelatorioEntity;
import br.edu.scea.relatorios.infrastructure.persistence.RelatorioRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    private final RelatorioRepository repository;

    public RelatorioController(RelatorioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @Operation(summary = "Listar todos os relatórios/certificados")
    public ResponseEntity<List<RelatorioEntity>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/protocolo/{protocoloId}")
    @Operation(summary = "Buscar relatórios de um protocolo específico")
    public ResponseEntity<List<RelatorioEntity>> buscarPorProtocolo(@PathVariable("protocoloId") UUID protocoloId) {
        // Simples filtragem em memória para o protótipo, ou poderia ser um Query Method
        List<RelatorioEntity> filtrados = repository.findAll().stream()
                .filter(r -> r.getProtocoloId().equals(protocoloId))
                .toList();
        return ResponseEntity.ok(filtrados);
    }
}
