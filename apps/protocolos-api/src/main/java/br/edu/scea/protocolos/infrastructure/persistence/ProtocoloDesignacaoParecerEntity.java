package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
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
    private LocalDateTime atribuidoEm;

    @Column(name = "prazo_em")
    private LocalDateTime prazoEm;

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
    public LocalDateTime getAtribuidoEm() { return atribuidoEm; }
    public void setAtribuidoEm(LocalDateTime atribuidoEm) { this.atribuidoEm = atribuidoEm; }
    public LocalDateTime getPrazoEm() { return prazoEm; }
    public void setPrazoEm(LocalDateTime prazoEm) { this.prazoEm = prazoEm; }
    public String getEstadoDesignacao() { return estadoDesignacao; }
    public void setEstadoDesignacao(String estadoDesignacao) { this.estadoDesignacao = estadoDesignacao; }
    public ProtocoloParecerEntity getParecer() { return parecer; }
    public void setParecer(ProtocoloParecerEntity parecer) { this.parecer = parecer; }
}
