package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "protocolo_decisao", schema = "scea")
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
    private LocalDateTime decididoEm;

    @Column(name = "valido_ate")
    private LocalDateTime validoAte;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    public ProtocoloDecisaoEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloEntity getProtocolo() { return protocolo; }
    public void setProtocolo(ProtocoloEntity protocolo) { this.protocolo = protocolo; }
    public UUID getReuniaoId() { return reuniaoId; }
    public void setReuniaoId(UUID reuniaoId) { this.reuniaoId = reuniaoId; }
    public String getTipoDecisao() { return tipoDecisao; }
    public void setTipoDecisao(String tipoDecisao) { this.tipoDecisao = tipoDecisao; }
    public String getFundamentacao() { return fundamentacao; }
    public void setFundamentacao(String fundamentacao) { this.fundamentacao = fundamentacao; }
    public UUID getDecididoPorUsuarioId() { return decididoPorUsuarioId; }
    public void setDecididoPorUsuarioId(UUID decididoPorUsuarioId) { this.decididoPorUsuarioId = decididoPorUsuarioId; }
    public LocalDateTime getDecididoEm() { return decididoEm; }
    public void setDecididoEm(LocalDateTime decididoEm) { this.decididoEm = decididoEm; }
    public LocalDateTime getValidoAte() { return validoAte; }
    public void setValidoAte(LocalDateTime validoAte) { this.validoAte = validoAte; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
