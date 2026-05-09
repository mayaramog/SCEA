package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;

@Entity
@Table(name = "especie", schema = "protocolos")
public class EspecieJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_especie")
    private Integer id;

    @Column(nullable = false)
    private String nomenclatura;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNomenclatura() { return nomenclatura; }
    public void setNomenclatura(String nomenclatura) { this.nomenclatura = nomenclatura; }
}
