package br.edu.scea.auth.domain.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "papel", schema = "scea")
public class Papel {
    @Id
    private UUID id;

    @Column(name = "codigo", unique = true, nullable = false)
    private String codigo;

    @Column(name = "nome")
    private String nome;

    public Papel() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
