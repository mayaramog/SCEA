package br.edu.scea.comite.infrastructure.persistence;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "reuniao_comite_protocolo", schema = "scea")
public class ReuniaoComiteProtocoloEntity {
    @Id
    private UUID id; // Adicionando um ID para o JPA, embora a tabela original fosse composta

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reuniao_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ReuniaoComiteEntity reuniao;

    @Column(name = "protocolo_id", nullable = false)
    private UUID protocoloId;

    @Column(name = "ordem_pauta", nullable = false)
    private Integer ordemPauta;

    @Column(name = "usuario_relator_id")
    private UUID usuarioRelatorId;

    public ReuniaoComiteProtocoloEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ReuniaoComiteEntity getReuniao() { return reuniao; }
    public void setReuniao(ReuniaoComiteEntity reuniao) { this.reuniao = reuniao; }
    public UUID getProtocoloId() { return protocoloId; }
    public void setProtocoloId(UUID protocoloId) { this.protocoloId = protocoloId; }
    public Integer getOrdemPauta() { return ordemPauta; }
    public void setOrdemPauta(Integer ordemPauta) { this.ordemPauta = ordemPauta; }
    public UUID getUsuarioRelatorId() { return usuarioRelatorId; }
    public void setUsuarioRelatorId(UUID usuarioRelatorId) { this.usuarioRelatorId = usuarioRelatorId; }
}
