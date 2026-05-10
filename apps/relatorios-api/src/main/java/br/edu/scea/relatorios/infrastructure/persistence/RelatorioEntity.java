package br.edu.scea.relatorios.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "relatorio", schema = "scea")
public class RelatorioEntity {
    @Id
    private UUID id;

    @Column(name = "protocolo_id", nullable = false)
    private UUID protocoloId;

    @Column(name = "tipo_documento")
    private String tipoDocumento;

    @Column(name = "caminho_armazenamento")
    private String caminhoArmazenamento;

    @Column(name = "nome_arquivo_original")
    private String nomeArquivoOriginal;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "enviado_por_usuario_id", nullable = true)
    private UUID enviadoPorUsuarioId;

    @Column(name = "enviado_em")
    private OffsetDateTime enviadoEm;

    public RelatorioEntity() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getProtocoloId() { return protocoloId; }
    public void setProtocoloId(UUID protocoloId) { this.protocoloId = protocoloId; }
    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public String getCaminhoArmazenamento() { return caminhoArmazenamento; }
    public void setCaminhoArmazenamento(String caminhoArmazenamento) { this.caminhoArmazenamento = caminhoArmazenamento; }
    public String getNomeArquivoOriginal() { return nomeArquivoOriginal; }
    public void setNomeArquivoOriginal(String nomeArquivoOriginal) { this.nomeArquivoOriginal = nomeArquivoOriginal; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public UUID getEnviadoPorUsuarioId() { return enviadoPorUsuarioId; }
    public void setEnviadoPorUsuarioId(UUID enviadoPorUsuarioId) { this.enviadoPorUsuarioId = enviadoPorUsuarioId; }
    public OffsetDateTime getEnviadoEm() { return enviadoEm; }
    public void setEnviadoEm(OffsetDateTime enviadoEm) { this.enviadoEm = enviadoEm; }
}
