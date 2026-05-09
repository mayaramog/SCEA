package br.edu.scea.shared.model.ator;

import br.edu.scea.shared.enums.Titulacao;
import java.util.Objects;
import java.util.UUID;

public class Docente {
    private final UUID id;
    private final Funcionario funcionario;
    private final Titulacao titulacao;

    public Docente(UUID id, Funcionario funcionario, Titulacao titulacao) {
        this.id = Objects.requireNonNull(id, "ID do docente é obrigatório.");
        this.funcionario = Objects.requireNonNull(funcionario, "Dados de funcionário são obrigatórios.");
        this.titulacao = Objects.requireNonNull(titulacao, "Titulação é obrigatória.");
    }

    public static Docente criar(Funcionario funcionario, Titulacao titulacao) {
        return new Docente(UUID.randomUUID(), funcionario, titulacao);
    }

    public UUID getId() { return id; }
    public Funcionario getFuncionario() { return funcionario; }
    public Titulacao getTitulacao() { return titulacao; }
    
    // Helper to get name directly
    public String getNome() { return funcionario.getNome(); }
    public Matricula getMatricula() { return funcionario.getMatricula(); }
}
