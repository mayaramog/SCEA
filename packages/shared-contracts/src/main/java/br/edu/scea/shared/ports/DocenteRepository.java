package br.edu.scea.shared.ports;

import br.edu.scea.shared.model.ator.Docente;
import br.edu.scea.shared.model.ator.Matricula;
import java.util.Optional;
import java.util.UUID;

public interface DocenteRepository {
    void salvar(Docente docente);
    Optional<Docente> buscarPorId(UUID id);
    Optional<Docente> buscarPorMatricula(Matricula matricula);
}
