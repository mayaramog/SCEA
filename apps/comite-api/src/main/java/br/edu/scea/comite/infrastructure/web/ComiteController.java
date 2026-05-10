package br.edu.scea.comite.infrastructure.web;

import br.edu.scea.comite.application.service.CalendarioService;
import br.edu.scea.comite.infrastructure.persistence.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/comite/reunioes")
public class ComiteController {

    private final ReuniaoComiteRepository repository;
    private final CalendarioService calendarioService;

    public ComiteController(ReuniaoComiteRepository repository, CalendarioService calendarioService) {
        this.repository = repository;
        this.calendarioService = calendarioService;
    }

    @PostMapping
    public ResponseEntity<ReuniaoComiteEntity> criar(@RequestBody ReuniaoComiteEntity reuniao) {
        // Validação de Dias Úteis e Feriados
        if (reuniao.getAgendadaPara() == null) {
            throw new IllegalArgumentException("A data da reunião é obrigatória.");
        }
        calendarioService.validarDiaUtil(reuniao.getAgendadaPara(), "A reunião do comitê");

        if (reuniao.getId() == null) reuniao.setId(UUID.randomUUID());
        if (reuniao.getCriadoEm() == null) reuniao.setCriadoEm(OffsetDateTime.now());
        if (reuniao.getEstado() == null) reuniao.setEstado("agendada");
        
        return ResponseEntity.ok(repository.save(reuniao));
    }

    @GetMapping
    public ResponseEntity<List<ReuniaoComiteEntity>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{reuniaoId}")
    public ResponseEntity<ReuniaoComiteEntity> buscarPorId(@PathVariable("reuniaoId") UUID id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{reuniaoId}/protocolos/{protocoloId}")
    public ResponseEntity<Void> adicionarProtocolo(@PathVariable("reuniaoId") UUID reuniaoId, @PathVariable("protocoloId") UUID protocoloId) {
        ReuniaoComiteEntity reuniao = repository.findById(reuniaoId)
                .orElseThrow(() -> new RuntimeException("Reunião não encontrada"));
        
        ReuniaoComiteProtocoloEntity item = new ReuniaoComiteProtocoloEntity();
        item.setId(UUID.randomUUID());
        item.setReuniao(reuniao);
        item.setProtocoloId(protocoloId);
        item.setOrdemPauta(reuniao.getPauta().size() + 1);
        
        reuniao.getPauta().add(item);
        repository.save(reuniao);
        return ResponseEntity.ok().build();
    }
}
