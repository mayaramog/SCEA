package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "protocolo_historico_status", schema = "scea")
@Getter
@Setter
public class ProtocoloHistoricoStatusEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @JoinColumn(name = "protocolo_id")
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
}


