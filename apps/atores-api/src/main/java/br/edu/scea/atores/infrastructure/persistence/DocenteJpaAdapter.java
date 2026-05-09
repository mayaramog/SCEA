package br.edu.scea.atores.infrastructure.persistence;

import br.edu.scea.shared.model.ator.Docente;
import br.edu.scea.shared.model.ator.Funcionario;
import br.edu.scea.shared.model.ator.Matricula;
import br.edu.scea.shared.ports.DocenteRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public class DocenteJpaAdapter implements DocenteRepository {
    private final DocenteSpringDataRepository repository;

    public DocenteJpaAdapter(DocenteSpringDataRepository repository) {
        this.repository = repository;
    }

    @Override
    public void salvar(Docente docente) {
        DocenteJpaEntity entity = new DocenteJpaEntity();
        entity.setId(docente.getId());
        entity.setTitulacao(docente.getTitulacao());
        
        Funcionario f = docente.getFuncionario();
        FuncionarioJpaEntity fe = new FuncionarioJpaEntity();
        fe.setMatricula(f.getMatricula().valor());
        fe.setNome(f.getNome());
        fe.setNascimento(f.getNascimento());
        fe.setSexo(String.valueOf(f.getSexo()));
        
        entity.setFuncionario(fe);
        repository.save(entity);
    }

    @Override
    public Optional<Docente> buscarPorId(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Docente> buscarPorMatricula(Matricula matricula) {
        return repository.findByFuncionarioMatricula(matricula.valor()).map(this::toDomain);
    }

    private Docente toDomain(DocenteJpaEntity e) {
        FuncionarioJpaEntity fe = e.getFuncionario();
        Funcionario f = new Funcionario(
            new Matricula(fe.getMatricula()),
            fe.getNome(),
            fe.getNascimento(),
            fe.getSexo().charAt(0)
        );
        
        return new Docente(
            e.getId(),
            f,
            e.getTitulacao()
        );
    }
}
