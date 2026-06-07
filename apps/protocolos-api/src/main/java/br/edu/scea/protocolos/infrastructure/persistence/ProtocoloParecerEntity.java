package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "protocolo_parecer", schema = "scea")
public class ProtocoloParecerEntity {
    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "designacao_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ProtocoloDesignacaoParecerEntity designacao;

    @Column(name = "recomendacao")
    private String recomendacao;

    @Column(name = "resumo_tecnico")
    private String resumoTecnico;

    @Column(name = "consideracoes_eticas")
    private String consideracoesEticas;

    @Column(name = "submetido_em")
    private LocalDateTime submetidoEm;

    public ProtocoloParecerEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloDesignacaoParecerEntity getDesignacao() { return designacao; }
    public void setDesignacao(ProtocoloDesignacaoParecerEntity designacao) { this.designacao = designacao; }
    public String getRecomendacao() { return recomendacao; }
    public void setRecomendacao(String recomendacao) { this.recomendacao = recomendacao; }
    public String getResumoTecnico() { return resumoTecnico; }
    public void setResumoTecnico(String resumoTecnico) { this.resumoTecnico = resumoTecnico; }
    public String getConsideracoesEticas() { return consideracoesEticas; }
    public void setConsideracoesEticas(String consideracoesEticas) { this.consideracoesEticas = consideracoesEticas; }
    public LocalDateTime getSubmetidoEm() { return submetidoEm; }
    public void setSubmetidoEm(LocalDateTime submetidoEm) { this.submetidoEm = submetidoEm; }
}
