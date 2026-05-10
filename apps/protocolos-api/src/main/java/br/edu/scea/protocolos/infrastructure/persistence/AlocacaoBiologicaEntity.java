package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "protocolo_estoque_biologico", schema = "scea")
public class AlocacaoBiologicaEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @JoinColumn(name = "protocolo_id")
    private ProtocoloEntity protocolo;

    @Column(name = "especie_id")
    private UUID especieId;

    @Column(name = "bioterio_id")
    private UUID bioterioId;

    @Column(name = "nome_linhagem")
    private String nomeLinhagem;

    @Column(name = "quantidade_planejada")
    private Integer quantidadePlanejada;

    @Column(name = "justificativa")
    private String justificativa;

    @Column(name = "sexo")
    private String sexo;

    @Column(name = "criado_em")
    private OffsetDateTime criadoEm;

    public AlocacaoBiologicaEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloEntity getProtocolo() { return protocolo; }
    public void setProtocolo(ProtocoloEntity protocolo) { this.protocolo = protocolo; }
    public UUID getEspecieId() { return especieId; }
    public void setEspecieId(UUID especieId) { this.especieId = especieId; }
    public UUID getBioterioId() { return bioterioId; }
    public void setBioterioId(UUID bioterioId) { this.bioterioId = bioterioId; }
    public String getNomeLinhagem() { return nomeLinhagem; }
    public void setNomeLinhagem(String nomeLinhagem) { this.nomeLinhagem = nomeLinhagem; }
    public Integer getQuantidadePlanejada() { return quantidadePlanejada; }
    public void setQuantidadePlanejada(Integer quantidadePlanejada) { this.quantidadePlanejada = quantidadePlanejada; }
    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }
    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }
    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime criadoEm) { this.criadoEm = criadoEm; }
}


