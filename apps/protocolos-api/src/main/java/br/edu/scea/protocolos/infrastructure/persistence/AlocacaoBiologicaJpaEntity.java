package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "protocolo_especie_bioterio", schema = "protocolos")
public class AlocacaoBiologicaJpaEntity {
    @Id
    @Column(name = "id_alocacao")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_protocolo", nullable = false)
    private ProtocoloJpaEntity protocolo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_especie", nullable = false)
    private EspecieJpaEntity especie;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_bioterio", nullable = false)
    private BioterioJpaEntity bioterio;

    @Column(name = "quantidade_animais", nullable = false)
    private Integer quantidade;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloJpaEntity getProtocolo() { return protocolo; }
    public void setProtocolo(ProtocoloJpaEntity protocolo) { this.protocolo = protocolo; }
    public EspecieJpaEntity getEspecie() { return especie; }
    public void setEspecie(EspecieJpaEntity especie) { this.especie = especie; }
    public BioterioJpaEntity getBioterio() { return bioterio; }
    public void setBioterio(BioterioJpaEntity bioterio) { this.bioterio = bioterio; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
}
