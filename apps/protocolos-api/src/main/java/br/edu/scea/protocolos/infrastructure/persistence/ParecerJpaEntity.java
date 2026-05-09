package br.edu.scea.protocolos.infrastructure.persistence;

import br.edu.scea.shared.enums.DecisaoParecer;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "parecer", schema = "protocolos")
public class ParecerJpaEntity {
    @Id
    @Column(name = "id_parecer")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_protocolo", referencedColumnName = "id_protocolo", unique = true)
    private ProtocoloJpaEntity protocolo;

    @Column(name = "id_docente_parecerista", nullable = false)
    private UUID idDocenteParecerista;

    @Column(name = "texto_parecer", nullable = false)
    private String texto;

    @Enumerated(EnumType.STRING)
    @Column(name = "decisao_recomendada", nullable = false)
    private DecisaoParecer decisao;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloJpaEntity getProtocolo() { return protocolo; }
    public void setProtocolo(ProtocoloJpaEntity protocolo) { this.protocolo = protocolo; }
    public UUID getIdDocenteParecerista() { return idDocenteParecerista; }
    public void setIdDocenteParecerista(UUID idDocenteParecerista) { this.idDocenteParecerista = idDocenteParecerista; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public DecisaoParecer getDecisao() { return decisao; }
    public void setDecisao(DecisaoParecer decisao) { this.decisao = decisao; }
}
