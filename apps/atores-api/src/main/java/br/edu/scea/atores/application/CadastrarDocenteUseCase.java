package br.edu.scea.atores.application;

import br.edu.scea.atores.contracts.CadastrarDocenteRequest;
import br.edu.scea.shared.model.ator.Docente;
import br.edu.scea.shared.model.ator.Funcionario;
import br.edu.scea.shared.model.ator.Matricula;
import br.edu.scea.shared.ports.DocenteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CadastrarDocenteUseCase {
    private final DocenteRepository repository;

    public CadastrarDocenteUseCase(DocenteRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void executar(CadastrarDocenteRequest request) {
        Matricula matricula = new Matricula(request.matricula());
        
        repository.buscarPorMatricula(matricula).ifPresent(d -> {
            throw new IllegalArgumentException("Docente já cadastrado com esta matrícula.");
        });

        Funcionario funcionario = new Funcionario(
            matricula,
            request.nome(),
            request.nascimento(),
            request.sexo()
        );

        Docente docente = Docente.criar(funcionario, request.titulacao());
        repository.salvar(docente);
    }
}
