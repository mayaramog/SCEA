package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "protocolo_membro_equipe", schema = "scea")
@Getter
@Setter
public class ProtocoloMembroEquipeEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @JoinColumn(name = "protocolo_id")
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
}


