package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "protocolo_designacao_parecer", schema = "scea")
public class ProtocoloDesignacaoParecerEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @JoinColumn(name = "protocolo_id")
    private ProtocoloEntity protocolo;

    @Column(name = "usuario_parecerista_id")
    private UUID usuarioPareceristaId;

    @Column(name = "atribuido_por_usuario_id")
    private UUID atribuidoPorUsuarioId;

    @Column(name = "atribuido_em")
    private OffsetDateTime atribuidoEm;

    @Column(name = "prazo_em")
    private OffsetDateTime prazoEm;

    @Column(name = "estado_designacao")
    private String estadoDesignacao;

    @OneToOne(mappedBy = "designacao", cascade = CascadeType.ALL)
    private ProtocoloParecerEntity parecer;

    public ProtocoloDesignacaoParecerEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloEntity getProtocolo() { return protocolo; }
    public void setProtocolo(ProtocoloEntity protocolo) { this.protocolo = protocolo; }
    public UUID getUsuarioPareceristaId() { return usuarioPareceristaId; }
    public void setUsuarioPareceristaId(UUID usuarioPareceristaId) { this.usuarioPareceristaId = usuarioPareceristaId; }
    public UUID getAtribuidoPorUsuarioId() { return atribuidoPorUsuarioId; }
    public void setAtribuidoPorUsuarioId(UUID atribuidoPorUsuarioId) { this.atribuidoPorUsuarioId = atribuidoPorUsuarioId; }
    public OffsetDateTime getAtribuidoEm() { return atribuidoEm; }
    public void setAtribuidoEm(OffsetDateTime atribuidoEm) { this.atribuidoEm = atribuidoEm; }
    public OffsetDateTime getPrazoEm() { return prazoEm; }
    public void setPrazoEm(OffsetDateTime prazoEm) { this.prazoEm = prazoEm; }
    public String getEstadoDesignacao() { return estadoDesignacao; }
    public void setEstadoDesignacao(String estadoDesignacao) { this.estadoDesignacao = estadoDesignacao; }
    public ProtocoloParecerEntity getParecer() { return parecer; }
    public void setParecer(ProtocoloParecerEntity parecer) { this.parecer = parecer; }
}
