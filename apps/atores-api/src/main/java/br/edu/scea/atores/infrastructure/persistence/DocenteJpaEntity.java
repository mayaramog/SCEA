package br.edu.scea.atores.infrastructure.persistence;

import br.edu.scea.shared.enums.Titulacao;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "docente", schema = "atores")
public class DocenteJpaEntity {
    @Id
    @Column(name = "id_docente")
    private UUID id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "matricula_funcionario", referencedColumnName = "matricula", unique = true)
    private FuncionarioJpaEntity funcionario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Titulacao titulacao;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public FuncionarioJpaEntity getFuncionario() { return funcionario; }
    public void setFuncionario(FuncionarioJpaEntity funcionario) { this.funcionario = funcionario; }
    public Titulacao getTitulacao() { return titulacao; }
    public void setTitulacao(Titulacao titulacao) { this.titulacao = titulacao; }
}
