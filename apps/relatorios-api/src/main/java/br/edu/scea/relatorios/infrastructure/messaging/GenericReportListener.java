package br.edu.scea.relatorios.infrastructure.messaging;

import br.edu.scea.relatorios.application.service.DocumentGeneratorService;
import br.edu.scea.relatorios.infrastructure.persistence.RelatorioEntity;
import br.edu.scea.relatorios.infrastructure.persistence.RelatorioRepository;
import br.edu.scea.shared.events.integration.MeetingFinishedV1;
import br.edu.scea.shared.events.integration.NotificationEvent;
import br.edu.scea.shared.events.integration.ProtocolSubmittedV1;
import br.edu.scea.shared.events.integration.ReviewSubmittedV1;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class GenericReportListener {

    private static final Logger log = LoggerFactory.getLogger(GenericReportListener.class);

    private final RelatorioRepository relatorioRepository;
    private final DocumentGeneratorService documentGeneratorService;
    private final RabbitTemplate rabbitTemplate;

    public GenericReportListener(RelatorioRepository relatorioRepository, 
                                 DocumentGeneratorService documentGeneratorService,
                                 RabbitTemplate rabbitTemplate) {
        this.relatorioRepository = relatorioRepository;
        this.documentGeneratorService = documentGeneratorService;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_SUBMISSAO_NAME)
    public void onProtocolSubmitted(ProtocolSubmittedV1 event) {
        log.info("DEBUG: Gerando formulário de submissão para protocolo: {}", event.protocolId());
        try {
            String path = documentGeneratorService.generateSubmissionForm(
                event.protocolId(),
                event.codigoProtocolo(),
                event.titulo(),
                event.pesquisadorEmail(),
                event.objetivo(),
                event.resumo(),
                event.justificativa(),
                event.occurredAt().toString()
            );

            saveRelatorio(event.protocolId(), "formulario_submissao", "submissao_" + event.protocolId() + ".pdf", path);

            // 1. NOTIFICAR PESQUISADOR (Comprovante)
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_NOTIFICAR,
                new NotificationEvent(UUID.randomUUID(), event.pesquisadorEmail(), 
                "Confirmação de Submissão", "Olá! Seu protocolo foi submetido com sucesso. O comprovante está em anexo.", path));

            // 2. NOTIFICAR SECRETARIA (Aviso de novo protocolo)
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_NOTIFICAR,
                new NotificationEvent(UUID.randomUUID(), "secretariascea@gmail.com", 
                "Novo Protocolo para Designação", "O protocolo " + event.codigoProtocolo() + " (" + event.titulo() + ") aguarda designação.", null));

        } catch (Exception e) {
            log.error("ERRO ao gerar relatório de submissão: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PARECER_NAME)
    public void onReviewSubmitted(ReviewSubmittedV1 event) {
        log.info("DEBUG: Gerando parecer técnico para protocolo: {}", event.protocolId());
        try {
            String path = documentGeneratorService.generateTechnicalReview(
                event.protocolId(),
                event.codigoProtocolo(),
                event.tituloProtocolo(),
                event.pareceristaEmail(),
                event.recomendacao(),
                event.resumoTecnico(),
                event.consideracoesEticas(),
                event.occurredAt().toString()
            );

            saveRelatorio(event.protocolId(), "anexo_parecer", "parecer_tecnico_" + event.protocolId() + ".pdf", path);

            // 1. NOTIFICAR SECRETARIA (Parecer Concluído)
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_NOTIFICAR,
                new NotificationEvent(UUID.randomUUID(), "secretariascea@gmail.com", 
                "Parecer Técnico Concluído - " + event.codigoProtocolo(), 
                "O parecerista finalizou a análise do protocolo " + event.codigoProtocolo() + ". O documento está em anexo.", path));

            // 2. NOTIFICAR PARECERISTA (Cópia da análise)
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_NOTIFICAR,
                new NotificationEvent(UUID.randomUUID(), event.pareceristaEmail(), 
                "Cópia de Parecer Técnico Registrado", 
                "Confirmamos o registro do seu parecer para o protocolo " + event.codigoProtocolo() + ". Uma cópia está em anexo.", path));

        } catch (Exception e) {
            log.error("ERRO ao gerar relatório de parecer: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_REUNIAO_NAME)
    public void onMeetingFinished(MeetingFinishedV1 event) {
        log.info("DEBUG: Gerando ata de reunião: {}", event.codigoReuniao());
        try {
            String path = documentGeneratorService.generateMeetingMinutes(
                event.reuniaoId(),
                event.codigoReuniao(),
                event.dataReuniao(),
                event.local(),
                event.decisoes()
            );

            saveRelatorio(event.reuniaoId(), "ata_reuniao", "ata_" + event.codigoReuniao() + ".pdf", path);

            // NOTIFICAR SECRETARIA (Ata Pronta)
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_NOTIFICAR,
                new NotificationEvent(UUID.randomUUID(), "secretariascea@gmail.com", 
                "Ata de Reunião Finalizada", 
                "A ata da reunião " + event.codigoReuniao() + " foi gerada e está disponível para consulta.", path));

        } catch (Exception e) {
            log.error("ERRO ao gerar ata: {}", e.getMessage());
        }
    }

    private void saveRelatorio(UUID protocolId, String tipo, String fileName, String path) {
        RelatorioEntity relatorio = new RelatorioEntity();
        relatorio.setId(UUID.randomUUID());
        relatorio.setProtocoloId(protocolId);
        relatorio.setTipoDocumento(tipo);
        relatorio.setNomeArquivoOriginal(fileName);
        relatorio.setMimeType("application/pdf");
        relatorio.setCaminhoArmazenamento(path);
        relatorio.setEnviadoPorUsuarioId(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"));
        relatorio.setEnviadoEm(LocalDateTime.now());
        relatorioRepository.save(relatorio);
    }
}
