package br.edu.scea.relatorios.infrastructure.web;

import br.edu.scea.relatorios.infrastructure.persistence.RelatorioEntity;
import br.edu.scea.relatorios.infrastructure.persistence.RelatorioRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
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
        List<RelatorioEntity> filtrados = repository.findAll().stream()
                .filter(r -> r.getProtocoloId().equals(protocoloId))
                .toList();
        return ResponseEntity.ok(filtrados);
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Baixar o arquivo do relatório/certificado")
    public ResponseEntity<Resource> download(@PathVariable("id") UUID id) {
        RelatorioEntity relatorio = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado"));

        File file = new File(relatorio.getCaminhoArmazenamento());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + relatorio.getNomeArquivoOriginal() + "\"")
                .body(resource);
    }
}
