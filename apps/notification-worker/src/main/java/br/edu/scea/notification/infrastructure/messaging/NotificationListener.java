package br.edu.scea.notification.infrastructure.messaging;

import br.edu.scea.notification.application.service.EmailService;
import br.edu.scea.shared.events.integration.NotificationEvent;
import br.edu.scea.shared.events.integration.ProtocolSubmittedV1;
import br.edu.scea.shared.events.integration.ReviewSubmittedV1;
import br.edu.scea.shared.events.integration.ReviewerAssignedV1;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    private final EmailService emailService;
    private static final Logger log = LoggerFactory.getLogger(NotificationListener.class);

    public NotificationListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void onNotificationRequest(NotificationEvent event) {
        log.info("DEBUG: Processando pedido de notificação para: {}", event.recipient());

        emailService.sendEmail(
            event.recipient(),
            event.subject(),
            event.message(),
            event.attachmentPath()
        );
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_SUBMISSAO_NAME)
    public void onProtocolSubmitted(ProtocolSubmittedV1 event) {
        log.info("DEBUG: Notificando pesquisador sobre submissão: {}", event.pesquisadorEmail());
        String path = "/app/storage/reports/submissao_" + event.protocolId() + ".pdf";
        emailService.sendEmail(
            event.pesquisadorEmail(),
            "Confirmação de Submissão de Protocolo",
            "Olá! Recebemos a submissão do seu protocolo: " + event.titulo() + ". O comprovante oficial está em anexo.",
            path
        );
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_DESIGNACAO_NAME)
    public void onReviewerAssigned(ReviewerAssignedV1 event) {
        log.info("DEBUG: Notificando parecerista: {}", event.pareceristaEmail());
        emailService.sendEmail(
            event.pareceristaEmail(),
            "Nova Designação de Parecerista",
            "Olá! Você foi designado como relator para o protocolo " + event.codigoProtocolo() + " (" + event.tituloProtocolo() + "). O prazo para entrega é " + event.prazo() + ".",
            null
        );
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PARECER_NAME)
    public void onReviewSubmitted(ReviewSubmittedV1 event) {
        log.info("DEBUG: Notificando secretaria sobre parecer concluído: {}", event.codigoProtocolo());
        String path = "/app/storage/reports/parecer_tecnico_" + event.protocolId() + ".pdf";
        emailService.sendEmail(
            "secretariascea@gmail.com",
            "Parecer Técnico Concluído - " + event.codigoProtocolo(),
            "Informamos que o parecerista finalizou a análise do protocolo " + event.codigoProtocolo() + ". O documento está em anexo.",
            path
        );
    }

}
