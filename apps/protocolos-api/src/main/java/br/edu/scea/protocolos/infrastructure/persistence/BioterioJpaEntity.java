package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;

@Entity
@Table(name = "bioterio", schema = "protocolos")
public class BioterioJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bioterio")
    private Integer id;

    @Column(name = "nome_bioterio", nullable = false)
    private String nome;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
