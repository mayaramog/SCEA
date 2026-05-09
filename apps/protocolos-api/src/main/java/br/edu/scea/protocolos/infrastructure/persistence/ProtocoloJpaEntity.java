package br.edu.scea.protocolos.infrastructure.persistence;

import br.edu.scea.shared.enums.EstadoProtocolo;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "protocolo", schema = "protocolos")
public class ProtocoloJpaEntity {
    @Id
    @Column(name = "id_protocolo")
    private UUID id;

    @Column(nullable = false)
    private String justificativa;

    @Column(name = "resumo_pt", nullable = false)
    private String resumoPt;

    @Column(name = "resumo_en", nullable = false)
    private String resumoEn;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_termino", nullable = false)
    private LocalDate dataTermino;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_atual", nullable = false)
    private EstadoProtocolo estado;

    @Column(name = "id_docente_pesquisador", nullable = false)
    private UUID idDocentePesquisador;

    @Version
    private Long versao;

    @OneToMany(mappedBy = "protocolo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AlocacaoBiologicaJpaEntity> alocacoes = new ArrayList<>();

    @OneToOne(mappedBy = "protocolo", cascade = CascadeType.ALL)
    private ParecerJpaEntity parecer;

    @OneToOne(mappedBy = "protocolo", cascade = CascadeType.ALL)
    private DeliberacaoJpaEntity deliberacao;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }
    public String getResumoPt() { return resumoPt; }
    public void setResumoPt(String resumoPt) { this.resumoPt = resumoPt; }
    public String getResumoEn() { return resumoEn; }
    public void setResumoEn(String resumoEn) { this.resumoEn = resumoEn; }
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    public LocalDate getDataTermino() { return dataTermino; }
    public void setDataTermino(LocalDate dataTermino) { this.dataTermino = dataTermino; }
    public EstadoProtocolo getEstado() { return estado; }
    public void setEstado(EstadoProtocolo estado) { this.estado = estado; }
    public UUID getIdDocentePesquisador() { return idDocentePesquisador; }
    public void setIdDocentePesquisador(UUID idDocentePesquisador) { this.idDocentePesquisador = idDocentePesquisador; }
    public Long getVersao() { return versao; }
    public void setVersao(Long versao) { this.versao = versao; }
    public List<AlocacaoBiologicaJpaEntity> getAlocacoes() { return alocacoes; }
    public void setAlocacoes(List<AlocacaoBiologicaJpaEntity> alocacoes) { this.alocacoes = alocacoes; }
    public ParecerJpaEntity getParecer() { return parecer; }
    public void setParecer(ParecerJpaEntity parecer) { this.parecer = parecer; }
    public DeliberacaoJpaEntity getDeliberacao() { return deliberacao; }
    public void setDeliberacao(DeliberacaoJpaEntity deliberacao) { this.deliberacao = deliberacao; }
}
