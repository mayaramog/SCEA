package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "protocolo_decisao", schema = "scea")
@Getter
@Setter
public class ProtocoloDecisaoEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @JoinColumn(name = "protocolo_id")
    private ProtocoloEntity protocolo;

    @Column(name = "reuniao_id")
    private UUID reuniaoId;

    @Column(name = "tipo_decisao")
    private String tipoDecisao;

    @Column(name = "fundamentacao")
    private String fundamentacao;

    @Column(name = "decidido_por_usuario_id")
    private UUID decididoPorUsuarioId;

    @Column(name = "decidido_em")
    private OffsetDateTime decididoEm;

    @Column(name = "valido_ate")
    private OffsetDateTime validoAte;

    @Column(name = "criado_em")
    private OffsetDateTime criadoEm;

    public ProtocoloDecisaoEntity() {}
}


