package br.edu.scea.protocolos.infrastructure.persistence;

import br.edu.scea.shared.enums.EstadoProtocolo;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "deliberacao", schema = "protocolos")
public class DeliberacaoJpaEntity {
    @Id
    @Column(name = "id_deliberacao")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_protocolo", referencedColumnName = "id_protocolo", unique = true)
    private ProtocoloJpaEntity protocolo;

    @Column(name = "id_docente_presidente", nullable = false)
    private UUID idDocentePresidente;

    @Column(name = "justificativa_plenario", nullable = false)
    private String justificativa;

    @Enumerated(EnumType.STRING)
    @Column(name = "decisao_final", nullable = false)
    private EstadoProtocolo decisaoFinal;

    @Column(name = "data_auditoria", nullable = false, insertable = false, updatable = false)
    private Instant dataAuditoria;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloJpaEntity getProtocolo() { return protocolo; }
    public void setProtocolo(ProtocoloJpaEntity protocolo) { this.protocolo = protocolo; }
    public UUID getIdDocentePresidente() { return idDocentePresidente; }
    public void setIdDocentePresidente(UUID idDocentePresidente) { this.idDocentePresidente = idDocentePresidente; }
    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }
    public EstadoProtocolo getDecisaoFinal() { return decisaoFinal; }
    public void setDecisaoFinal(EstadoProtocolo decisaoFinal) { this.decisaoFinal = decisaoFinal; }
    public Instant getDataAuditoria() { return dataAuditoria; }
}
