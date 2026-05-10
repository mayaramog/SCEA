package br.edu.scea.protocolos.infrastructure.web;

import br.edu.scea.protocolos.application.service.ProtocoloService;
import br.edu.scea.protocolos.infrastructure.persistence.*;
import br.edu.scea.shared.dto.protocolo.DesignarPareceristaRequest;
import br.edu.scea.shared.dto.protocolo.RegistrarParecerRequest;
import br.edu.scea.shared.dto.protocolo.SubmissaoProtocoloRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/protocolos")
@Tag(name = "Protocolos", description = "Gestão de protocolos de experimentação animal")
public class ProtocoloController {

    private final ProtocoloService protocoloService;

    public ProtocoloController(ProtocoloService protocoloService) {
        this.protocoloService = protocoloService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCENTE')")
    @Operation(summary = "Submeter um novo protocolo")
    public ResponseEntity<UUID> submeter(@RequestBody @Valid SubmissaoProtocoloRequest request) {
        UUID id = protocoloService.submeter(request);
        return ResponseEntity.ok(id);
    }

    @GetMapping
    @Operation(summary = "Listar todos os protocolos")
    public ResponseEntity<List<ProtocoloEntity>> listar() {
        return ResponseEntity.ok(protocoloService.listar());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar um protocolo pelo ID")
    public ResponseEntity<ProtocoloEntity> buscarPorId(
            @Parameter(description = "ID do protocolo") @PathVariable("id") UUID id) {
        return protocoloService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/designar")
    @PreAuthorize("hasAnyRole('SECRETARIA', 'ADMINISTRADOR')")
    @Operation(summary = "Designar um parecerista para o protocolo")
    public ResponseEntity<Void> designarParecerista(
            @PathVariable("id") UUID id,
            @RequestBody @Valid DesignarPareceristaRequest request) {
        protocoloService.designarParecerista(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/parecer")
    @PreAuthorize("hasRole('PARECERISTA')")
    @Operation(summary = "Registrar um parecer técnico/ético")
    public ResponseEntity<Void> registrarParecer(
            @PathVariable("id") UUID id,
            @RequestBody @Valid RegistrarParecerRequest request) {
        protocoloService.registrarParecer(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/alocacoes")
    @Operation(summary = "Listar alocações biológicas de um protocolo")
    public ResponseEntity<List<AlocacaoBiologicaEntity>> listarAlocacoes(
            @Parameter(description = "ID do protocolo") @PathVariable("id") UUID id) {
        return protocoloService.buscarPorId(id)
                .map(p -> ResponseEntity.ok(p.getAlocacoes()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/historico")
    @Operation(summary = "Ver histórico de status de um protocolo")
    public ResponseEntity<List<ProtocoloHistoricoStatusEntity>> listarHistorico(
            @Parameter(description = "ID do protocolo") @PathVariable("id") UUID id) {
        return protocoloService.buscarPorId(id)
                .map(p -> ResponseEntity.ok(p.getHistoricoStatus()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/membros")
    @Operation(summary = "Listar membros da equipe de um protocolo")
    public ResponseEntity<List<ProtocoloMembroEquipeEntity>> listarMembros(
            @Parameter(description = "ID do protocolo") @PathVariable("id") UUID id) {
        return protocoloService.buscarPorId(id)
                .map(p -> ResponseEntity.ok(p.getMembrosEquipe()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/designacoes")
    @Operation(summary = "Listar designações de parecer de um protocolo")
    public ResponseEntity<List<ProtocoloDesignacaoParecerEntity>> listarDesignacoes(
            @Parameter(description = "ID do protocolo") @PathVariable("id") UUID id) {
        return protocoloService.buscarPorId(id)
                .map(p -> ResponseEntity.ok(p.getDesignacoesParecer()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/decisoes")
    @Operation(summary = "Listar decisões tomadas sobre um protocolo")
    public ResponseEntity<List<ProtocoloDecisaoEntity>> listarDecisoes(
            @Parameter(description = "ID do protocolo") @PathVariable("id") UUID id) {
        return protocoloService.buscarPorId(id)
                .map(p -> ResponseEntity.ok(p.getDecisoes()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/relatorios")
    @Operation(summary = "Listar relatórios enviados para um protocolo")
    public ResponseEntity<List<RelatorioEntity>> listarRelatorios(
            @Parameter(description = "ID do protocolo") @PathVariable("id") UUID id) {
        return protocoloService.buscarPorId(id)
                .map(p -> ResponseEntity.ok(p.getRelatorios()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/pareceres")
    @Operation(summary = "Listar pareceres técnicos registrados")
    public ResponseEntity<List<ProtocoloParecerEntity>> listarPareceres(@PathVariable("id") UUID id) {
        return protocoloService.buscarPorId(id)
                .map(p -> {
                    List<ProtocoloParecerEntity> pareceres = p.getDesignacoesParecer().stream()
                            .map(ProtocoloDesignacaoParecerEntity::getParecer)
                            .filter(java.util.Objects::nonNull)
                            .collect(java.util.stream.Collectors.toList());
                    return ResponseEntity.ok(pareceres); 
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
