package br.edu.scea.relatorios.infrastructure.messaging;

import br.edu.scea.relatorios.infrastructure.persistence.RelatorioEntity;
import br.edu.scea.relatorios.infrastructure.persistence.RelatorioRepository;
import br.edu.scea.shared.events.integration.ProtocolApprovedV1;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.UUID;

@Component
public class ProtocolApprovedListener {

    private final RelatorioRepository relatorioRepository;

    public ProtocolApprovedListener(RelatorioRepository relatorioRepository) {
        this.relatorioRepository = relatorioRepository;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void onProtocolApproved(ProtocolApprovedV1 event) {
        System.out.println("DEBUG: Recebido evento de aprovação para o protocolo: " + event.protocolId());

        RelatorioEntity relatorio = new RelatorioEntity();
        relatorio.setId(UUID.randomUUID());
        relatorio.setProtocoloId(event.protocolId());
        relatorio.setTipoDocumento("certificado_aprovacao");
        relatorio.setNomeArquivoOriginal("certificado_" + event.protocolId() + ".pdf");
        relatorio.setMimeType("application/pdf");
        relatorio.setCaminhoArmazenamento("/storage/certificados/certificado_" + event.protocolId() + ".pdf");
        relatorio.setEnviadoEm(OffsetDateTime.now());
        
        try {
            relatorioRepository.save(relatorio);
            System.out.println("DEBUG: Certificado registrado com sucesso no banco de dados.");
        } catch (Exception e) {
            System.err.println("ERRO ao salvar relatório: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
