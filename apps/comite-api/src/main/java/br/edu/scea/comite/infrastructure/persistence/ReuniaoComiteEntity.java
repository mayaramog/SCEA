package br.edu.scea.comite.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@NamedQueries({
    @NamedQuery(name = "ReuniaoComiteEntity.acharPorID", query = "SELECT r FROM ReuniaoComiteEntity r WHERE r.id = :id")
})
@Entity
@Table(name = "reuniao_comite", schema = "scea")
public class ReuniaoComiteEntity {
    @Id
    private UUID id;

    @Column(name = "codigo_reuniao", unique = true, nullable = false)
    private String codigoReuniao;

    @Column(name = "agendada_para", nullable = false)
    private OffsetDateTime agendadaPara;

    @Column(name = "descricao_local")
    private String descricaoLocal;

    @Column(name = "estado", nullable = false)
    private String estado;

    @Column(name = "observacoes")
    private String observacoes;

    @Column(name = "criado_em", nullable = false)
    private OffsetDateTime criadoEm;

    @OneToMany(mappedBy = "reuniao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReuniaoComiteProtocoloEntity> pauta = new ArrayList<>();

    public ReuniaoComiteEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCodigoReuniao() { return codigoReuniao; }
    public void setCodigoReuniao(String codigoReuniao) { this.codigoReuniao = codigoReuniao; }
    public OffsetDateTime getAgendadaPara() { return agendadaPara; }
    public void setAgendadaPara(OffsetDateTime agendadaPara) { this.agendadaPara = agendadaPara; }
    public String getDescricaoLocal() { return descricaoLocal; }
    public void setDescricaoLocal(String descricaoLocal) { this.descricaoLocal = descricaoLocal; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime criadoEm) { this.criadoEm = criadoEm; }
    public List<ReuniaoComiteProtocoloEntity> getPauta() { return pauta; }
    public void setPauta(List<ReuniaoComiteProtocoloEntity> pauta) { this.pauta = pauta; }
}
