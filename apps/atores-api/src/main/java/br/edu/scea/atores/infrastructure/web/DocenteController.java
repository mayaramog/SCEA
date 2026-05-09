package br.edu.scea.atores.infrastructure.web;

import br.edu.scea.atores.application.CadastrarDocenteUseCase;
import br.edu.scea.atores.contracts.CadastrarDocenteRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/docentes")
public class DocenteController {
    private final CadastrarDocenteUseCase cadastrarUseCase;

    public DocenteController(CadastrarDocenteUseCase cadastrarUseCase) {
        this.cadastrarUseCase = cadastrarUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrar(@RequestBody @Valid CadastrarDocenteRequest request) {
        cadastrarUseCase.executar(request);
    }
}
