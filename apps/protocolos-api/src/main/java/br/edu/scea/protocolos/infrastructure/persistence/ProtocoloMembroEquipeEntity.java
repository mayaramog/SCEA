package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "protocolo_membro_equipe", schema = "scea")
public class ProtocoloMembroEquipeEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "protocolo_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ProtocoloEntity protocolo;

    @Column(name = "e_pesquisador_responsavel")
    private boolean ePesquisadorResponsavel;

    @Column(name = "nome_completo")
    private String nomeCompleto;

    @Column(name = "papel_institucional")
    private String papelInstitucional;

    @Column(name = "criado_em")
    private OffsetDateTime criadoEm;

    public ProtocoloMembroEquipeEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloEntity getProtocolo() { return protocolo; }
    public void setProtocolo(ProtocoloEntity protocolo) { this.protocolo = protocolo; }
    public boolean isePesquisadorResponsavel() { return ePesquisadorResponsavel; }
    public void setePesquisadorResponsavel(boolean ePesquisadorResponsavel) { this.ePesquisadorResponsavel = ePesquisadorResponsavel; }
    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }
    public String getPapelInstitucional() { return papelInstitucional; }
    public void setPapelInstitucional(String papelInstitucional) { this.papelInstitucional = papelInstitucional; }
    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime criadoEm) { this.criadoEm = criadoEm; }
}
