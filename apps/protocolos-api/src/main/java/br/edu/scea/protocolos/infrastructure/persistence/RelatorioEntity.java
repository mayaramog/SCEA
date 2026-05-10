package br.edu.scea.protocolos.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "relatorio", schema = "scea")
@Getter
@Setter
public class RelatorioEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @JoinColumn(name = "protocolo_id")
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
}


