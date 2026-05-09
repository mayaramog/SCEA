package br.edu.scea.protocolos.infrastructure.web;

import br.edu.scea.protocolos.application.DeliberarUseCase;
import br.edu.scea.protocolos.application.EnviarParaParecerUseCase;
import br.edu.scea.protocolos.application.RegistrarParecerUseCase;
import br.edu.scea.protocolos.application.SubmeterProtocoloUseCase;
import br.edu.scea.protocolos.contracts.DeliberarRequest;
import br.edu.scea.protocolos.contracts.RegistrarParecerRequest;
import br.edu.scea.protocolos.contracts.SubmeterProtocoloRequest;
import br.edu.scea.shared.model.ator.Ator;
import br.edu.scea.shared.model.protocolo.ProtocoloId;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/protocolos")
public class ProtocoloController {
    private final SubmeterProtocoloUseCase submeterUseCase;
    private final EnviarParaParecerUseCase enviarParaParecerUseCase;
    private final RegistrarParecerUseCase registrarParecerUseCase;
    private final DeliberarUseCase deliberarUseCase;

    public ProtocoloController(
        SubmeterProtocoloUseCase submeterUseCase,
        EnviarParaParecerUseCase enviarParaParecerUseCase,
        RegistrarParecerUseCase registrarParecerUseCase,
        DeliberarUseCase deliberarUseCase
    ) {
        this.submeterUseCase = submeterUseCase;
        this.enviarParaParecerUseCase = enviarParaParecerUseCase;
        this.registrarParecerUseCase = registrarParecerUseCase;
        this.deliberarUseCase = deliberarUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('DOCENTE')")
    public ProtocoloId submeter(@RequestBody @Valid SubmeterProtocoloRequest request) {
        return submeterUseCase.executar(request);
    }

    @PatchMapping("/{id}/enviar-para-parecer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('SECRETARIA')")
    public void enviarParaParecer(
            @PathVariable UUID id, 
            @AuthenticationPrincipal Ator ator
    ) {
        enviarParaParecerUseCase.executar(id, ator);
    }

    @PatchMapping("/{id}/parecer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('PARECERISTA')")
    public void registrarParecer(
            @PathVariable UUID id, 
            @RequestBody @Valid RegistrarParecerRequest request,
            @AuthenticationPrincipal Ator ator
    ) {
        registrarParecerUseCase.executar(id, request, ator);
    }

    @PatchMapping("/{id}/deliberacao")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('PRESIDENTE_VICE')")
    public void deliberar(
            @PathVariable UUID id, 
            @RequestBody @Valid DeliberarRequest request,
            @AuthenticationPrincipal Ator ator
    ) {
        deliberarUseCase.executar(id, request, ator);
    }
}
