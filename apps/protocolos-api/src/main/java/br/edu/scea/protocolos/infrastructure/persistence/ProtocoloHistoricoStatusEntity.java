package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "protocolo_historico_status", schema = "scea")
public class ProtocoloHistoricoStatusEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "protocolo_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ProtocoloEntity protocolo;

    @Column(name = "estado_anterior")
    private String estadoAnterior;

    @Column(name = "novo_estado")
    private String novoEstado;

    @Column(name = "motivo_mudanca")
    private String motivoMudanca;

    @Column(name = "alterado_por_usuario_id")
    private UUID alteradoPorUsuarioId;

    @Column(name = "alterado_em")
    private OffsetDateTime alteradoEm;

    public ProtocoloHistoricoStatusEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloEntity getProtocolo() { return protocolo; }
    public void setProtocolo(ProtocoloEntity protocolo) { this.protocolo = protocolo; }
    public String getEstadoAnterior() { return estadoAnterior; }
    public void setEstadoAnterior(String estadoAnterior) { this.estadoAnterior = estadoAnterior; }
    public String getNovoEstado() { return novoEstado; }
    public void setNovoEstado(String novoEstado) { this.novoEstado = novoEstado; }
    public String getMotivoMudanca() { return motivoMudanca; }
    public void setMotivoMudanca(String motivoMudanca) { this.motivoMudanca = motivoMudanca; }
    public UUID getAlteradoPorUsuarioId() { return alteradoPorUsuarioId; }
    public void setAlteradoPorUsuarioId(UUID alteradoPorUsuarioId) { this.alteradoPorUsuarioId = alteradoPorUsuarioId; }
    public OffsetDateTime getAlteradoEm() { return alteradoEm; }
    public void setAlteradoEm(OffsetDateTime alteradoEm) { this.alteradoEm = alteradoEm; }
}
