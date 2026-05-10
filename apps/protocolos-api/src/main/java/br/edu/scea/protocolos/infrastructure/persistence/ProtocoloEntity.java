package br.edu.scea.protocolos.infrastructure.persistence;

import br.edu.scea.shared.enums.EstadoProtocolo;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "protocolo", schema = "scea")
public class ProtocoloEntity {
    @Id
    private UUID id;

    @Column(name = "codigo_protocolo", unique = true)
    private String codigoProtocolo;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "objetivo")
    private String objetivo;

    @Column(name = "resumo")
    private String resumo;

    @Column(name = "id_usuario_submetedor")
    private UUID idUsuarioSubmetedor;

    @Column(name = "nome_pesquisador_responsavel")
    private String nomePesquisadorResponsavel;

    @Column(name = "nome_departamento")
    private String nomeDepartamento;

    @Column(name = "versao_atual")
    private Integer versaoAtual;

    @Column(name = "estado")
    private String estado;

    @Column(name = "data_submissao")
    private LocalDate dataSubmissao;

    @Column(name = "data_inicio_planejada")
    private LocalDate dataInicioPlanejada;

    @Column(name = "data_termino_planejada")
    private LocalDate dataTerminoPlanejada;

    @Column(name = "quantidade_animais_aprovada")
    private Integer quantidadeAnimaisAprovada;

    @Column(name = "observacoes")
    private String observacoes;

    @Column(name = "justificativa")
    private String justificativa;

    @Column(name = "criado_em")
    private OffsetDateTime criadoEm;

    @Column(name = "atualizado_em")
    private OffsetDateTime atualizadoEm;

    @OneToMany(mappedBy = "protocolo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AlocacaoBiologicaEntity> alocacoes = new ArrayList<>();

    @OneToMany(mappedBy = "protocolo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProtocoloHistoricoStatusEntity> historicoStatus = new ArrayList<>();

    @OneToMany(mappedBy = "protocolo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProtocoloMembroEquipeEntity> membrosEquipe = new ArrayList<>();

    @OneToMany(mappedBy = "protocolo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProtocoloDesignacaoParecerEntity> designacoesParecer = new ArrayList<>();

    @OneToMany(mappedBy = "protocolo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProtocoloDecisaoEntity> decisoes = new ArrayList<>();

    @OneToMany(mappedBy = "protocolo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RelatorioEntity> relatorios = new ArrayList<>();

    public ProtocoloEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCodigoProtocolo() { return codigoProtocolo; }
    public void setCodigoProtocolo(String codigoProtocolo) { this.codigoProtocolo = codigoProtocolo; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }
    public String getResumo() { return resumo; }
    public void setResumo(String resumo) { this.resumo = resumo; }
    public UUID getIdUsuarioSubmetedor() { return idUsuarioSubmetedor; }
    public void setIdUsuarioSubmetedor(UUID idUsuarioSubmetedor) { this.idUsuarioSubmetedor = idUsuarioSubmetedor; }
    public String getNomePesquisadorResponsavel() { return nomePesquisadorResponsavel; }
    public void setNomePesquisadorResponsavel(String nomePesquisadorResponsavel) { this.nomePesquisadorResponsavel = nomePesquisadorResponsavel; }
    public String getNomeDepartamento() { return nomeDepartamento; }
    public void setNomeDepartamento(String nomeDepartamento) { this.nomeDepartamento = nomeDepartamento; }
    public Integer getVersaoAtual() { return versaoAtual; }
    public void setVersaoAtual(Integer versaoAtual) { this.versaoAtual = versaoAtual; }
    
    public EstadoProtocolo getEstado() { 
        if (this.estado == null) return null;
        for (EstadoProtocolo ep : EstadoProtocolo.values()) {
            if (ep.getCodigo().equals(this.estado)) return ep;
        }
        return null;
    }
    public void setEstado(EstadoProtocolo estado) { this.estado = (estado != null) ? estado.getCodigo() : null; }

    public LocalDate getDataSubmissao() { return dataSubmissao; }
    public void setDataSubmissao(LocalDate dataSubmissao) { this.dataSubmissao = dataSubmissao; }
    public LocalDate getDataInicioPlanejada() { return dataInicioPlanejada; }
    public void setDataInicioPlanejada(LocalDate dataInicioPlanejada) { this.dataInicioPlanejada = dataInicioPlanejada; }
    public LocalDate getDataTerminoPlanejada() { return dataTerminoPlanejada; }
    public void setDataTerminoPlanejada(LocalDate dataTerminoPlanejada) { this.dataTerminoPlanejada = dataTerminoPlanejada; }
    public Integer getQuantidadeAnimaisAprovada() { return quantidadeAnimaisAprovada; }
    public void setQuantidadeAnimaisAprovada(Integer quantidadeAnimaisAprovada) { this.quantidadeAnimaisAprovada = quantidadeAnimaisAprovada; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }
    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime criadoEm) { this.criadoEm = criadoEm; }
    public OffsetDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(OffsetDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
    
    public List<AlocacaoBiologicaEntity> getAlocacoes() { return alocacoes; }
    public void setAlocacoes(List<AlocacaoBiologicaEntity> alocacoes) { this.alocacoes = alocacoes; }
    public List<ProtocoloHistoricoStatusEntity> getHistoricoStatus() { return historicoStatus; }
    public void setHistoricoStatus(List<ProtocoloHistoricoStatusEntity> historicoStatus) { this.historicoStatus = historicoStatus; }
    public List<ProtocoloMembroEquipeEntity> getMembrosEquipe() { return membrosEquipe; }
    public void setMembrosEquipe(List<ProtocoloMembroEquipeEntity> membrosEquipe) { this.membrosEquipe = membrosEquipe; }
    public List<ProtocoloDesignacaoParecerEntity> getDesignacoesParecer() { return designacoesParecer; }
    public void setDesignacoesParecer(List<ProtocoloDesignacaoParecerEntity> designacoesParecer) { this.designacoesParecer = designacoesParecer; }
    public List<ProtocoloDecisaoEntity> getDecisoes() { return decisoes; }
    public void setDecisoes(List<ProtocoloDecisaoEntity> decisoes) { this.decisoes = decisoes; }
    public List<RelatorioEntity> getRelatorios() { return relatorios; }
    public void setRelatorios(List<RelatorioEntity> relatorios) { this.relatorios = relatorios; }
}
