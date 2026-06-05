package br.edu.scea.relatorios.infrastructure.messaging;

import br.edu.scea.relatorios.application.service.ReportGeneratorService;
import br.edu.scea.relatorios.infrastructure.persistence.RelatorioEntity;
import br.edu.scea.relatorios.infrastructure.persistence.RelatorioRepository;
import br.edu.scea.shared.events.integration.NotificationEvent;
import br.edu.scea.shared.events.integration.ProtocolApprovedV1;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class ProtocolApprovedListener {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ProtocolApprovedListener.class);

    private final RelatorioRepository relatorioRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ReportGeneratorService reportGeneratorService;

    public ProtocolApprovedListener(RelatorioRepository relatorioRepository, 
                                  RabbitTemplate rabbitTemplate,
                                  ReportGeneratorService reportGeneratorService) {
        this.relatorioRepository = relatorioRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.reportGeneratorService = reportGeneratorService;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_GERACAO_NAME)
    public void onProtocolApproved(ProtocolApprovedV1 event) {
        log.info("DEBUG: Iniciando geração de PDF para protocolo: " + event.protocolId());

        try {
            // 1. Gerar o PDF Real usando o serviço melhorado
            String fullPath = reportGeneratorService.generateCertificate(
                event.protocolId(),
                event.justificativa(),
                event.dataInicio().toString(),
                event.dataTermino().toString(),
                event.occurredAt().toString()
            );

            String fileName = "certificado_" + event.protocolId() + ".pdf";

            // 2. Salvar no Banco
            RelatorioEntity relatorio = new RelatorioEntity();
            relatorio.setId(UUID.randomUUID());
            relatorio.setProtocoloId(event.protocolId());
            relatorio.setTipoDocumento("certificado_aprovacao");
            relatorio.setNomeArquivoOriginal(fileName);
            relatorio.setMimeType("application/pdf");
            relatorio.setCaminhoArmazenamento(fullPath);
            relatorio.setEnviadoPorUsuarioId(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"));
            relatorio.setEnviadoEm(LocalDateTime.now());
            relatorioRepository.save(relatorio);

            log.info("DEBUG: PDF gerado e salvo em: " + fullPath);

            // 3. Notificar o Worker
            NotificationEvent notification = new NotificationEvent(
                UUID.randomUUID(),
                event.emailPesquisador(), // Usando o e-mail real do evento
                "Certificado de Aprovação Disponível",
                "Olá! Seu protocolo " + event.protocolId() + " foi aprovado e o certificado já está disponível em anexo.",
                fullPath
            );

            rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME, 
                RabbitMQConfig.ROUTING_KEY_NOTIFICAR, 
                notification
            );
            log.info("DEBUG: Evento de notificação enviado para o Worker.");

        } catch (Exception e) {
            log.error("ERRO na geração do relatório: " + e.getMessage());
        }
    }
}
