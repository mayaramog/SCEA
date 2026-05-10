package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "relatorio", schema = "scea")
public class RelatorioEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "protocolo_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ProtocoloEntity protocolo;

    @Column(name = "tipo_documento")
    private String tipoDocumento;

    @Column(name = "caminho_armazenamento")
    private String caminhoArmazenamento;

    @Column(name = "nome_arquivo_original")
    private String nomeArquivoOriginal;

    @Column(name = "enviado_por_usuario_id")
    private UUID enviadoPorUsuarioId;

    @Column(name = "enviado_em")
    private OffsetDateTime enviadoEm;

    public RelatorioEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ProtocoloEntity getProtocolo() { return protocolo; }
    public void setProtocolo(ProtocoloEntity protocolo) { this.protocolo = protocolo; }
    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public String getCaminhoArmazenamento() { return caminhoArmazenamento; }
    public void setCaminhoArmazenamento(String caminhoArmazenamento) { this.caminhoArmazenamento = caminhoArmazenamento; }
    public String getNomeArquivoOriginal() { return nomeArquivoOriginal; }
    public void setNomeArquivoOriginal(String nomeArquivoOriginal) { this.nomeArquivoOriginal = nomeArquivoOriginal; }
    public UUID getEnviadoPorUsuarioId() { return enviadoPorUsuarioId; }
    public void setEnviadoPorUsuarioId(UUID enviadoPorUsuarioId) { this.enviadoPorUsuarioId = enviadoPorUsuarioId; }
    public OffsetDateTime getEnviadoEm() { return enviadoEm; }
    public void setEnviadoEm(OffsetDateTime enviadoEm) { this.enviadoEm = enviadoEm; }
}
